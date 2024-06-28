import React, { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CalendarCheck, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from 'next/image';
import Logo from '../../public/casa97.png';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/constants';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

const ReservaForm = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dataReserva, setData] = useState('');
  const [mesaId, setMesaId] = useState('');
  const [localId, setLocalId] = useState('');
  const [numeroPessoas, setNumeroPessoas] = useState('');
  const [showDropdowns, setShowDropdowns] = useState(false);
  const [locais, setLocais] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [formError, setFormError] = useState(false);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [showItensAdicionais, setShowItensAdicionais] = useState(false);
  const [itensAdicionais, setItensAdicionais] = useState([]);
  const [selectedItensAdicionais, setSelectedItensAdicionais] = useState([]);

  useEffect(() => {
    const locaisRef = ref(database, "spaces");
    const unsubscribe = onValue(locaisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locaisData = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name,
          photo: data[key].photo,
          mesas: data[key].mesas ? Object.keys(data[key].mesas).map(mesaKey => ({
            id: mesaKey,
            ...data[key].mesas[mesaKey]
          })) : [],
        }));
        setLocais(locaisData);
      } else {
        setLocais([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const itensRef = ref(database, "itensAdicionais");
    const unsubscribe = onValue(itensRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itensData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setItensAdicionais(itensData);
      } else {
        setItensAdicionais([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleShowDropdowns = () => {
    if (!nome || !whatsapp || !dataReserva || !numeroPessoas) {
      setFormError(true);
    } else {
      setFormError(false);
      setShowDropdowns(true);
    }
  };

  const handleLocalMesaChange = async (value) => {
    const selectedLocal = locais.find(local => local.id === value);
    if (selectedLocal) {
      const sortedMesas = (selectedLocal.mesas || []).sort((a, b) => a.numero - b.numero);
      setMesas(sortedMesas);
      setLocalId(selectedLocal.id);
      setMesaId('');
      if (selectedLocal.photo) {
        try {
          const photoRef = storageRef(storage, selectedLocal.photo);
          const photoUrl = await getDownloadURL(photoRef);
          setFotoLocal(photoUrl);
        } catch (error) {
          console.error('Erro ao obter a URL da foto do local:', error);
        }
      } else {
        setFotoLocal(null);
      }
    }
  };

  useEffect(() => {
    if (dataReserva && localId) {
      const reservasRef = ref(database, 'reservas');
      onValue(reservasRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reservasData = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          const reservasFiltradas = reservasData.filter(reserva => reserva.dataReserva === dataReserva);
          setReservas(reservasFiltradas);
        } else {
          setReservas([]);
        }
      });
    }
  }, [dataReserva, localId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !whatsapp || !dataReserva || !mesaId || !localId) {
      setFormError(true);
      return;
    }
    setFormError(false);
    const reservaRef = push(ref(database, 'reservas'));
    const reservaData = {
      nome,
      numeroPessoas,
      whatsapp,
      dataReserva,
      mesaId,
      localId,
      itensAdicionais: selectedItensAdicionais,
      timestamp: new Date().toISOString()
    };

    set(reservaRef, reservaData)
      .then(() => {
        const mesaRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
        set(mesaRef, { ...mesas.find(mesa => mesa.id === mesaId), reservado: 'Y' });

        setNome('');
        setWhatsapp('');
        setData('');
        setMesaId('');
        setLocalId('');
        setShowDropdowns(false);
        setShowItensAdicionais(false);

        toast({
          icon: <CalendarCheck />,
          title: "Reserva realizada!",
          description: `Reserva para ${nome} na data ${dataReserva} realizada com sucesso.`,
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar reserva para o banco de dados:", error);
        toast({
          title: "Erro ao realizar reserva",
          description: "Ocorreu um erro ao tentar enviar sua reserva. Por favor, tente novamente mais tarde.",
          status: "error",
        });
      });
  };

  const handleItemChange = (itemId) => {
    setSelectedItensAdicionais((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const logoStyle = {
    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
  };

  return (
    <div className='flex justify-center items-center relative'>
      <Card>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="absolute bottom-4 right-4">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Escuro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CardHeader>
          <div style={logoStyle}>
            <Image src={Logo} className='h-[100px] w-[100px]' alt="" />
          </div>
          <CardTitle>Reserve sua mesa na Casa97</CardTitle>
          <CardDescription>
            Faça sua reserva agora para garantir um lugar em uma de nossas mesas exclusivas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {showDropdowns ? (
              <div className="lg:flex lg:gap-8">
                <div className="flex flex-col mb-4 lg:w-1/2">
                  <h2 className='my-2'>Escolha um local:</h2>
                  <Select onValueChange={handleLocalMesaChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o local da mesa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Locais</SelectLabel>
                        {locais.map((local, index) => (
                          <SelectItem key={index} value={local.id}>{local.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fotoLocal && (
                    <div className="mt-4 flex justify-center">
                      <Image src={fotoLocal} alt="Foto do local" width={400} height={250} className="rounded-md max-w-full"/>
                    </div>
                  )}
                </div>
                <div className="flex-col w-full lg:w-1/2">
                  <h3 className='mt-2'>Escolha sua mesa:</h3>
                  {mesas.map((mesa) => (
                    <div key={mesa.id} className="flex justify-center space-x-2 m-3">
                      <Button
                        type="button"
                        className={`w-full ${mesaId === mesa.id ? 'bg-blue-500' : 'bg-gray-500'}`}
                        disabled={reservas.some(reserva => reserva.mesaId === mesa.id)}
                        onClick={() => {
                          setMesaId(mesa.id);
                          setShowItensAdicionais(true);
                        }}
                      >
                        Mesa {mesa.numero} {reservas.some(reserva => {
                          return reserva.mesaId === mesa.id;
                        }) && "(Reservado)"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    className="mb-[20px]"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">Whatsapp (com DDD)</Label>
                  <Input
                    id="whatsapp"
                    type="text"
                    className="mb-[20px]"
                    placeholder="Digite seu Whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    className="mb-[20px]"
                    placeholder=""
                    value={dataReserva}
                    onChange={(e) => setData(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numeroPessoas">Número de Pessoas</Label>
                  <Input
                    id="numeroPessoas"
                    type="number"
                    className="mb-[20px]"
                    placeholder="Digite o número de pessoas"
                    value={numeroPessoas}
                    onChange={(e) => setNumeroPessoas(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            {showItensAdicionais && (
              <div className="mt-4">
                <h3>Selecione Itens Adicionais:</h3>
                {itensAdicionais.map((item) => (
                  <div key={item.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={item.id}
                      value={item.id}
                      checked={selectedItensAdicionais.includes(item.id)}
                      onChange={() => handleItemChange(item.id)}
                    />
                    <label htmlFor={item.id} className="ml-2">{item.nome}</label>
                  </div>
                ))}
              </div>
            )}
            {formError && (
              <p className="text-red-500">Todos os campos são obrigatórios.</p>
            )}
            {showDropdowns ? (
              <Button type="submit" className="mt-4">
                Reservar
              </Button>
            ) : (
              <Button onClick={handleShowDropdowns} className="mt-4">
                Selecionar Local e Mesa
              </Button>
            )
            }
            {/* Input oculto para armazenar o ID da mesa selecionada */}
            <Input id="mesa" type="hidden" value={mesaId} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservaForm;
