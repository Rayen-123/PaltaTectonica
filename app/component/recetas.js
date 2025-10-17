"use client";
import { Button, Card, Image, Text } from "@chakra-ui/react"
import { useState } from "react";

export default function Recetas() {
  const [recetas, setRecetas] = useState([
    {
      id: 1,
      nombre: "Fideos Alfredo",
      imagen: "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/ab38ac92e476df5eba29a83a3acb723e.jpg",
      ingredientes: ["Fettuccine", "Crema de leche", "Queso parmesano", "Mantequilla", "Ajo", "Perejil"],
      instrucciones: "Cocinar la pasta al dente. En una sartén, derretir mantequilla y sofreír el ajo. Agregar crema y queso parmesano. Mezclar con la pasta y servir.",
      tiempo: "30 min",
      porciones: 4
    },
    {
      id: 2,
      nombre: "Ensalada César",
      imagen: "https://www.goodnes.com/sites/g/files/jgfbjl321/files/srh_recipes/755f697272cbcdc6e5df2adb44b1b705.jpg",
      ingredientes: ["Lechuga romana", "Pollo", "Crutones", "Queso parmesano", "Salsa César"],
      instrucciones: "Lavar y cortar la lechuga. Cocinar el pollo y cortarlo en tiras. Mezclar todos los ingredientes y añadir la salsa César.",
      tiempo: "20 min",
      porciones: 2
    },
    {
      id: 3,
      nombre: "Tacos Mexicanos",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSskCR0-vqiWM4TZgN8VmYkvGoFRGXXGeFp5A&s",
      ingredientes: ["Tortillas de maíz", "Carne molida", "Cebolla", "Cilantro", "Salsa", "Limón"],
      instrucciones: "Cocinar la carne con especias. Calentar las tortillas. Servir la carne en tortillas y agregar toppings al gusto.",
      tiempo: "25 min",
      porciones: 3
    }
  ]);

  const [tarjetasGiradas, setTarjetasGiradas] = useState({});

  const girarTarjeta = (id) => {
    setTarjetasGiradas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="principal-recetas">
      <h2>Recetas</h2>
      <div className="contenedor-tarjetas">
        {recetas.map(receta => (
          <div key={receta.id} className={`contenedor-tarjeta ${tarjetasGiradas[receta.id] ? 'girada' : ''}`}>
            <div className="tarjeta-frente">
              <Card.Root maxW="sm" overflow="hidden" className="tarjeta">
                <Image
                  src={receta.imagen}
                  alt={receta.nombre}
                  className="imagen-receta"
                />
                <Card.Body gap="2">
                  <Card.Title className="nombreReceta">{receta.nombre}</Card.Title>
                </Card.Body>
                <Card.Footer gap="2" className="card-footer">
                  <Button variant="solid" className="botonAgregar">Agregar</Button>
                  <Button 
                    variant="ghost" 
                    className="botonGirar"
                    onClick={() => girarTarjeta(receta.id)}
                  >
                    {tarjetasGiradas[receta.id] ? 'Volver' : 'Girar'}
                  </Button>
                </Card.Footer>
              </Card.Root>
            </div>
            
            <div className="tarjeta-reverso">
              <Card.Root maxW="sm" overflow="hidden" className="tarjeta tarjeta-info">
                <Card.Body gap="3">
                  <Card.Title className="nombreReceta">{receta.nombre}</Card.Title>
                  
                  <div className="info-rapida">
                    <Text><strong>Tiempo:</strong> {receta.tiempo}</Text>
                    <Text><strong>Porciones:</strong> {receta.porciones}</Text>
                  </div>
                  
                  <div className="ingredientes">
                    <Text><strong>Ingredientes:</strong></Text>
                    <ul>
                      {receta.ingredientes.map((ingrediente, index) => (
                        <li key={index}>{ingrediente}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="instrucciones">
                    <Text><strong>Preparación:</strong></Text>
                    <Text fontSize="sm">{receta.instrucciones}</Text>
                  </div>
                </Card.Body>
                <Card.Footer gap="2" className="card-footer">
                  <Button variant="solid" className="botonAgregar">Agregar</Button>
                  <Button 
                    variant="ghost" 
                    className="botonGirar"
                    onClick={() => girarTarjeta(receta.id)}
                  >
                    {tarjetasGiradas[receta.id] ? 'Volver' : 'Girar'}
                  </Button>
                </Card.Footer>
              </Card.Root>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}