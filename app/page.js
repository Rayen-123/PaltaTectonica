"use client";
import { useState, useEffect } from "react";
import Calendario from './component/calendario.js';
import Recetas from "./component/recetas.js";
import Lista from "./component/lista.js";


export default function Page() {
  const [view, setView] = useState("calendario");
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

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
          <div className="lateral">
            <button className="calendario" onClick={() => setView("calendario")}>
              Calendario
            </button>
            <button className="recetas" onClick={() => setView("recetas")}>
              Recetas
            </button>
            <button className="lista" onClick={() => setView("lista")}>
              Lista
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