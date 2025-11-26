import { NextResponse } from "next/server";
import { Recetas } from "../../Recetario"


// GET /api/recetas/[id]
export function GET(req, { params }) {
  const Id = parseInt(params.id);

  const Receta = Recetas.find(r => r.Id === Id);

  if (!Receta) {
    return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
  }

  return NextResponse.json({Receta}, {status: 200});
}