import { NextResponse } from "next/server";
import { Usuarios } from "../../Usuarios";

function getSemanaYAñoISO(fecha = new Date()) {
  const f = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const diaSemana = f.getUTCDay() || 7;
  f.setUTCDate(f.getUTCDate() + 4 - diaSemana);
  const inicioAño = new Date(Date.UTC(f.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(((f - inicioAño) / 86400000 + 1) / 7);
  return { semana, año: f.getUTCFullYear() };
}

export async function POST(req, {params}){
    const Nuevo = await req.json();
    const Id = params.id
    const Usuario = Usuarios.find(u => u.Id == Id)

    if (!Usuario){
        return NextResponse.json({error: "El usuario no existe"}, {status: 404})
    }   

    const {Semana, Año} = getSemanaYAñoISO()
    const Dia = Nuevo.Dia
    const Index = Nuevo.Pos -1

    if (Nuevo.Año == Año){
        if ( (0 > Nuevo.Semana - Semana) || (Nuevo.Semana - Semana > 12)) return NextResponse.json({error: "La fecha escapa de los limites (max 12 semanas)"}, {status: 404})
    }
    else if (Nuevo.Año > Año){
        if ((Nuevo.Semana*(Nuevo.Año-Año) + (42 - Semana)) > 12) return NextResponse.json({error: "La fecha escapa de los limites (max 12 semanas)"}, {status: 404})
    }
    else{
        return NextResponse.json({error: "La fecha escapa de los limites (max 12 semanas)"}, {status: 404})
    }

    if (!Usuario.Calendario){
        Usuario.Calendario = {};
    }
    if (!Usuario.Calendario[Año]){
        Usuario.Calendario[Año] = {};
    }
    if (!Usuario.Calendario[Año][Semana]){
       Usuario.Calendario[Año][Semana] = {};
    }
    if (!Usuario.Calendario[Año][Semana][Dia]){
        Usuario.Calendario[Año][Semana][Dia] = [{},{},{},{},{},{},{}];
    }

    
    Usuario.Calendario[Año][Semana][Dia][Index].Nombre = Nuevo.Menu.Nombre
    Usuario.Calendario[Año][Semana][Dia][Index].Porciones = Nuevo.Menu.Porciones
    Usuario.Calendario[Año][Semana][Dia][Index].Id = Nuevo.Menu.Id
    

    return NextResponse.json({Resp: "Sección cambiada correctamente"},{status: 200})
}

export async function DELETE(req, {params}) {
    const Eliminar = await req.json();
    const Id = params.id
    const Usuario = Usuarios.find(u => u.Id == Id)

    if (!Usuario){
        return NextResponse.json({error: "Usuario no encontrado"},{status: 404})
    }

    const {Año, Semana, Dia} = Eliminar
    const Index = Eliminar.Pos -1

    if  (!(Usuario.Calendario?.[Año]?.[Semana]?.[Dia]?.[Index])){
        return NextResponse.json({Resp: "Seccion eliminada correctamente"}, {status: 200})
    }

    Usuario.Calendario[Año][Semana][Dia][Index] = {}
    return NextResponse.json({Resp: "Seccion eliminada correctamente"}, {status: 200})
}