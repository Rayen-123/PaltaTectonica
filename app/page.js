"use client";
import { useState } from "react";
import Calendario from './component/calendario.js';
import Recetas from "./component/recetas.js";
import Lista from "./component/lista.js";

export default function Page() {
  const [view, setView] = useState("calendario");
  
  return (
    <>
      <div className="contenedor">
        <div className="encabezado"></div>
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
      </div>
    </>
  );
}