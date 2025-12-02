import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("recetas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error consultando Supabase" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error("Error en servidor:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}