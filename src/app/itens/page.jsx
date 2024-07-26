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
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import AuthGuard from "@/components/AuthGuard";

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export default function ItemsTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [numTables, setNumTables] = React.useState(0);
  const [itemsData, setItemsData] = React.useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState(null);

  const spacesColumns = [
    {
      accessorKey: "photo",
      header: "Foto",
      cell: ({ row }) => <img src={row.getValue("photo")} alt="Foto do Local" style={{ width: '100px' }} />,
    },
    {
      accessorKey: "name",
      header: "Nome do item",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "itemValue",
      header: "Valor do item",
      cell: ({ row }) => (
        <div>{row.getValue("itemValue").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
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
              <DropdownMenuItem onClick={() => handleEditReservation(item)}>
                Editar Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedItemId(item.id);
                setIsDeleteDialogOpen(true);
              }}>
                Excluir Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };
  const handleDeleteSpace = (itemId) => {
    remove(ref(database, `items/${itemId}`))
      .then(() => {
        console.log("Local excluído com sucesso:", itemId);
        setItemsData((prevData) => prevData.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Erro ao excluir o local:", error);
      });
  };

  const handleAddSpace = async (itemName, itemValue, photoFile) => {
    try {
      const cleanedItemValue = itemValue.replace(/[^\d.,]/g, '');
      const numericItemValue = parseFloat(cleanedItemValue.replace(',', '.'));
  
      const newSpaceRef = await push(ref(database, "items"), { name: itemName, itemValue: numericItemValue });
      console.log("Novo item adicionado com sucesso:", itemName);
  
      const itemId = newSpaceRef.key;
  
      await handleAddPhoto(itemId, photoFile);
  
      const downloadURL = await getDownloadURL(storageRef(storage, `items/${itemId}/photo.jpg`));
      await update(ref(database, `items/${itemId}`), { photo: downloadURL });
    } catch (error) {
      console.error("Erro ao adicionar novo item:", error);
    }
  };
  
  

  const handleAddPhoto = async (itemId, photoFile) => {
    try {
      const storageReference = storageRef(storage, `items/${itemId}/photo.jpg`);
      await uploadBytes(storageReference, photoFile);
      console.log("Foto adicionada com sucesso:", itemId);
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  };

  const handleEditReservation = (item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  React.useEffect(() => {
    const dbRef = ref(database, "items");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setItemsData(items);
        console.log(items);
      } else {
        setItemsData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const table = useReactTable({
    data: itemsData,
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

  const handleSaveEdit = async () => {
    const updatedSpaceName = document.getElementById("edit-name").value;
    const updatedPhotoFile = document.getElementById("edit-photo").files[0];
  
    try {
      await update(ref(database, `items/${selectedItem.id}`), { name: updatedSpaceName });
      if (updatedPhotoFile) {
        await handleAddPhoto(selectedItem.id, updatedPhotoFile);
        const downloadURL = await getDownloadURL(storageRef(storage, `items/${selectedItem.id}/photo.jpg`));
        await update(ref(database, `items/${selectedItem.id}`), { photo: downloadURL });
      }
      setItemsData((prevData) =>
        prevData.map((item) =>
          item.id === selectedItem.id ? { ...item, name: updatedSpaceName } : item
        )
      );
  
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao editar o espaço:", error);
    }
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
          <Button className="ml-[10px]" onClick={() => setIsDialogOpen(true)}>Adicionar Item</Button>
        </DropdownMenuTrigger>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Item</DialogTitle>
              <DialogDescription>
                Adicione um novo local na casa para reservas.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const itemName = document.getElementById("name").value;
                const itemValue = document.getElementById("item-value").value;
                const photoFile = document.getElementById("photo").files[0];
                handleAddSpace(itemName, itemValue, photoFile, setItemsData);
                setIsDialogOpen(false);
              }}
            >
              <div className="flex flex-col gap-4 py-4">
                <div className="items-center py-1">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="item-value" className="text-right">Valor</Label>
                  <NumericFormat
                    id="item-value"
                    thousandSeparator={true}
                    prefix={'R$ '}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    placeholder="R$ 0,00"
                    className="input border-2 w-full rounded-sm p-2"
                  />
                </div>
                <div className="items-center">
                  <Label htmlFor="photo" className="text-right">Foto</Label>
                  <Input id="photo" type="file" className="col-span-3 cursor-pointer" onChange={handlePhotoChange} />
                  {photoPreview && (
                    <div className="col-span-4 pt-4 flexCenter">
                      <Image src={photoPreview} alt="Pré-visualização da Foto" width={200} height={200} className="rounded-md" />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Adicionar</Button>
                <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>Edite os detalhes do item.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mb-4">
            <Label htmlFor="edit-name">Nome do Item</Label>
            <Input type="text" id="edit-name" defaultValue={selectedItem?.name} />
            <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="value" className="text-right">Valor</Label>
                  <NumericFormat
                    id="item-value"
                    thousandSeparator={true}
                    prefix={'R$ '}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    placeholder="R$ 0,00"
                    className="input border-2 w-full rounded-sm p-2"
                  />
                </div>
            <Label htmlFor="edit-photo">Foto</Label>
            <Input type="file" id="edit-photo" onChange={handlePhotoChange} />
            {photoPreview && <Image src={photoPreview} alt="Pré-visualização da Foto" width={100} height={100} />}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.
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