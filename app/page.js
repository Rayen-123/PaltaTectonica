"use client";
import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

// Define los datos para la tabla.
const items = [
  { id: 1, name: "Leche", category: "Lácteos", price: "$1.200" },
  { id: 2, name: "Pan", category: "Panadería", price: "$1.500" },
  { id: 3, name: "Manzanas", category: "Frutas", price: "$2.000" },
];

export default function Page() {
	const [view, setView] = useState("calendario");
	return (
		<>
			<div className="contenedor">
				<div className="encabezado"></div>
				<div className="main">
					<div className="lateral">
						<button className="calendario" onClick={() => setView("calendario")}>Calendario</button>
						<button className="recetas" onClick={() => setView("recetas")}>Recetas</button>
						<button className="lista" onClick={() => setView("lista")}>Lista</button>
					</div>
					{/* Sección calendario (tu código original completo) */}
            		{view === "calendario" && (
						<div className="principal">
							<div className="semana">
								<h2>Semana</h2>
								<div className="dia">
									<h5>Lunes</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Martes</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Miércoles</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Jueves</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Viernes</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Sábado</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
								<div className="dia">
									<h5>Domingo</h5>
									<div className="comidas">
									<button className="comida">Almuerzo</button>
									<button className="comida">Cena</button>
									</div>
								</div>
							</div>
						</div>
					)}
					{/* Sección recetas (pendiente de rellenar) */}
					{view === "recetas" && (
						<div className="seccion">
							<h2>Recetas</h2>
							<p>Aquí se mostrarán tus recetas.</p>
						</div>
					)}

					{/* Sección lista (tabla de Chakra UI) */}
					{view === "lista" && (
						<div className="principal">
							<h2>Lista de compras</h2>
							<TableContainer>
								<Table size="sm">
								<Thead>
									<Tr>
									<Th>Producto</Th>
									<Th>Categoría</Th>
									<Th textAlign="end">Precio</Th>
									</Tr>
								</Thead>
								<Tbody>
									{items.map((item) => (
									<Tr key={item.id}>
										<Td>{item.name}</Td>
										<Td>{item.category}</Td>
										<Td textAlign="end">{item.price}</Td>
									</Tr>
									))}
								</Tbody>
								</Table>
							</TableContainer>
						</div>
					)}
				</div>
			</div>
		</>
	)
}