"use client";
import { useState, useEffect } from "react";
import Calendario from './component/calendario.js';
import Recetas from "./component/recetas.js";
import Lista from "./component/lista.js";


export default function Page() {
  const [view, setView] = useState("calendario");
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const handleViewChange = (newView) => { 
    setView(newView);
    setIsDrawerOpen(false); // Cierra el drawer al seleccionar una vista
  };

  useEffect(() => {
      async function cargarDatosIniciales() {
        try {
          setCargando(true);
          
          const resUsuario = await fetch("/api/usuarios/7")
  
          if (!resUsuario.ok) throw new Error("Error al obtener usuario");
  
          const usuarioData = await resUsuario.json();

          setUsuario(usuarioData);

        } catch (error) {
          console.error("Error cargando datos iniciales:", error);
        } finally {
          setCargando(false);
        }
      }
  
      cargarDatosIniciales();
    }, []);
  
  return (
    <>
      <div className="contenedor">
        <button 
            className="boton-abrir-drawer" 
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Abrir Menú de Navegación"
        >
            ☰
        </button>
        <div className="encabezado">
          {usuario && (
            <div className="usuario-header">
              <img
                src={usuario.Img}
                alt={usuario.Nombre}
                className="usuario-avatar"
              />
              <span className="usuario-nombre">{usuario.Nombre}</span>
            </div>
          )}
          <h3 className="titulo-header">Palta tectonica</h3>
        </div>
        <div className="main">
          <div className={`lateral ${isDrawerOpen ? 'drawer-open' : ''}`}> 
            <button className="calendario" onClick={() => handleViewChange("calendario")}>
              Calendario
            </button>
            <button className="recetas" onClick={() => handleViewChange("recetas")}>
              Recetas
            </button>
            <button className="lista" onClick={() => handleViewChange("lista")}>
              Lista
            </button>
            {/* Botón de cierre dentro del drawer (opcional) */}
            <button 
                className="boton-cerrar-drawer-lateral" 
                onClick={() => setIsDrawerOpen(false)}
            >
                ✕
            </button>
          </div>
          {/* Renderizar el componente correspondiente según la vista */}
          {view === "calendario" && <Calendario />}
          {view === "recetas" && <Recetas />}
          {view === "lista" && <Lista />}
        </div>
        <footer className="footer">
            <div className="footer-contenido">
                <div className="footer-seccion">
                    <span>© {new Date().getFullYear()} Palta Tectonica. Todos los derechos reservados.</span>
                </div>
                <div className="footer-seccion">
                    <span>Creadores: Rayen Aburto, Andy Briones, Quidel Barriga</span>
                    <span>Profesor: Julio Guerra</span>
                    <span>Asignatura: Taller de construcción de software</span>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
}