"use client";

export default function Calendario() {
  return (
    <div className="principal">
      <div className="semana">
        <h2>Semana</h2>
        <div className="dia">
          <h5>Lunes</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Martes</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Miércoles</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Jueves</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Viernes</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Sábado</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
        <div className="dia">
          <h5>Domingo</h5>
          <div className="comidas">
            <button className="comida">Almuerzo</button>
            <button className="comida">Cena</button>
          </div>
        </div>
      </div>
    </div>
  );
}