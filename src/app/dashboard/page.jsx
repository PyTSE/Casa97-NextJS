"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  {
    id: "4",
    name: "Diana",
    whatsapp: "111222333",
    reservationDate: "15/10/2022",
    table: "Mesa 4",
    location: "Lareira",
  },
  {
    id: "5",
    name: "Eduardo",
    whatsapp: "444555666",
    reservationDate: "20/10/2022",
    table: "Mesa 5",
    location: "Varanda",
  },
  {
    id: "6",
    name: "Fernanda",
    whatsapp: "777888999",
    reservationDate: "18/10/2022",
    table: "Mesa 6",
    location: "Guarda Chuva",
  },
  {
    id: "7",
    name: "Gustavo",
    whatsapp: "123456789",
    reservationDate: "25/10/2022",
    table: "Mesa 7",
    location: "Lareira",
  },
  {
    id: "8",
    name: "Helena",
    whatsapp: "987654321",
    reservationDate: "30/10/2022",
    table: "Mesa 8",
    location: "Varanda",
  },
  {
    id: "9",
    name: "Isabela",
    whatsapp: "555666777",
    reservationDate: "28/10/2022",
    table: "Mesa 9",
    location: "Guarda Chuva",
  },
  {
    id: "10",
    name: "João",
    whatsapp: "111333555",
    reservationDate: "05/11/2022",
    table: "Mesa 10",
    location: "Lareira",
  },
  {
    id: "11",
    name: "Kátia",
    whatsapp: "777999111",
    reservationDate: "10/11/2022",
    table: "Mesa 11",
    location: "Varanda",
  },
  {
    id: "12",
    name: "Lucas",
    whatsapp: "222444666",
    reservationDate: "08/11/2022",
    table: "Mesa 12",
    location: "Guarda Chuva",
  },
  {
    id: "13",
    name: "Mariana",
    whatsapp: "888999000",
    reservationDate: "15/11/2022",
    table: "Mesa 13",
    location: "Lareira",
  },
]

export const columns = [
  {
    accessorKey: "name",
    header: "Nome do Cliente",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp do Cliente",
    cell: ({ row }) => <div>{row.getValue("whatsapp")}</div>,
  },
  {
    accessorKey: "reservationDate",
    header: "Data da Reserva",
    cell: ({ row }) => <div>{row.getValue("reservationDate")}</div>,
  },
  {
    accessorKey: "table",
    header: "Mesa Reservada",
    cell: ({ row }) => <div>{row.getValue("table")}</div>,
  },
  {
    accessorKey: "location",
    header: "Local Reservado",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const reservation = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleCancelReservation(reservation.id)}>
              Cancelar Reserva
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditReservation(reservation.id)}>
              Alterar Reserva
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function TabelaDeReservas() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleCancelReservation = (reservationId) => {
    // Implementação da função de cancelar reserva
    console.log("Cancelar reserva:", reservationId)
  }

  const handleEditReservation = (reservationId) => {
    // Implementação da função de alterar reserva
    console.log("Alterar reserva:", reservationId)
  }

  const handleFilterChange = (value) => {
    const newFilters = columns.map((column) => ({
      id: column.accessorKey,
      value,
    }));
    setColumnFilters(newFilters);
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por todas as colunas..."
          onChange={(event) => handleFilterChange(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
