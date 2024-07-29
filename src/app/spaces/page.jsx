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
import { firebaseConfig } from "@/constants";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AuthGuard from "@/components/AuthGuard";

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export default function SpacesTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = React.useState(null);
  const [numTables, setNumTables] = React.useState(0);
  const [spacesData, setSpacesData] = React.useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedSpace, setSelectedSpace] = React.useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const spacesColumns = [
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
      enableHiding: false,
      cell: ({ row }) => {
        const space = row.original;
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
              <DropdownMenuItem onClick={() => handleEditReservation(space)}>
                Editar Local
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedSpaceId(space.id);
                setIsDeleteDialogOpen(true);
              }}>
                Excluir Local
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDeleteSpace = (spaceId) => {
    remove(ref(database, `spaces/${spaceId}`))
      .then(() => {
        setSpacesData((prevData) => prevData.filter((space) => space.id !== spaceId));
      })
      .catch((error) => {
        console.error("Erro ao excluir o local:", error);
      });
  };

  const handleAddSpace = async (spaceName, photoFile, setSpacesData) => {
    try {
      const newSpaceRef = await push(ref(database, "spaces"), { name: spaceName });
      
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
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  };

  const handleEditReservation = (space) => {
    setSelectedSpace(space);
    setIsEditDialogOpen(true);
  };

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

  const handleSaveEdit = () => {
    const updatedSpaceName = document.getElementById("edit-name").value;
    const updatedPhotoFile = document.getElementById("edit-photo").files[0];

    update(ref(database, `spaces/${selectedSpace.id}`), { name: updatedSpaceName })
      .then(async () => {
        if (updatedPhotoFile) {
          await handleAddPhoto(selectedSpace.id, updatedPhotoFile);
          const downloadURL = await getDownloadURL(storageRef(storage, `spaces/${selectedSpace.id}/photo.jpg`));
          await update(ref(database, `spaces/${selectedSpace.id}`), { photo: downloadURL });
          setSpacesData((prevData) =>
            prevData.map((space) =>
              space.id === selectedSpace.id
                ? { ...space, name: updatedSpaceName, photo: downloadURL }
                : space
            )
          );
        } else {
          setSpacesData((prevData) =>
            prevData.map((space) =>
              space.id === selectedSpace.id ? { ...space, name: updatedSpaceName } : space
            )
          );
        }
        setIsEditDialogOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao editar o espaço:", error);
      });
  };

  return (
    <AuthGuard>
    <div className="w-full p-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por todas as colunas..."
          onChange={(event) => handleFilterChange(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-[10px]" onClick={() => setIsDialogOpen(true)}>Adicionar Local</Button>
          </DropdownMenuTrigger>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
              <DialogTitle>Adicionar Local</DialogTitle>
                <DialogDescription>
                  Adicione um novo local na casa para reservas.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const spaceName = document.getElementById("name").value;
                  const photoFile = document.getElementById("photo").files[0];
                  handleAddSpace(spaceName, photoFile, setSpacesData);
                  setIsDialogOpen(false);
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nome</Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo" className="text-right">Foto</Label>
                    <Input id="photo" type="file" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  Nenhum dado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Local</DialogTitle>
            <DialogDescription>Edite as informações do local selecionado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Nome</Label>
              <Input id="edit-name" defaultValue={selectedSpace?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-photo" className="text-right">Foto</Label>
              <Input id="edit-photo" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este local? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteSpace(selectedSpaceId);
                setIsDeleteDialogOpen(false);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </AuthGuard>
  );
}