"use client";
import { Button, Card, Image, Text, Box, Spinner, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tarjetasGiradas, setTarjetasGiradas] = useState({});


  const obtenerRecetas = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/recetas");
      if (!res.ok) throw new Error("Error al obtener recetas");

      const data = await res.json();
      console.log("Recetas desde API →", data);
      setRecetas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar recetas:", err);
      setError("Error al cargar las recetas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRecetas();
  }, []);

  const guardarReceta = (id) => {

  }
  const girarTarjeta = (id) => {
    setTarjetasGiradas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const recargarRecetas = () => {
    obtenerRecetas();
    setTarjetasGiradas({});
  };

  if (loading) {
    return (
      <div className="principal-recetas">
        <h2>🍳 Recetas</h2>
        <div className="cargando">
          <Spinner size="xl" color="white" />
          <Text color="white" mt={4}>
            Cargando recetas...
          </Text>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="principal-recetas">
        <h2>🍳 Recetas</h2>
        <Alert status="error" mb={4}>
          {error}
        </Alert>
        <Button onClick={obtenerRecetas} className="botonRecargar">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="principal-recetas">
      <div className="header-recetas">
        <h2>🍳 Recetas</h2>
        <Button onClick={recargarRecetas} className="botonNuevas">
          🔄 Actualizar
        </Button>
      </div>

      <div className="contenedor-netflix">
        <div className="categoria-seccion">
          <div className="contenedor-tarjetas-horizontal">
            {recetas.map((receta) => (
              <div
                key={receta.Id}
                className={`contenedor-tarjeta ${
                  tarjetasGiradas[receta.Id] ? "girada" : ""
                }`}
              >
                {/* Cara frontal */}
                <div className="tarjeta-frente">
                  <Card.Root className="tarjeta">
                    <Image src={receta.Img} alt={receta.Nombre} className="imagen-receta" />
                    <Card.Body className="card-body">
                      <Card.Title className="nombreReceta">{receta.Nombre}</Card.Title>
                      <div className="badges">
                        {receta.Tags?.map((tag, i) => (
                          <span key={i} className="badge">{tag}</span>
                        ))}
                      </div>
                    </Card.Body>
                    <Card.Footer className="card-footer">
                      <Button className="botonAgregar">❤️ Guardar</Button>
                      <Button
                        className="botonGirar"
                        onClick={() => girarTarjeta(receta.Id)}
                      >
                        👀 Ver
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                </div>

                {/* Cara trasera */}
                <div className="tarjeta-reverso">
                  <Card.Root className="tarjeta tarjeta-info">
                    <Card.Body
                      style={{
                        padding: "16px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box flex="0">
                        <Card.Title>{receta.Nombre}</Card.Title>
                      </Box>

                      <Box flex="1" overflow="auto" className="contenido-scrollable">
                        <div className="ingredientes">
                          <Text>
                            <strong>🛒 Ingredientes:</strong>
                          </Text>
                          <ul>
                            {receta.Ingredientes?.map((i, idx) => (
                              <li key={idx}>
                                {i.Cant} {i.Unidad} {i.Nombre}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="instrucciones">
                          <Text>
                            <strong>👩‍🍳 Preparación:</strong>
                          </Text>
                          <Text fontSize="sm" className="texto-instrucciones">
                            {receta.Preparacion}
                          </Text>
                        </div>
                      </Box>
                    </Card.Body>

                    <Card.Footer className="card-footer">
                      <Button className="botonAgregar">❤️ Guardar</Button>
                      <Button
                        className="botonGirar"
                        onClick={() => girarTarjeta(receta.Id)}
                      >
                        ↩️ Volver
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
