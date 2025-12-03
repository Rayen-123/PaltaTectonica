"use client";
import { Button, Card, Image, Text, Box, Spinner, Alert} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tarjetasGiradas, setTarjetasGiradas] = useState({});
  const [query, setQuery] = useState("");
  const [recetasFiltradas, setRecetasFiltradas] = useState([]);
  const [tagSeleccionado, setTagSeleccionado] = useState([]);


  function recarga(){
    setQuery("");
  }

  function actualizar(){
    recarga();
    setTagSeleccionado([]);
    obtenerRecetas();
    setTarjetasGiradas({});
  }

  function handleKeyDown(e) {
  if (e.key === "Enter") {
    buscarRecetas();
  }
  }


  function buscarRecetas() {
    const texto = query.trim().toLowerCase();

    const temp = recetas.filter((receta) => {
      const nombre = (receta.Nombre || receta.nombre || "").toLowerCase();
      const preparacion = (receta.Preparacion || receta.preparacion || "").toLowerCase();

      const ingredientesArray = receta.ingredientes || receta.Ingredientes || [];
      const ingredientesTexto = ingredientesArray
        .map((ing) => {
          const n = (ing.Nombre || ing.nombre || "").toLowerCase();
          const c = (ing.Cant || ing.cant || "").toString().toLowerCase();
          const u = (ing.Unidad || ing.unidad || "").toLowerCase();
          return `${c} ${u} ${n}`;
        })
        .join(" ");

      const textoReceta = `${nombre} ${preparacion} ${ingredientesTexto}`;

      const coincideTexto = texto === "" ? true : textoReceta.includes(texto);

      const tagsReceta = receta.tags || receta.Tags || [];

      const coincideTag =
        tagSeleccionado.length === 0
          ? true
          : tagSeleccionado.every((t) => tagsReceta.includes(t));

      return coincideTexto && coincideTag;
    });
  setRecetasFiltradas(temp);
}
  
  const obtenerRecetas = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/recetas");
      if (!res.ok) throw new Error("Error al obtener recetas");

      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];
      setRecetas(lista);
      setRecetasFiltradas(lista);
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

  useEffect(() => {
    buscarRecetas();
    
  }, [query, recetas, tagSeleccionado]);

  const girarTarjeta = (id) => {
    setTarjetasGiradas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  useEffect(() => {
    const handleWheel = (e) => {
      const scrollContainers = document.querySelectorAll('.contenedor-tags-scroll');
      scrollContainers.forEach(container => {
        if (container.contains(e.target) || e.target === container) {
          // Permitir el scroll nativo
          return;
        }
      });
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    
     return () => {
      document.removeEventListener("wheel", handleWheel);
      };
    }, []);

    const tagsDisponibles = useMemo(
    () =>
      Array.from(
        new Set(
          recetas.flatMap((receta) => receta.tags || receta.Tags || [])
        )
      ),
    [recetas]
  );
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
      <div className="recetas-layout">
        
        <aside className="filtros-tags">
          <h3>Filtrar por tag</h3>

          <div className="radiocards-tags-wrapper">
            <div className="radiocards-tags">
              {tagsDisponibles.map((tag) => (
                <button
                  key={tag}
                  className={
                    "tag-card" + (tagSeleccionado.includes(tag) ? " tag-card-activo" : "")
                  }
                  onClick={() =>
                    setTagSeleccionado((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="zona-recetas">
          <div className="header-recetas">
            <h2>🍳 Recetas</h2>
            <div className="contador-recetas">
              <Button onClick={actualizar} className="botonNuevas">
                🔄 Actualizar
              </Button>
            </div>
          </div>

          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="buscador"
              onKeyDown={handleKeyDown}
            />
            <Button className="boton-busqueda" onClick={buscarRecetas}>
              Buscar
            </Button>
          </div>

          <div className="contenedor-netflix">
            <div className="categoria-seccion">
              <div className="grid-recetas-vertical">
                  {recetasFiltradas.map((receta) => (
                    <div
                      key={receta.id}
                      className={`contenedor-tarjeta ${
                        tarjetasGiradas[receta.id] ? "girada" : ""
                      }`}
                    >
                    <div className="tarjeta-frente">
                      <Card.Root className="tarjeta">
                        <Image
                          src={receta.img}
                          alt={receta.nombre}
                          className="imagen-receta"
                        />
                        <Card.Body className="card-body">
                          <Card.Title className="nombreReceta">
                            {receta.nombre}
                          </Card.Title>
                          <div className="contenedor-tags-scroll">
                            <div className="badges-grid">
                              {receta.tags?.map((tag, i) => (
                                <span key={i} className="badge">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="card-footer">
                          <Button
                            className="botonGirar"
                            onClick={() => girarTarjeta(receta.id)}
                          >
                            👀 Ver
                          </Button>
                        </Card.Footer>
                      </Card.Root>
                    </div>

                    <div className="tarjeta-reverso">
                      <Card.Root className="tarjeta tarjeta-info">
                        <Card.Body className="card-body-reverso">
                          <Box flex="0">
                            <Card.Title>{receta.nombre}</Card.Title>
                          </Box>
                          <Box
                            flex="1"
                            overflow="auto"
                            className="contenido-scrollable"
                          >
                            <div className="ingredientes">
                              <Text>
                                <strong>🛒 Ingredientes:</strong>
                              </Text>
                              <ul>
                                {receta.ingredientes?.map((i, idx) => (
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
                              <Text
                                fontSize="sm"
                                className="texto-instrucciones"
                              >
                                {receta.preparacion}
                              </Text>
                            </div>
                          </Box>
                        </Card.Body>
                        <Card.Footer className="card-footer">
                          <Button
                            className="botonGirar"
                            onClick={() => girarTarjeta(receta.id)}
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
      </div>
    </div>
  );
}