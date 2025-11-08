"use client";
import { useState, useEffect } from "react";

export default function Calendario() {
  const [semanaActual, setSemanaActual] = useState(1);
  const [seleccionActual, setSeleccionActual] = useState(null);
  const [planificacion, setPlanificacion] = useState({});
  const [recetasGuardadas, setRecetasGuardadas] = useState([]);
  const [recetasApi, setRecetasApi] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const comidas = ["Desayuno", "Colacion", "Almuerzo", "Once", "Cena"];

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const planificacionGuardada = localStorage.getItem('planificacionComidas');
    const recetasGuardadasStorage = localStorage.getItem('recetasGuardadas');
    
    if (planificacionGuardada) {
      setPlanificacion(JSON.parse(planificacionGuardada));
    }
    if (recetasGuardadasStorage) {
      setRecetasGuardadas(JSON.parse(recetasGuardadasStorage));
    }
  }, []);

  // Cargar recetas de la API cuando se abre el drawer
  useEffect(() => {
    if (seleccionActual) {
      cargarRecetasDeAPI();
    }
  }, [seleccionActual]);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem('planificacionComidas', JSON.stringify(planificacion));
  }, [planificacion]);

  const cargarRecetasDeAPI = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/recetas');
      if (response.ok) {
        const data = await response.json();
        setRecetasApi(data);
      } else {
        console.error('Error al cargar recetas de la API');
      }
    } catch (error) {
      console.error('Error:', error);
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
      idUnico: `${receta.id || receta.Id}-${Date.now()}`
    };
    
    const nuevaPlanificacion = {
      ...planificacion,
      [semanaActual]: {
        ...planificacion[semanaActual],
        [seleccionActual.dia]: {
          ...planificacion[semanaActual]?.[seleccionActual.dia],
          [seleccionActual.comida]: recetaParaCalendario
        }
      }
    };
    setPlanificacion(nuevaPlanificacion);
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
    notificarCambioLista();
  };

  const obtenerRecetaPlanificada = (semana, dia, comida) => {
    return planificacion[semana]?.[dia]?.[comida] || null;
  };

  const notificarCambioLista = () => {
    window.dispatchEvent(new Event('storage'));
  };

  const cerrarDrawer = () => {
    setSeleccionActual(null);
    setRecetasApi([]);
  };

  // Componente de Paginación simple y funcional
  const PaginacionSemanas = () => {
    const totalSemanas = 52;
    
    // Mostrar páginas de 10 semanas cada una
    const semanasPorPagina = 10;
    const paginaActual = Math.ceil(semanaActual / semanasPorPagina);
    const totalPaginas = Math.ceil(totalSemanas / semanasPorPagina);
    
    const inicio = (paginaActual - 1) * semanasPorPagina + 1;
    const fin = Math.min(paginaActual * semanasPorPagina, totalSemanas);

    // Generar semanas visibles para la página actual
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
                className={`numero-semana ${semana === semanaActual ? 'activa' : ''}`}
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

  // Drawer para seleccionar recetas
  const DrawerSeleccionRecetas = () => {
    if (!seleccionActual) return null;

    return (
      <div className="drawer-overlay">
        <div className="drawer-container drawer-xl">
          <div className="drawer-header">
            <h2>
              Seleccionar receta para {seleccionActual.dia} - {seleccionActual.comida}
            </h2>
            <button onClick={cerrarDrawer} className="boton-cerrar-drawer">
              ✕
            </button>
          </div>

          <div className="drawer-content">
            {cargando ? (
              <div className="cargando-recetas">
                <p>Cargando recetas...</p>
              </div>
            ) : recetasApi.length === 0 ? (
              <div className="sin-recetas">
                <p>No se encontraron recetas disponibles.</p>
                <button onClick={cerrarDrawer} className="boton-volver">
                  Volver al calendario
                </button>
              </div>
            ) : (
              <div className="grid-recetas-drawer">
                {recetasApi.map(receta => (
                  <div 
                    key={receta.id || receta.Id} 
                    className="card-receta-drawer"
                    onClick={() => seleccionarReceta(receta)}
                  >
                    <img 
                      src={receta.Img || receta.imagen || receta.image} 
                      alt={receta.Nombre || receta.nombre} 
                      className="imagen-receta-drawer"
                      onError={(e) => {
                        e.target.src = '/placeholder-receta.jpg';
                      }}
                    />
                    <div className="info-receta-drawer">
                      <div className="nombre-receta-drawer">
                        {receta.Nombre || receta.nombre}
                      </div>
                      <div className="tags-receta-drawer">
                        {receta.Tags?.slice(0, 2).join(', ') || 
                         receta.tags?.slice(0, 2).join(', ') || 
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
    );
  };

  // Vista normal del calendario
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
                  <button 
                    className={`comida ${receta ? 'comida-con-receta' : ''}`} 
                    key={i}
                    onClick={() => seleccionarComida(dia, comida)}
                  >
                    <div className="contenido-comida">
                      <div className="nombre-comida">{comida}</div>
                      {receta ? (
                        <div className="receta-asignada">
                          <img 
                            src={receta.Img || receta.imagen} 
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Drawer para seleccionar recetas */}
      <DrawerSeleccionRecetas />
    </div>
  );
}