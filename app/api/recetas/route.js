import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("recetas")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: "Error al obtener recetas" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}