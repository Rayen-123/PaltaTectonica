"use client";
import { useState, useEffect } from "react";

export default function Calendario() {
  const [semanaActual, setSemanaActual] = useState(1);
  const [seleccionActual, setSeleccionActual] = useState(null);
  const [planificacion, setPlanificacion] = useState({});
  const [recetasGuardadas, setRecetasGuardadas] = useState([]);
  
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

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem('planificacionComidas', JSON.stringify(planificacion));
  }, [planificacion]);

  const semanaAnterior = () => {
    if (semanaActual > 1) {
      setSemanaActual(semanaActual - 1);
      setSeleccionActual(null);
    }
  };

  const semanaSiguiente = () => {
    setSemanaActual(semanaActual + 1);
    setSeleccionActual(null);
  };

  const seleccionarComida = (dia, comida) => {
    setSeleccionActual({ dia, comida });
  };

  const seleccionarReceta = (receta) => {
    if (!seleccionActual) return;
    
    const recetaParaCalendario = {
      ...receta,
      idUnico: `${receta.Id}-${Date.now()}`
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
    // Disparar un evento personalizado para que lista.js se actualice
    window.dispatchEvent(new Event('storage'));
  };
  const cancelarSeleccion = () => {
    setSeleccionActual(null);
  };

  // Si hay una selección activa, mostrar las recetas
  if (seleccionActual) {
    return (
      <div className="principal-calendario">
        <div className="controles-semana">
          <button onClick={cancelarSeleccion} className="boton-volver">
            ← Volver al calendario
          </button>
          
          <h2>Seleccionar receta para {seleccionActual.dia} - {seleccionActual.comida}</h2>
          
          <div className="mensaje-reutilizable">
            Puedes usar la misma receta múltiples veces
          </div>
        </div>

        <div className="semana">
          {recetasGuardadas.length === 0 ? (
            <div className="sin-recetas-guardadas">
              <p>No tienes recetas guardadas. Ve a la sección de recetas y guarda algunas primero.</p>
              <button onClick={cancelarSeleccion} className="boton-volver-calendario">
                Volver al calendario
              </button>
            </div>
          ) : (
            <div className="grid-recetas">
              {recetasGuardadas.map(receta => (
                <div 
                  key={receta.Id} 
                  className="card-receta-seleccion"
                  onClick={() => seleccionarReceta(receta)}
                >
                  <img 
                    src={receta.Img} 
                    alt={receta.Nombre} 
                    className="imagen-receta-seleccion"
                  />
                  <div className="nombre-receta-seleccion">{receta.Nombre}</div>
                  <div className="tags-receta-seleccion">
                    {receta.Tags?.slice(0, 2).join(', ')}
                  </div>
                  <div className="mensaje-reutilizable-card">
                    ✓ Puedes usar esta receta múltiples veces
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista normal del calendario
  return (
    <div className="principal-calendario">
      <div className="controles-semana">
        <button onClick={semanaAnterior} disabled={semanaActual === 1}>
          ← Semana Anterior
        </button>
        
        <h2>Semana {semanaActual}</h2>
        
        <button onClick={semanaSiguiente}>
          Semana Siguiente →
        </button>
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
                          <span className="nombre-receta-asignada">{receta.Nombre}</span>
                          <button 
                            onClick={(e) => eliminarReceta(dia, comida, e)}
                            className="boton-eliminar-receta"
                            title="Eliminar receta"
                          >
                            ✕
                          </button>
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
    </div>
  );
}