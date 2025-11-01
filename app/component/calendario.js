"use client";

export default function Calendario() {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const comidas = ["Desayuno", "Colacion", "Almuerzo", "Once", "Cena"];

  return (
    <div className="principal-calendario">
      <div className="semana">
        <h2>Semana X</h2>
        {dias.map((dia, index) => (
          <div className="dia" key={index}>
            <h5>{dia}</h5>
            <div className="comidas">
              {comidas.map((comida, i) => (
                <button className="comida" key={i}>
                  {comida}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
