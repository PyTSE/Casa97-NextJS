"use client";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, remove, update, get, onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";

const firebaseConfig = {
  apiKey: "AIzaSyBcCzimZn9XCqH5gpCCcWUteGfkLvSgr9Q",
  authDomain: "casa97-f2434.firebaseapp.com",
  databaseURL: "https://casa97-f2434-default-rtdb.firebaseio.com",
  projectId: "casa97-f2434",
  storageBucket: "casa97-f2434.appspot.com",
  messagingSenderId: "466978037045",
  appId: "1:466978037045:web:be929e19b4f3191e1bc07c"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

const handleDeleteSpace = (spaceId, setSpacesData) => {
  remove(ref(database, `spaces/${spaceId}`))
    .then(() => {
      console.log("Local excluído com sucesso:", spaceId);
      setSpacesData((prevData) => prevData.filter((space) => space.id !== spaceId));
    })
    .catch((error) => {
      console.error("Erro ao excluir o local:", error);
    });
};

const handleAddSpace = async (spaceName, photoFile, setSpacesData) => {
  try {
    const newSpaceRef = await push(ref(database, "spaces"), { name: spaceName });
    console.log("Novo espaço adicionado com sucesso:", spaceName);
    
    const spaceId = newSpaceRef.key;
    await handleAddPhoto(spaceId, photoFile);

    const downloadURL = await getDownloadURL(storageRef(storage, `spaces/${spaceId}/photo.jpg`));
    await update(ref(database, `spaces/${spaceId}`), { photo: downloadURL });

    setSpacesData((prevData) => [...prevData, { id: spaceId, name: spaceName, photo: downloadURL }]);
  } catch (error) {
    console.error("Erro ao adicionar novo espaço:", error);
  }
};

const handleAddPhoto = async (spaceId, photoFile) => {
  try {
    const storageReference = storageRef(storage, `spaces/${spaceId}/photo.jpg`);
    await uploadBytes(storageReference, photoFile);
    console.log("Foto adicionada com sucesso:", spaceId);
  } catch (error) {
    console.error("Erro ao adicionar foto:", error);
  }
};

export const spacesColumns = [
  {
    accessorKey: "photo",
    header: "Foto",
    cell: ({ row }) => <img src={row.getValue("photo")} alt="Foto do Local" style={{ width: '100px' }} />,
  },
  {
    accessorKey: "name",
    header: "Nome do Local",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    enableHiding: false,
    cell: ({ row }) => {
      const space = row.original;
      return (
        <DropdownMenu>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <DropdownMenuTrigger asChild>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenEditDialog(space.id, space.name)}>
              Editar Local
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteSpace(space.id, setSpacesData)}>
              Excluir Local
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function SpacesTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = React.useState(null);
  const [numTables, setNumTables] = React.useState(0);
  const [spacesData, setSpacesData] = React.useState([]);

  React.useEffect(() => {
    const dbRef = ref(database, "spaces");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const spaces = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setSpacesData(spaces);
      } else {
        setSpacesData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const table = useReactTable({
    data: spacesData,
    columns: spacesColumns,
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
    const newFilters = spacesColumns.map((column) => ({
      id: column.accessorKey,
      value,
    }));
    setColumnFilters(newFilters);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setNumTables(0);
  };

  const handleAddTablesAndCloseDialog = () => {
    handleAddTablesAndImage(selectedSpaceId, numTables);
    setIsDialogOpen(false);
    setNumTables(0);
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-[10px]" onClick={() => setIsDialogOpen(true)}>Adicionar Local</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Local</DialogTitle>
                  <DialogDescription>
                    Adicione um novo local na casa para reservas.
                  </DialogDescription>
                </DialogHeader>
                <div className="">
                  <div className="items-center">
                    <Label htmlFor="name" className="text-right mt-[20px]">
                      Nome
                    </Label>
                  <div className="p-1"></div>
                    <Input
                      id="name"
                      placeholder="Digite o nome do local"
                      className="col-span-3"
                    />
                  <div className="p-1"></div>
                    <Label htmlFor="name" className="text-right mt-[20px]">
                      Inserir foto do local
                    </Label>
                    <div className="p-1"></div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button type="submit" onClick={() => {
                      handleAddSpace(document.getElementById("name").value, document.getElementById("photo").files[0], setSpacesData);
                      const photoFile = document.getElementById("photo").files[0];
                      handleAddPhoto(selectedSpaceId, photoFile);
                    }}>Salvar</Button>
                    <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuTrigger>
          <Button variant="outline" className="ml-auto">
            Colunas <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
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
                <TableCell colSpan={spacesColumns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
          Próximo
        </Button>
      </div>
    </div>
  );
}

