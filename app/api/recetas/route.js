import {NextResponse} from "next/server";
import {recetas} from "../Recetario";

export function GET(req, {params}){
    return NextResponse.json(recetas, {status: 200});
}