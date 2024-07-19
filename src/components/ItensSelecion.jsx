import { Label } from "@radix-ui/react-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { database } from "@/lib/firebase";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "@/constants";


const ItensSelection = ({ handleItemChange, handleAdicionarItem, isAdding, setShowItensAdicionais, setShowDropdowns }) => {
  const [itensAdicionais, setItensAdicionais] = useState([]);
  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);

  useEffect(() => {
    const itensRef = ref(database, "items");
    const unsubscribe = onValue(itensRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itensData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        console.log(itensData);
        setItensAdicionais(itensData);
      } else {
        setItensAdicionais([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Label htmlFor="itensAdicionais">Selecione Itens Adicionais</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {itensAdicionais.map((item) => (
          <Card key={item.id} id="itensAdicionais" onValueChange={handleItemChange} className='h-full'>
            <CardHeader>
              <CardTitle className='mb-4'>{item.name}</CardTitle>
              <div className="flex items-center space-x-4 rounded-md border lg:h-60">
                <Image src={item.photo} alt={item.name} width={502} height={502} className="h-full w-full object-cover"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <p>{item.description}</p>
                <p>{`${item.itemValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
              </div>
              <div className='flex flexCenter'>
                <Button
                  type="button"
                  onClick={() => handleAdicionarItem({ id: item.id, nome: item.name, preco: item.itemValue })}
                  className={`transition-transform transform ${isAdding ? 'scale-95' : ''}`}
                  disabled={isAdding}
                >
                  {isAdding ? 'Adicionando...' : 'Adicionar Item'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='flex gap-4 mt-5'>
      </div>
    </div>
  );
};

export default ItensSelection;
