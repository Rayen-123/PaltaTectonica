import { NextResponse } from "next/server";
import { Usuarios } from "../Usuarios"


export function GET(req, {params}){
    const Id = params.id
    const Usuario = Usuarios.find(u => u.Id == Id);

    if (!Usuario){
        return NextResponse.json({ error: "Usuario no encontrada" }, { status: 404 });
    }

    return NextResponse.json(Usuario)
}


export async function POST(req, {params}){
    const CambioUsuario = await req.json();

    if (!CambioUsuario.Id){
        return NextResponse.json({ error: "Debe entregar el id del usuario" }, { status: 400 });
    }

    const Id = params.id
    const Usuario = Usuarios.find(u => u.Id == Id)

    if (!Usuario){
        return NextResponse.json({ error: "Usuario no encontrada" }, { status: 404 });
    }

    Usuario.Nombre = CambioUsuario.Nombre
    Usuario.Img = CambioUsuario.Img

    return NextResponse.json({ Resp: "Usuario cambiado correctamente" }, { status: 204 });
}

export async function DELETE(req, {params}){
    const UsuarioEliminar = await req.json();

    if (!UsuarioEliminar.Id){
        return NextResponse.json({ error: "Debe entregar el id del usuario" }, { status: 400 });
    }

    const Id = params.id
    const Usuario = Usuarios.find(u => u.Id == Id)

    if (!Usuario){
        return NextResponse.json({ error: "Usuario no encontrada" }, { status: 404 });
    }

    if (!(UsuarioEliminar.Nombre == Usuario.Nombre)){
        return NextResponse.json({ error: "Los nombres no coinciden" }, { status: 400 });
    }

    const UsuarioIndex = Usuarios.findIndex(u => u.Id == Id)
    Usuarios.splice(UsuarioIndex, 1);


    return NextResponse.json({ Resp: "El usuario ha sido eliminado" }, { status: 200 })
}