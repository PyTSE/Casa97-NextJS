"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { database, ref, push, remove } from "@/lib/firebase";
import { onValue } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";

function LocaisAccordion() {
  const [locais, setLocais] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newMesa, setNewMesa] = React.useState(""); // Estado para armazenar o valor do novo número da mesa

  React.useEffect(() => {
    const locaisRef = ref(database, "spaces");
    const unsubscribe = onValue(locaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locaisData = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
          photo: data[key].photo,
          mesas: data[key].mesas ? Object.values(data[key].mesas) : [],
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

  const handleAddMesa = (localId) => {
    if (newMesa.trim() !== "") { // Verificando se o valor do novo número da mesa não está vazio
      const mesa = newMesa.trim();
      const localRef = ref(database, `spaces/${localId}/mesas`);
      push(localRef, mesa);
      setNewMesa(""); // Limpa o valor do input após adicionar a mesa
    }
  };

  const handleRemoveMesa = (localId, mesaId) => {
    const localRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
    remove(localRef);
  };

  return (
    <Accordion type="single" collapsible className="w-full p-8">
      {!loading &&
        locais.map((local) => (
          <AccordionItem key={local.id} value={local.id}>
            <AccordionTrigger>{local.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex">
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
                      required
                    />
                    <Button
                      className="ml-2"
                      onClick={() => handleAddMesa(local.id)}
                    >
                      Adicionar Mesa
                    </Button>
                  </div>
                  <ul>
                    {local.mesas.map((mesa, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-[180px] p-3">Mesa {mesa}</span>
                        <Button variant="icon" size="icon" className="ml-2"
                          onClick={() => handleRemoveMesa(local.id, mesa)}>
                          <Trash />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}

export default LocaisAccordion;
