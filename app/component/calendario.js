"use client";
import { useState, useEffect } from "react";

export default function Calendario() {
  const [semanaActual, setSemanaActual] = useState(1);
  const [seleccionActual, setSeleccionActual] = useState(null);
  const [planificacion, setPlanificacion] = useState({});
  const [recetasGuardadas, setRecetasGuardadas] = useState([]);
  const [recetasApi, setRecetasApi] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [query, setQuery] = useState("");
  const [recetasFiltradas, setRecetasFiltradas] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const comidas = ["Desayuno", "Colacion", "Almuerzo", "Once", "Cena"];

  useEffect(() => {
    async function cargarDatosIniciales() {
      try {
        setCargando(true);

        const [resUsuario, resRecetas] = await Promise.all([
          fetch("/api/usuarios/7"),
          fetch("/api/recetas"),
        ]);

        if (!resUsuario.ok) throw new Error("Error al obtener usuario");
        if (!resRecetas.ok) throw new Error("Error al obtener recetas");

        const usuarioData = await resUsuario.json();
        console.log("USUARIO CARGADO:", usuarioData);
        console.log("ID DEL USUARIO =", usuarioData.Id)
        const recetasData = await resRecetas.json();

        setUsuario(usuarioData);
        setRecetasApi(recetasData);
        setRecetasFiltradas(recetasData);

        if (usuarioData.Calendario) {
          const plan = construirPlanificacionDesdeUsuario(
            usuarioData.Calendario,
            recetasData
          );
          setPlanificacion(plan);
        }

        const recetasGuardadasStorage = localStorage.getItem("recetasGuardadas");
        if (recetasGuardadasStorage) {
          setRecetasGuardadas(JSON.parse(recetasGuardadasStorage));
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (seleccionActual) {
      cargarRecetasDeAPI();
    }
  }, [seleccionActual]);

  useEffect(() => {
    localStorage.setItem("planificacionComidas", JSON.stringify(planificacion));
  }, [planificacion]);

  function construirPlanificacionDesdeUsuario(calendarioUsuario, recetasLista) {
    const plan = {};
    const mapaRecetas = {};

    recetasLista.forEach((r) => {
      mapaRecetas[r.id || r.Id] = r;
    });

    const entries = Object.entries(calendarioUsuario || {});
    if (entries.length === 0) return plan;

    const esEstructuraUnaSemana = entries.some(([, value]) => Array.isArray(value));

    if (esEstructuraUnaSemana) {
      const semana = 1;
      plan[semana] = {};

      Object.entries(calendarioUsuario).forEach(([numeroDia, itemsDia]) => {
        const indiceDia = parseInt(numeroDia, 10) - 1;
        const nombreDia = dias[indiceDia];
        if (!nombreDia) return;
        if (!Array.isArray(itemsDia)) return;

        if (!plan[semana][nombreDia]) {
          plan[semana][nombreDia] = {};
        }

        itemsDia.forEach((item, indexComida) => {
          if (!item) return;
          const recetaBase = mapaRecetas[item.id];
          if (!recetaBase) return;

          const nombreComida = comidas[indexComida] || `Comida${indexComida + 1}`;

          plan[semana][nombreDia][nombreComida] = {
            ...recetaBase,
            Porciones: item.Porciones ?? 1,
          };
        });
      });

      return plan;
    }

    entries.forEach(([semanaKey, diasObj]) => {
      const semana = parseInt(semanaKey, 10);
      if (!plan[semana]) plan[semana] = {};
      if (!diasObj || typeof diasObj !== "object") return;

      Object.entries(diasObj).forEach(([numeroDia, itemsDia]) => {
        const indiceDia = parseInt(numeroDia, 10) - 1;
        const nombreDia = dias[indiceDia];
        if (!nombreDia) return;
        if (!Array.isArray(itemsDia)) return;

        if (!plan[semana][nombreDia]) {
          plan[semana][nombreDia] = {};
        }

        itemsDia.forEach((item, indexComida) => {
          if (!item) return;
          const recetaBase = mapaRecetas[item.id];
          if (!recetaBase) return;

          const nombreComida = comidas[indexComida] || `Comida${indexComida + 1}`;

          plan[semana][nombreDia][nombreComida] = {
            ...recetaBase,
            Porciones: item.Porciones ?? 1,
          };
        });
      });
    });

    return plan;
  }


  function construirCalendarioParaBackend(plan) {
    const calendario = {};

    Object.entries(plan || {}).forEach(([semanaKey, semanaPlan]) => {
      const semanaNumero = String(semanaKey);
      const semanaBackend = {};

      dias.forEach((diaNombre, indexDia) => {
        const comidasDia = semanaPlan[diaNombre] || {};
        const items = [];

        comidas.forEach((comidaNombre, indexComida) => {
          const receta = comidasDia[comidaNombre];
          if (!receta) return;

          items[indexComida] = {
            id: receta.id || receta.Id,
            Porciones: receta.Porciones ?? 1,
          };
        });

        while (items.length && items[items.length - 1] === undefined) {
          items.pop();
        }

        if (items.length > 0) {
          const numeroDia = String(indexDia + 1);
          semanaBackend[numeroDia] = items;
        }
      });

      if (Object.keys(semanaBackend).length > 0) {
        calendario[semanaNumero] = semanaBackend;
      }
    });

    return calendario;
  }



  async function guardarCalendarioEnServidor(planActual) {
    if (!usuario || !usuario.Id) return;

    const nuevoCalendario = construirCalendarioParaBackend(planActual);

    try {
      await fetch(`/api/usuarios/${usuario.Id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Id: usuario.Id,
          Calendario: nuevoCalendario,
        }),
      });
    } catch (err) {
      console.error("Error guardando calendario en servidor:", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      buscarRecetas();
    }
  }

  function recargar() {
    setQuery("");
    setRecetasFiltradas(recetasApi);
  }

  function buscarRecetas() {
    const texto = query.trim().toLowerCase();

    if (texto === "") {
      setRecetasFiltradas(recetasApi);
      return;
    }

    const temp = recetasApi.filter((receta) =>
      (receta.Nombre || receta.nombre || "").toLowerCase().includes(texto)
    );

    setRecetasFiltradas(temp);
  }

  const cargarRecetasDeAPI = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/recetas");
      if (response.ok) {
        const data = await response.json();
        setRecetasApi(data);
        setRecetasFiltradas(data);
      } else {
        console.error("Error al cargar recetas de la API");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const irASemana = (numeroSemana) => {
    setSemanaActual(numeroSemana);
    setSeleccionActual(null);
  };

  const seleccionarComida = (dia, comida) => {
    setSeleccionActual({ dia, comida });
  };

  const seleccionarReceta = (receta) => {
    if (!seleccionActual) return;

    const recetaParaCalendario = {
      ...receta,
      idUnico: `${receta.id || receta.Id}-${Date.now()}`,
    };

    const nuevaPlanificacion = {
      ...planificacion,
      [semanaActual]: {
        ...planificacion[semanaActual],
        [seleccionActual.dia]: {
          ...planificacion[semanaActual]?.[seleccionActual.dia],
          [seleccionActual.comida]: recetaParaCalendario,
        },
      },
    };

    setPlanificacion(nuevaPlanificacion);
    guardarCalendarioEnServidor(nuevaPlanificacion);
    setSeleccionActual(null);
    notificarCambioLista();
  };

  const eliminarReceta = (dia, comida, e) => {
    e.stopPropagation();
    const nuevaPlanificacion = { ...planificacion };

    if (nuevaPlanificacion[semanaActual]?.[dia]?.[comida]) {
      delete nuevaPlanificacion[semanaActual][dia][comida];

      if (Object.keys(nuevaPlanificacion[semanaActual][dia]).length === 0) {
        delete nuevaPlanificacion[semanaActual][dia];
      }
      if (Object.keys(nuevaPlanificacion[semanaActual]).length === 0) {
        delete nuevaPlanificacion[semanaActual];
      }
    }

    setPlanificacion(nuevaPlanificacion);
    guardarCalendarioEnServidor(nuevaPlanificacion);
    notificarCambioLista();
  };

  const obtenerRecetaPlanificada = (semana, dia, comida) => {
    return planificacion[semana]?.[dia]?.[comida] || null;
  };

  const notificarCambioLista = () => {
    window.dispatchEvent(new Event("storage"));
  };

  const cerrarDrawer = () => {
    setSeleccionActual(null);
    setRecetasApi([]);
  };

  const PaginacionSemanas = () => {
    const totalSemanas = 52;
    const semanasPorPagina = 10;
    const paginaActual = Math.ceil(semanaActual / semanasPorPagina);
    const totalPaginas = Math.ceil(totalSemanas / semanasPorPagina);
    const inicio = (paginaActual - 1) * semanasPorPagina + 1;
    const fin = Math.min(paginaActual * semanasPorPagina, totalSemanas);

    const semanasVisibles = [];
    for (let i = inicio; i <= fin; i++) {
      semanasVisibles.push(i);
    }

    const irAPaginaAnterior = () => {
      if (paginaActual > 1) {
        const nuevaSemana = (paginaActual - 2) * semanasPorPagina + 1;
        setSemanaActual(nuevaSemana);
      }
    };

    const irAPaginaSiguiente = () => {
      if (paginaActual < totalPaginas) {
        const nuevaSemana = paginaActual * semanasPorPagina + 1;
        setSemanaActual(nuevaSemana);
      }
    };

    return (
      <div className="paginacion-semanas">
        <div className="controles-paginacion">
          <button
            onClick={irAPaginaAnterior}
            disabled={paginaActual === 1}
            className="boton-paginacion anterior"
            title="Página anterior"
          >
            ‹
          </button>

          <div className="numeros-semanas">
            {semanasVisibles.map((semana) => (
              <button
                key={semana}
                onClick={() => irASemana(semana)}
                className={`numero-semana ${
                  semana === semanaActual ? "activa" : ""
                }`}
                title={`Semana ${semana}`}
              >
                {semana}
              </button>
            ))}
          </div>

          <button
            onClick={irAPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="boton-paginacion siguiente"
            title="Página siguiente"
          >
            ›
          </button>
        </div>

        <div className="info-paginacion">
          <span className="rango-semanas">
            Semanas {inicio}-{fin} de {totalSemanas}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="principal-calendario">
      <div className="controles-semana">
        <div className="titulo-semana">
          <h2>Semana {semanaActual}</h2>
          <PaginacionSemanas />
        </div>
      </div>

      <div className="semana">
        {dias.map((dia, index) => (
          <div className="dia" key={index}>
            <h5>{dia}</h5>
            <div className="comidas">
              {comidas.map((comida, i) => {
                const receta = obtenerRecetaPlanificada(semanaActual, dia, comida);
                return (
                  <div
                    className={`comida ${receta ? "comida-con-receta" : ""}`}
                    key={i}
                    onClick={() => seleccionarComida(dia, comida)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        seleccionarComida(dia, comida);
                      }
                    }}
                  >
                    <div className="contenido-comida">
                      <div className="nombre-comida">{comida}</div>
                      {receta ? (
                        <div className="receta-asignada">
                          <img
                            src={receta.Img || receta.img}
                            alt={receta.Nombre || receta.nombre}
                            className="imagen-receta-calendario"
                          />
                          <div className="fila-receta">
                            <span className="nombre-receta-completo">
                              {receta.Nombre || receta.nombre}
                            </span>
                            <button
                              onClick={(e) => eliminarReceta(dia, comida, e)}
                              className="boton-eliminar-receta"
                              title="Eliminar receta"
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mensaje-agregar-receta">
                          Click para agregar
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {seleccionActual && (
        <div className="drawer-overlay">
          <div className="drawer-container drawer-xl">
            <div className="drawer-header">
              <h2>
                Seleccionar receta para {seleccionActual.dia} -{" "}
                {seleccionActual.comida}
              </h2>
              <button onClick={cerrarDrawer} className="boton-cerrar-drawer">
                ✕
              </button>
            </div>

            <div className="drawer-content">
              <div className="busqueda-container-drawer">
                <input
                  type="text"
                  placeholder="Buscar receta..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="buscador"
                />
                <button className="boton-busqueda" onClick={buscarRecetas}>
                  Buscar
                </button>
                <button className="boton-busqueda-recarga" onClick={recargar}>
                  Recargar
                </button>
              </div>

              {cargando ? (
                <div className="cargando-recetas">
                  <p>Cargando recetas...</p>
                </div>
              ) : recetasFiltradas.length === 0 ? (
                <div className="sin-recetas">
                  <p>No se encontraron recetas con ese criterio.</p>
                  <button onClick={recargar} className="boton-volver">
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="grid-recetas-drawer">
                  {recetasFiltradas.map((receta) => (
                    <div
                      key={receta.id || receta.Id}
                      className="card-receta-drawer"
                      onClick={() => seleccionarReceta(receta)}
                    >
                      <img
                        src={receta.Img || receta.img}
                        alt={receta.Nombre || receta.nombre}
                        className="imagen-receta-drawer"
                        onError={(e) => {
                          e.target.src = "/placeholder-receta.jpg";
                        }}
                      />
                      <div className="info-receta-drawer">
                        <div className="nombre-receta-drawer">
                          {receta.Nombre || receta.nombre}
                        </div>
                        <div className="tags-receta-drawer">
                          {receta.Tags?.slice(0, 2).join(", ") ||
                            receta.tags?.slice(0, 2).join(", ") ||
                            receta.categoria}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
