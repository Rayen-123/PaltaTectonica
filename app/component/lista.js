"use client";
import { Table } from "@chakra-ui/react"

// Define los datos para la tabla.
const items = [
  { id: 1, name: "Leche", cantidad: "1L", price: "$1.200" },
  { id: 2, name: "Pan", cantidad: "0.5kg", price: "$800" },
  { id: 3, name: "Manzanas", cantidad: "2", price: "$1.100" },
];

export default function Lista() {
  // Función para calcular el total
  const calcularTotal = () => {
    return items.reduce((total, item) => {
      // Remover el símbolo "$" y los puntos, luego convertir a número
      const precioNumerico = parseInt(item.price.replace('$', '').replace('.', ''));
      return total + precioNumerico;
    }, 0);
  };
  const total = calcularTotal();

  return (
    <div className="principal-lista">
      <h2>Lista de compras</h2>
      <Table.Root size="sm" variant="outline" className="custom-table">
        <Table.Header className="table-header">
          <Table.Row >
            <Table.ColumnHeader className="table-header-cell">Product</Table.ColumnHeader>
            <Table.ColumnHeader className="table-header-cell">Cantidad</Table.ColumnHeader>
            <Table.ColumnHeader className="table-header-cell" textAlign="end">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body className="table-body">
          {items.map((item) => (
            <Table.Row key={item.id} className="table-content">
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.cantidad}</Table.Cell>
              <Table.Cell textAlign="end">{item.price}</Table.Cell>
            </Table.Row>
          ))}
          {}
          <Table.Row className="total-row">
            <Table.Cell colSpan={2} fontWeight="bold" textAlign="end">Total:</Table.Cell>
            <Table.Cell fontWeight="bold" textAlign="end">${total.toLocaleString('es-ES')}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  );
}