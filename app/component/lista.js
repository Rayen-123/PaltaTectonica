"use client";
import { Table } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Lista() {
  const [items, setItems] = useState([]);

  // Cargar datos del calendario y generar lista de compras
  useEffect(() => {
    const generarListaCompras = () => {
      const planificacionGuardada = localStorage.getItem('planificacionComidas');
      if (!planificacionGuardada) {
        setItems([]);
        return;
      }

      const planificacion = JSON.parse(planificacionGuardada);
      const ingredientesAcumulados = {};

      // Recorrer todas las semanas, días y comidas
      Object.values(planificacion).forEach(semana => {
        Object.values(semana).forEach(dia => {
          Object.values(dia).forEach(receta => {
            if (receta && receta.Ingredientes) {
              receta.Ingredientes.forEach(ingrediente => {
                const clave = `${ingrediente.Nombre}-${ingrediente.Unidad}`;
                
                if (ingredientesAcumulados[clave]) {
                  // Sumar cantidades si ya existe
                  ingredientesAcumulados[clave].cantidad += ingrediente.Cant;
                } else {
                  // Crear nuevo ingrediente
                  ingredientesAcumulados[clave] = {
                    id: Object.keys(ingredientesAcumulados).length + 1,
                    nombre: ingrediente.Nombre,
                    cantidad: ingrediente.Cant,
                    unidad: ingrediente.Unidad,
                    perecible: ingrediente.Perecible
                  };
                }
              });
            }
          });
        });
      });

      // Convertir a array y formatear cantidades
      const listaFormateada = Object.values(ingredientesAcumulados).map(item => ({
        ...item,
        cantidadFormateada: formatearCantidad(item.cantidad, item.unidad)
      }));

      setItems(listaFormateada);
    };

    const formatearCantidad = (cantidad, unidad) => {
      if (unidad === 'unidad' || unidad === 'dientes' || unidad === 'hojas') {
        return `${cantidad} ${unidad}`;
      } else if (unidad === 'gr' && cantidad >= 1000) {
        return `${(cantidad / 1000).toFixed(1)} kg`;
      } else if (unidad === 'ml' && cantidad >= 1000) {
        return `${(cantidad / 1000).toFixed(1)} L`;
      } else {
        return `${cantidad} ${unidad}`;
      }
    };

    generarListaCompras();

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      generarListaCompras();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar cambios periódicamente (por si hay cambios en la misma pestaña)
    const interval = setInterval(generarListaCompras, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const calcularTotalIngredientes = () => {
    return items.length;
  };

  const totalIngredientes = calcularTotalIngredientes();

  return (
    <div className="principal-lista">
      <h2>Lista de compras</h2>

      {items.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay ingredientes en tu lista de compras.</p>
          <p>Ve al calendario y planifica algunas comidas para generar tu lista.</p>
        </div>
      ) : (
        <Table.Root size="sm" variant="outline" className="custom-table">
          <Table.Header className="table-header">
            <Table.Row>
              <Table.ColumnHeader className="table-header-cell">Ingrediente</Table.ColumnHeader>
              <Table.ColumnHeader className="table-header-cell">Cantidad</Table.ColumnHeader>
              <Table.ColumnHeader className="table-header-cell">Tipo</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body className="table-body">
            {items.map((item) => (
              <Table.Row key={item.id} className={`table-content ${item.perecible ? 'ingrediente-perecible' : ''}`}>
                <Table.Cell>{item.nombre}</Table.Cell>
                <Table.Cell>{item.cantidadFormateada}</Table.Cell>
                <Table.Cell>
                  {item.perecible ? (
                    <span className="badge-perecible">Perecible</span>
                  ) : (
                    <span className="badge-no-perecible">No perecible</span>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className="total-row">
              <Table.Cell colSpan={2} fontWeight="bold" textAlign="end">Total ingredientes:</Table.Cell>
              <Table.Cell fontWeight="bold">{totalIngredientes}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}