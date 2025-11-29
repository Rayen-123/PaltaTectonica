"use client";
import { Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Lista() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function generarListaDesdeUsuario() {
      try {
        setCargando(true);

        const [resUsuario, resRecetas] = await Promise.all([
          fetch("/api/usuarios/7"),
          fetch("/api/recetas"),
        ]);

        if (!resUsuario.ok) throw new Error("Error al cargar usuario");
        if (!resRecetas.ok) throw new Error("Error al obtener recetas");

        const usuario = await resUsuario.json();
        const recetas = await resRecetas.json();

        const calendario = usuario.Calendario || {};
        const ingredientesAcumulados = {};

        // Mapa id -> receta
        const mapaRecetas = {};
        recetas.forEach((r) => {
          const rid = r.id ?? r.Id;
          if (rid != null) {
            mapaRecetas[rid] = r;
          }
        });

        // Recorrer calendario: semana -> día -> items [{id, Porciones}]
        Object.values(calendario).forEach((semana) => {
          if (!semana || typeof semana !== "object") return;

          Object.values(semana).forEach((diaArr) => {
            if (!Array.isArray(diaArr)) return;

            diaArr.forEach((itemComida) => {
              if (!itemComida || itemComida.id == null) return;

              const recetaBase = mapaRecetas[itemComida.id];
              if (!recetaBase) return;

              const ingredientesLista =
                recetaBase.Ingredientes ||
                recetaBase.ingredientes ||
                [];

              if (!Array.isArray(ingredientesLista)) return;

              const factor = itemComida.Porciones ?? 1;

              ingredientesLista.forEach((ingrediente) => {
                const nombre =
                  ingrediente.Nombre ?? ingrediente.nombre ?? "";
                const unidad =
                  ingrediente.Unidad ?? ingrediente.unidad ?? "";
                const cant =
                  ingrediente.Cant ?? ingrediente.cant ?? 0;
                const perecible =
                  ingrediente.Perecible ?? ingrediente.perecible ?? null;

                if (!nombre || !unidad) return;

                const clave = `${nombre}-${unidad}`;
                const cantidadTotal = cant * factor;

                if (ingredientesAcumulados[clave]) {
                  ingredientesAcumulados[clave].cantidad += cantidadTotal;
                } else {
                  ingredientesAcumulados[clave] = {
                    id: Object.keys(ingredientesAcumulados).length + 1,
                    nombre,
                    cantidad: cantidadTotal,
                    unidad,
                    perecible,
                  };
                }
              });
            });
          });
        });

        const listaFormateada = Object.values(ingredientesAcumulados).map(
          (item) => ({
            ...item,
            cantidadFormateada: formatearCantidad(item.cantidad, item.unidad),
          })
        );

        setItems(listaFormateada);
      } catch (err) {
        console.error("Error generando lista:", err);
        setItems([]);
      } finally {
        setCargando(false);
      }
    }

    generarListaDesdeUsuario();
  }, []);

  function formatearCantidad(cantidad, unidad) {
    if (unidad === "unidad" || unidad === "dientes" || unidad === "hojas") {
      return `${cantidad} ${unidad}`;
    }
    if (unidad === "gr" && cantidad >= 1000) {
      return `${(cantidad / 1000).toFixed(1)} kg`;
    }
    if (unidad === "ml" && cantidad >= 1000) {
      return `${(cantidad / 1000).toFixed(1)} L`;
    }
    return `${cantidad} ${unidad}`;
  }

  return (
    <div className="principal-lista">
      <h2>Lista de compras</h2>

      {cargando ? (
        <p>Cargando lista...</p>
      ) : items.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay ingredientes en tu lista de compras.</p>
          <p>Ve al calendario y planifica algunas comidas.</p>
        </div>
      ) : (
        <Table.Root size="sm" variant="outline" className="custom-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Ingrediente</Table.ColumnHeader>
              <Table.ColumnHeader>Cantidad</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.nombre}</Table.Cell>
                <Table.Cell>{item.cantidadFormateada}</Table.Cell>
              </Table.Row>
            ))}

            <Table.Row>
              <Table.Cell fontWeight="bold" textAlign="end">
                Total ingredientes:
              </Table.Cell>
              <Table.Cell fontWeight="bold">{items.length}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
