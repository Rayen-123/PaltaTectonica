"use client";
import { Button, Card, Image, Text, Box, Spinner, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Recetas() {
  const [categoriasConRecetas, setCategoriasConRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tarjetasGiradas, setTarjetasGiradas] = useState({});

  // Traducciones de categorías
  const traduccionesCategoria = {
    "Beef": "Carne de Res",
    "Chicken": "Pollo",
    "Dessert": "Postres",
    "Lamb": "Cordero",
    "Miscellaneous": "Variados",
    "Pasta": "Pastas",
    "Pork": "Cerdo",
    "Seafood": "Mariscos",
    "Side": "Acompañamientos",
    "Starter": "Entrantes",
    "Vegan": "Vegano",
    "Vegetarian": "Vegetariano",
    "Breakfast": "Desayunos",
    "Goat": "Cabra"
  };

  // Traducciones de áreas
  const traduccionesArea = {
    "American": "Americana",
    "British": "Británica",
    "Canadian": "Canadiense",
    "Chinese": "China",
    "Croatian": "Croata",
    "Dutch": "Holandesa",
    "Egyptian": "Egipcia",
    "French": "Francesa",
    "Greek": "Griega",
    "Indian": "India",
    "Irish": "Irlandesa",
    "Italian": "Italiana",
    "Jamaican": "Jamaiquina",
    "Japanese": "Japonesa",
    "Kenyan": "Keniata",
    "Malaysian": "Malasia",
    "Mexican": "Mexicana",
    "Moroccan": "Marroquí",
    "Polish": "Polaca",
    "Portuguese": "Portuguesa",
    "Russian": "Rusa",
    "Spanish": "Española",
    "Thai": "Tailandesa",
    "Tunisian": "Tunecina",
    "Turkish": "Turca",
    "Unknown": "Desconocida",
    "Vietnamese": "Vietnamita"
  };

  // Categorías populares para mostrar
  const categoriasPopulares = [
    "Beef", "Chicken", "Dessert", "Vegetarian", 
    "Seafood", "Pasta", "Vegan", "Breakfast"
  ];

  // Función para obtener recetas por categoría
  const obtenerRecetasPorCategoria = async (categoria) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
      const data = await response.json();
      return data.meals ? data.meals.slice(0, 8) : []; // Máximo 8 recetas por categoría
    } catch (err) {
      console.error(`Error fetching ${categoria}:`, err);
      return [];
    }
  };

  // Función para obtener detalles completos de una receta
  const obtenerDetallesReceta = async (id) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (err) {
      console.error(`Error fetching details for ${id}:`, err);
      return null;
    }
  };

  // Función principal para cargar todas las recetas
  const obtenerRecetas = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoriasConData = [];

      for (const categoria of categoriasPopulares) {
        const recetasCategoria = await obtenerRecetasPorCategoria(categoria);
        
        if (recetasCategoria.length > 0) {
          // Obtener detalles completos para las primeras 4 recetas de cada categoría
          const recetasConDetalles = [];
          for (let i = 0; i < Math.min(8, recetasCategoria.length); i++) {
            const detalles = await obtenerDetallesReceta(recetasCategoria[i].idMeal);
            if (detalles) {
              recetasConDetalles.push({
                id: detalles.idMeal,
                nombre: detalles.strMeal,
                imagen: detalles.strMealThumb,
                categoria: traduccionesCategoria[categoria] || categoria,
                categoriaOriginal: categoria,
                area: traduccionesArea[detalles.strArea] || detalles.strArea,
                ingredientes: obtenerIngredientes(detalles),
                instrucciones: detalles.strInstructions,
                video: detalles.strYoutube
              });
            }
          }

          if (recetasConDetalles.length > 0) {
            categoriasConData.push({
              nombre: traduccionesCategoria[categoria] || categoria,
              recetas: recetasConDetalles
            });
          }
        }
      }

      setCategoriasConRecetas(categoriasConData);
    } catch (err) {
      setError("Error al cargar las recetas. Intenta nuevamente.");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para extraer ingredientes de la receta
  const obtenerIngredientes = (receta) => {
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = receta[`strIngredient${i}`];
      const medida = receta[`strMeasure${i}`];
      
      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push(`${medida} ${ingrediente}`.trim());
      }
    }
    return ingredientes;
  };

  // Cargar recetas al montar el componente
  useEffect(() => {
    obtenerRecetas();
  }, []);

  const girarTarjeta = (id) => {
    setTarjetasGiradas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Función para recargar recetas
  const recargarRecetas = () => {
    obtenerRecetas();
    setTarjetasGiradas({});
  };

  if (loading) {
    return (
      <div className="principal-recetas">
        <h2>🍳 Recetas Internacionales</h2>
        <div className="cargando">
          <Spinner size="xl" color="white" />
          <Text color="white" mt={4}>Cargando recetas...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="principal-recetas">
        <h2>🍳 Recetas Internacionales</h2>
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
        <h2>🍳 Recetas Internacionales</h2>
        <Button onClick={recargarRecetas} className="botonNuevas">
          🔄 Actualizar
        </Button>
      </div>
      
      <div className="contenedor-netflix">
        {categoriasConRecetas.map((categoria, index) => (
          <div key={index} className="categoria-seccion">
            <Text className="titulo-categoria" fontSize="2xl" fontWeight="bold" mb={4} color="white">
              {categoria.nombre}
            </Text>
            
            <div className="contenedor-tarjetas-horizontal">
              {categoria.recetas.map(receta => (
                <div key={receta.id} className={`contenedor-tarjeta ${tarjetasGiradas[receta.id] ? 'girada' : ''}`}>
                  
                  {/* Cara frontal */}
                  <div className="tarjeta-frente">
                    <Card.Root className="tarjeta">
                      <Image
                        src={receta.imagen}
                        alt={receta.nombre}
                        className="imagen-receta"
                      />
                      <Card.Body>
                        <Card.Title className="nombreReceta">{receta.nombre}</Card.Title>
                        <div className="badges">
                          <span className="badge area">{receta.area}</span>
                        </div>
                      </Card.Body>
                      <Card.Footer className="card-footer">
                        <Button className="botonAgregar">❤️ Guardar</Button>
                        <Button 
                          className="botonGirar"
                          onClick={() => girarTarjeta(receta.id)}
                        >
                          👀 Ver
                        </Button>
                      </Card.Footer>
                    </Card.Root>
                  </div>
                  
                  {/* Cara trasera */}
                  <div className="tarjeta-reverso">
                    <Card.Root className="tarjeta tarjeta-info">
                      <Card.Body style={{ padding: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box flex="0">
                          <Card.Title>{receta.nombre}</Card.Title>
                          <div className="badges">
                            <span className="badge categoria">{receta.categoria}</span>
                            <span className="badge area">{receta.area}</span>
                          </div>
                        </Box>
                        
                        <Box flex="1" overflow="auto" className="contenido-scrollable">
                          <div className="info-rapida">
                            <Text><strong>🍽️ Porciones:</strong> 4 personas</Text>
                            <Text><strong>⏱️ Tiempo estimado:</strong> 30-45 min</Text>
                          </div>
                          
                          <div className="ingredientes">
                            <Text><strong>🛒 Ingredientes:</strong></Text>
                            <ul>
                              {receta.ingredientes.slice(0, 6).map((ingrediente, index) => (
                                <li key={index}>{ingrediente}</li>
                              ))}
                              {receta.ingredientes.length > 6 && (
                                <li className="mas-ingredientes">
                                  ... y {receta.ingredientes.length - 6} más
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          <div className="instrucciones">
                            <Text><strong>👩‍🍳 Preparación:</strong></Text>
                            <Text fontSize="sm" className="texto-instrucciones">
                              {receta.instrucciones.length > 250 
                                ? `${receta.instrucciones.substring(0, 250)}...` 
                                : receta.instrucciones
                              }
                            </Text>
                          </div>

                          {receta.video && (
                            <div className="video-link">
                              <Text fontSize="sm">
                                <strong>🎥 Video Tutorial: </strong>
                                <a href={receta.video} target="_blank" rel="noopener noreferrer">
                                  Ver en YouTube
                                </a>
                              </Text>
                            </div>
                          )}
                        </Box>
                      </Card.Body>
                      
                      <Card.Footer className="card-footer">
                        <Button className="botonAgregar">❤️ Guardar</Button>
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
        ))}
      </div>
    </div>
  );
}