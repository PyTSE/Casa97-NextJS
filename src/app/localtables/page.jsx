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

function LocaisAccordion() {
  const [locais, setLocais] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newMesa, setNewMesa] = React.useState("");
  const [selectedLocalId, setSelectedLocalId] = React.useState("");
  const [selectedMesaId, setSelectedMesaId] = React.useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
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

  const handleAddMesa = async (localId) => {
    if (newMesa.trim() !== "") {
      const mesa = newMesa.trim();
      const localRef = ref(database, `spaces/${localId}/mesas`);
  
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
            numero: mesa,
            reservado: "N",
            ativo: true,
            ultimaReserva: null,
          });
          setNewMesa("");
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
    remove(mesaRef);

  }

  const handleToggleMesaStatus = async (localId, mesaId, ativo) => {
    const mesaRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
    update(mesaRef, { ativo: !ativo });
        
  }
  
  return (
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
                  <Label className="mr-2">Adicionar mesa no Local:</Label>
                  <div className="flex w-full mb-5">
                    <Input
                      type="number"
                      placeholder="Número da mesa"
                      value={newMesa}
                      onChange={(e) => setNewMesa(e.target.value)}
                      min={1}
                      required
                    />
                    <Button className="ml-2" onClick={() => handleAddMesa(local.id)}>
                      Adicionar Mesa
                    </Button>
                  </div>
                  <ul className="space-y-4">
                    {local.mesas.map((mesa) => {
                      const currentDate = new Date();
                      const ultimaReservaDate = new Date(mesa.ultimaReserva);
                      const canEditOrDelete =
                        mesa.reservado !== "Y" || ultimaReservaDate >= currentDate;

                      return (
                        <li key={mesa.id} className="flex items-center justify-between gap-4">
                          <div className="flexCenter">
                            <span className="p-3 w-36">Mesa {mesa.numero}</span>
                            <Badge variant={mesa.ativo ? "outline" : "destructive"}>
                              {mesa.ativo ? "Ativo" : "Desativado"}
                            </Badge>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              onClick={() =>
                                handleToggleMesaStatus(local.id, mesa.id, mesa.ativo)
                              }
                              disabled={!canEditOrDelete}
                            >
                              {mesa.ativo ? "Desativar" : "Ativar"}
                            </Button>
                            <Button
                              onClick={ () => { 
                                setIsDeleteDialogOpen(true)
                                setSelectedLocalId(local.id)
                                setSelectedMesaId(mesa.id)
                              }}
                              disabled={!canEditOrDelete}
                            >
                              Excluir
                            </Button>
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
  );
}

export default LocaisAccordion;
