"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { firebaseConfig } from "@/constants";

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

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
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("reservationDate")), "dd/MM/yyyy")}</div>
    )
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
      const reservation = row.original;
      const handleCancelReservation = () => {
        console.log("Cancelar reserva:", reservation.id);
        // Implementar a lógica para cancelar a reserva aqui
      };
      const handleEditReservation = () => {
        console.log("Editar reserva:", reservation.id);
        // Implementar a lógica para editar a reserva aqui
      };

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
            <DropdownMenuItem onClick={handleCancelReservation}>
              Cancelar Reserva
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditReservation}>
              Alterar Reserva
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TabelaDeReservas() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [reservas, setReservasData] = React.useState([]);

  React.useEffect(() => {
    const dbRef = ref(database, "reservas");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reservasPromises = Object.keys(data).map(async (key) => {
          const reserva = data[key];
          // Aqui você pode buscar o nome da mesa e do local usando os IDs
          const mesaRef = ref(database, `spaces/${reserva.localId}/mesas/${reserva.mesaId}`);
          const localRef = ref(database, `spaces/${reserva.localId}`);

          const [mesaSnapshot, localSnapshot] = await Promise.all([
            get(mesaRef),
            get(localRef),
          ]);

          const mesaNome = mesaSnapshot.val().numero;
          const localNome = localSnapshot.val().name;

          return {
            id: key,
            name: reserva.nome,
            whatsapp: reserva.whatsapp,
            reservationDate: reserva.dataReserva,
            table: mesaNome,
            location: localNome,
          };
        });

        Promise.all(reservasPromises).then((reservasComNomes) => {
          setReservasData(reservasComNomes);
        });
      } else {
        setReservasData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const table = useReactTable({
    columns,
    data: reservas,
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
  });

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
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
      </div>
    </div>
  );
}
