import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

function getSemanaYAñoISO(fecha = new Date()) {
  const f = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const diaSemana = f.getUTCDay() || 7;
  f.setUTCDate(f.getUTCDate() + 4 - diaSemana);
  const inicioAño = new Date(Date.UTC(f.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(((f - inicioAño) / 86400000 + 1) / 7);
  return { semana, año: f.getUTCFullYear() };
}

export async function POST(req, { params }) {
  const Nuevo = await req.json();
  const Id = parseInt(params.id, 10);

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id, calendario")
    .eq("id", Id)
    .single();

  if (error || !usuario) {
    return NextResponse.json({ error: "El usuario no existe" }, { status: 404 });
  }

  const { semana: semanaActual, año: añoActual } = getSemanaYAñoISO();
  const Dia = Nuevo.Dia;
  const Index = Nuevo.Pos - 1;

  if (Nuevo.Año === añoActual) {
    if (0 > Nuevo.Semana - semanaActual || Nuevo.Semana - semanaActual > 12) {
      return NextResponse.json(
        { error: "La fecha escapa de los limites (max 12 semanas)" },
        { status: 404 }
      );
    }
  } else if (Nuevo.Año > añoActual) {
    if (Nuevo.Semana * (Nuevo.Año - añoActual) + (42 - semanaActual) > 12) {
      return NextResponse.json(
        { error: "La fecha escapa de los limites (max 12 semanas)" },
        { status: 404 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "La fecha escapa de los limites (max 12 semanas)" },
      { status: 404 }
    );
  }

  const Año = Nuevo.Año;
  const Semana = Nuevo.Semana;

  const calendario = usuario.calendario || {};

  if (!calendario[Año]) {
    calendario[Año] = {};
  }
  if (!calendario[Año][Semana]) {
    calendario[Año][Semana] = {};
  }
  if (!calendario[Año][Semana][Dia]) {
    calendario[Año][Semana][Dia] = [{}, {}, {}, {}, {}, {}, {}];
  }

  calendario[Año][Semana][Dia][Index].Nombre = Nuevo.Menu.Nombre;
  calendario[Año][Semana][Dia][Index].Porciones = Nuevo.Menu.Porciones;
  calendario[Año][Semana][Dia][Index].Id = Nuevo.Menu.Id;

  const { error: updateError } = await supabase
    .from("usuarios")
    .update({ calendario })
    .eq("id", Id);

  if (updateError) {
    return NextResponse.json(
      { error: "Error al actualizar el calendario" },
      { status: 500 }
    );
  }

  return NextResponse.json({ Resp: "Sección cambiada correctamente" }, { status: 200 });
}

export async function DELETE(req, { params }) {
  const Eliminar = await req.json();
  const Id = parseInt(params.id, 10);

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id, calendario")
    .eq("id", Id)
    .single();

  if (error || !usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const { Año, Semana, Dia, Pos } = Eliminar;
  const Index = Pos - 1;

  const calendario = usuario.calendario || {};

  if (!(calendario?.[Año]?.[Semana]?.[Dia]?.[Index])) {
    return NextResponse.json({ Resp: "Seccion eliminada correctamente" }, { status: 200 });
  }

  calendario[Año][Semana][Dia][Index] = {};

  const { error: updateError } = await supabase
    .from("usuarios")
    .update({ calendario })
    .eq("id", Id);

  if (updateError) {
    return NextResponse.json(
      { error: "Error al actualizar el calendario" },
      { status: 500 }
    );
  }

  return NextResponse.json({ Resp: "Seccion eliminada correctamente" }, { status: 200 });
}
