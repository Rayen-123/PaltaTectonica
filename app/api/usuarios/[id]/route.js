import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req, { params }) {
  const Id = parseInt(params.id, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", Id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Usuario no encontrada" },
      { status: 404 }
    );
  }

  const Usuario = {
    Id: data.id,
    Nombre: data.nombre,
    Img: data.img,
    Calendario: data.calendario,
  };

  return NextResponse.json(Usuario, { status: 200 });
}

export async function POST(req, { params }) {
  const CambioUsuario = await req.json();

  if (!CambioUsuario.Id) {
    return NextResponse.json(
      { error: "Debe entregar el id del usuario" },
      { status: 400 }
    );
  }

  const Id = parseInt(params.id, 10);

  const { data: existente, error: selectError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", Id)
    .maybeSingle();

  if (selectError) {
    console.error(selectError);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }

  if (!existente) {
    return NextResponse.json(
      { error: "Usuario no encontrada" },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabase
    .from("usuarios")
    .update({
      nombre: CambioUsuario.Nombre ?? existente.nombre,
      img: CambioUsuario.Img ?? existente.img,
      calendario: CambioUsuario.Calendario ?? existente.calendario, // 👈 NUEVO
    })
  .eq("id", Id);

  if (updateError) {
    console.error(updateError);
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { Resp: "Usuario cambiado correctamente" },
    { status: 204 }
  );
}

export async function DELETE(req, { params }) {
  const UsuarioEliminar = await req.json();

  if (!UsuarioEliminar.Id) {
    return NextResponse.json(
      { error: "Debe entregar el id del usuario" },
      { status: 400 }
    );
  }

  const Id = parseInt(params.id, 10);

  const { data: existente, error: selectError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", Id)
    .maybeSingle();

  if (selectError) {
    console.error(selectError);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }

  if (!existente) {
    return NextResponse.json(
      { error: "Usuario no encontrada" },
      { status: 404 }
    );
  }

  if (!(UsuarioEliminar.Nombre == existente.nombre)) {
    return NextResponse.json(
      { error: "Los nombres no coinciden" },
      { status: 400 }
    );
  }

  const { error: deleteError } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", Id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { Resp: "El usuario ha sido eliminado" },
    { status: 200 }
  );
}
