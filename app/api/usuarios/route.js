import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";


export async function GET() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, img, calendario")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req) {
  const nuevoUsuario = await req.json();

  if (!nuevoUsuario.nombre) {
    return NextResponse.json(
      { error: "Faltan datos: nombre" },
      { status: 400 }
    );
  }

  if (!nuevoUsuario.img) {
    nuevoUsuario.img =
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Ffoto-gratis%2Fresumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg&f=1&nofb=1";
  }

  if (!nuevoUsuario.calendario) {
    nuevoUsuario.calendario = {};
  }

  const { data, error } = await supabase
    .from("usuarios")
    .insert([nuevoUsuario])
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      Id: data.id,
      Resp: "Usuario creado correctamente",
    },
    { status: 201 }
  );
}
