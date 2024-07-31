"use client";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { database, ref, push, remove, update, get, set } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { onValue } from "firebase/database";
import AuthGuard from "@/components/AuthGuard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

function LocaisAccordion() {
  const [locais, setLocais] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newMesa, setNewMesa] = React.useState("");
  const [selectedLocalId, setSelectedLocalId] = React.useState("");
  const [tableToEdit, setTableToEdit] = React.useState(null);
  const [selectedMesaId, setSelectedMesaId] = React.useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isInsertDialogOpen, setIsInsertDialogOpen] = React.useState(false);
  const [localIdToEdit, setLocalIdToEdit] = React.useState(null);
  const [tableIdToEdit, setTableIdToEdit] = React.useState(null);
  
  const { toast } = useToast();

  React.useEffect(() => {
    const locaisRef = ref(database, "spaces");
    const unsubscribe = onValue(locaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locaisData = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
          photo: data[key].photo,
          mesas: data[key].mesas
            ? Object.keys(data[key].mesas).map((mesaKey) => ({
                id: mesaKey,
                ...data[key].mesas[mesaKey],
              }))
            : [],
        }));
        setLocais(locaisData);
        setLoading(false);
      } else {
        setLocais([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddMesa = async () => {
    const tableNumber = document.getElementById("edit-name").value;
    const tableNumberOfPeople = document.getElementById("edit-number").value;
    if (tableNumber.trim() !== "") {
      const mesa = tableNumber.trim();
      const localRef = ref(database, `spaces/${localIdToEdit}/mesas`);
  
      try {
        const snapshot = await get(localRef);
        const mesasData = snapshot.val();
        const mesasExistentes = mesasData
          ? Object.values(mesasData).map((mesa) => mesa.numero)
          : [];
  
        if (mesasExistentes.includes(mesa)) {
          toast({
            variant: "destructive",
            title: "Erro!",
            description: "Esta mesa já existe neste local.",
            status: "error",
          });
        } else {
          const novaMesaRef = push(localRef);
          set(novaMesaRef, {
            numero: tableNumber,
            reservado: "N",
            ativo: true,
            ultimaReserva: null,
            numeroPessoas: tableNumberOfPeople,
          });
          setIsInsertDialogOpen(false);
          toast({
            title: "Sucesso!",
            description: "Mesa inserida com sucesso.",
            status: "success",
          });
        }
      } catch (error) {
        console.error("Erro ao adicionar mesa:", error);
        toast({
          title: "Erro!",
          description: "Ocorreu um erro ao adicionar a mesa.",
          status: "error",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, insira um número de mesa válido.",
        status: "error",
      });
    }
  };

  const handleRemoveMesa = async (localId, mesaId) => {
    const mesaRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
    try {
      await remove(mesaRef);
      // Atualize o estado após a exclusão
      setLocais((prevLocais) =>
        prevLocais.map((local) =>
          local.id === localId
            ? {
                ...local,
                mesas: local.mesas.filter((mesa) => mesa.id !== mesaId),
              }
            : local
        )
      );
    } catch (error) {
      console.error("Erro ao remover mesa:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  const handleSaveEdit = async () => {
    const updatedTableNumber = document.getElementById("edit-name").value;
    const updatedTableNumberOfPeople = document.getElementById("edit-number").value;
    update(ref(database, `spaces/${localIdToEdit}/mesas/${tableIdToEdit}`), { numero: updatedTableNumber, numeroPessoas: updatedTableNumberOfPeople })
    .then(async () => {
      setIsEditDialogOpen(false);
      toast({
        title: "Sucesso!",
        description: "Mesa editada com sucesso.",
        status: "success",
      });
    })
    .catch((error) => {
      console.error("Erro ao editar o espaço:", error);
    });
  }

  const handleToggleMesaStatus = async (localId, mesaId, ativo) => {
    const mesaRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
    update(mesaRef, { ativo: !ativo });
        
  }
  
  return (
    <AuthGuard>
    <>
    <Accordion type="single" collapsible className="w-full p-8">
      {!loading &&
        locais.map((local) => (
          <AccordionItem key={local.id} value={local.id}>
            <AccordionTrigger>{local.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-start space-x-4">
                <img
                  src={local.photo}
                  alt={`Foto do local ${local.name}`}
                  style={{ width: "50vh" }}
                />
                <div className="ml-4">
                  <div className="flex w-full mb-5">
                    <Button 
                      className="ml-2" 
                      onClick={() => {
                        setIsInsertDialogOpen(true)
                        setLocalIdToEdit(local.id)
                      }}
                    >
                      Adicionar Mesa
                    </Button>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Mesas</h2>
                  <ul className="space-y-4">
                    {local.mesas.map((mesa) => {
                      const currentDate = new Date();
                      const ultimaReservaDate = new Date(mesa.ultimaReserva);
                      const canEditOrDelete =
                        mesa.reservado !== "Y" || ultimaReservaDate >= currentDate;

                      return (
                        <li key={mesa.id} className="flex items-center justify-between gap-4">
                          <div className="flexCenter gap-4">
                            <span className="p-3 w-36">Mesa {mesa.numero}</span>
                            <span className="p-3 w-36">Número de Pessoas: {mesa.numeroPessoas}</span>
                            <Badge variant={mesa.ativo ? "outline" : "destructive"}>
                              {mesa.ativo ? "Ativo" : "Desativado"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() =>
                                    handleToggleMesaStatus(local.id, mesa.id, mesa.ativo)
                                  }
                                  disabled={!canEditOrDelete} 
                                  className="cursor-pointer"
                                >
                                  {mesa.ativo ? "Desativar" : "Ativar"} Mesa
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setIsEditDialogOpen(true)
                                    setTableToEdit(mesa)
                                    setLocalIdToEdit(local.id)
                                    setTableIdToEdit(mesa.id)
                                  }}
                                  disabled={!canEditOrDelete} 
                                  className="cursor-pointer"
                                >
                                  Alterar Mesa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={ () => { 
                                    setIsDeleteDialogOpen(true)
                                    setSelectedLocalId(local.id)
                                    setSelectedMesaId(mesa.id)
                                  }} 
                                  className="cursor-pointer"
                                  disabled={!canEditOrDelete}
                                >
                                  Excluir Mesa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Editar Mesa</DialogTitle>
          <DialogDescription>Edite os detalhes da Mesa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveEdit}>
              <Label htmlFor="edit-name">Número da Mesa</Label>
              <Input type="text" id="edit-name" defaultValue={tableToEdit?.numero} />
              <Label htmlFor="edit-number">Número de Pessoas</Label>
              <Input type="text" id="edit-number" defaultValue={tableToEdit?.numeroPessoas} />
        </form>
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
    <Dialog open={isInsertDialogOpen} onOpenChange={setIsInsertDialogOpen}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Adicionar Mesa</DialogTitle>
          <DialogDescription>Insira os detalhes da Mesa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMesa}>
              <Label htmlFor="edit-name">Número da Mesa</Label>
              <Input type="text" id="edit-name"/>
              <Label htmlFor="edit-number">Número de Pessoas</Label>
              <Input type="text" id="edit-number"/>
        </form>
        <DialogFooter>
            <Button type="submit" onClick={handleAddMesa}>
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
              Tem certeza de que deseja excluir esta mesa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRemoveMesa(selectedLocalId, selectedMesaId),
                setIsDeleteDialogOpen(false);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
    </AuthGuard>
  );
}

export default LocaisAccordion;
