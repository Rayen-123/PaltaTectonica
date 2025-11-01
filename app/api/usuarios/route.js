import { NextResponse } from "next/server";
import { Usuarios } from "./Usuarios"

export async function POST(req) {
  const NuevoUsuario = await req.json();

  if (!NuevoUsuario.Nombre) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  if (!NuevoUsuario.Img){
    NuevoUsuario.Img = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Ffoto-gratis%2Fresumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg&f=1&nofb=1&ipt=8b72b9ef3050dee7534778ac2b871f9b89b1bf12a0fed0fe1f9b5434271ee60f"
  }

  NuevoUsuario.Id = (Usuarios.at(-1)?.Id ?? 0) + 1;

  Usuarios.push({ ...NuevoUsuario,
                    Calendario: {} });

  return NextResponse.json({ Id : NuevoUsuario.Id, Resp : "Usuario creado correctamente"},{status:201})
}