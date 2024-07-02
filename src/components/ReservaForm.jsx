import React, { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CalendarCheck, Moon, Sun, ShoppingCart } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

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
  const [showInitialForm, setshowInitialForm] = useState(true);
  const [locais, setLocais] = useState([]);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [formError, setFormError] = useState(false);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [showItensAdicionais, setShowItensAdicionais] = useState(false);
  const [itensAdicionais, setItensAdicionais] = useState([]);
  const [cardClass, setCardClass] = useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
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
    const itensRef = ref(database, "items");
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
      setshowInitialForm(false);
      setCardClass(cardClass === '' ? 'h-[900px]' : '');
    }
    
  };

  const handleAdicionarItem = (item) => {
    setCarrinhoOpen(true);
    setItensCarrinho([...itensCarrinho, item]);
  };

  const handleRemoverItem = (index) => {
    const novoCarrinho = [...itensCarrinho];
    novoCarrinho.splice(index, 1);
    setItensCarrinho(novoCarrinho);
  };

  const handleCancelDropdowns = () => {
      setFormError(false);
      setShowDropdowns(false);
      setshowInitialForm(true);
  };

  const handleShowItensAdicionais = () => {
    if (mesaId && localId) {
      setShowItensAdicionais(true);
      setShowDropdowns(false);
    } else {
      setFormError(true);
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
    <div className='flex justify-center items-center relative h-full'>
      <Card className={`w-full ${cardClass} max-h-full overflow-y-auto`}>
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
          <div style={logoStyle} className='mb-2'>
            <Image src={Logo} className='h-[42px] w-[42px]' alt="" />
          </div>
          <CardTitle>Reserve sua mesa na Casa97</CardTitle>
          <CardDescription>
            Faça sua reserva agora para garantir um lugar em uma de nossas mesas exclusivas.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
            {showInitialForm && (
              <div className='flex flex-col gap-4'>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="whatsapp">Whatsapp</Label>
                  <Input
                    id="whatsapp"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="data">Data da Reserva</Label>
                  <Input
                    id="data"
                    type="date"
                    value={dataReserva}
                    onChange={(e) => setData(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="numero-pessoas">Número de Pessoas</Label>
                  <Input
                    id="numero-pessoas"
                    type="number"
                    value={numeroPessoas}
                    onChange={(e) => setNumeroPessoas(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            {!showDropdowns && !showItensAdicionais && (
              <div className='mt-4'>
                <Button type="button" onClick={handleShowDropdowns}>Próximo</Button>
              </div>
            )}
            {showDropdowns && (
              <>
                <div className='flex flex-col lg:flex-row gap-4 justify-around my-4'>
                  <div className='flexCenter flex-col gap-4 lg:mr-10'>
                    <Label htmlFor="local">Selecione o Local</Label>
                    <Select id="local" onValueChange={handleLocalMesaChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Locais</SelectLabel>
                          {locais.map((local) => (
                            <SelectItem key={local.id} value={local.id}>
                              {local.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  {fotoLocal && (
                    <div className="flex justify-center w-80">
                      <img src={fotoLocal} alt="Foto do Local" className="max-w-full h-auto rounded-sm" />
                    </div>
                  )}
                </div>
                <div className='flexCenter flex-col w-full lg:w-1/2'>
                  <Label htmlFor="mesa">Selecione a Mesa</Label>
                  {mesas.map((mesa) => (
                    <div key={mesa.id} className="w-full flex justify-center space-x-2 m-3">
                      <Button
                        type="button"
                        className={`w-full ${mesaId === mesa.id ? 'bg-blue-500' : 'bg-gray-500'}`}
                        disabled={reservas.some(reserva => reserva.mesaId === mesa.id)}
                        onClick={() => {
                          setMesaId(mesa.id);
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
              <div className='flex gap-4'>
                <Button type="button" onClick={handleShowItensAdicionais}>Próximo</Button>
                <Button type="button" onClick={handleCancelDropdowns}>Cancelar</Button>
              </div>
              </>

            )}
            {showItensAdicionais && (
              <div>
                <Label htmlFor="itensAdicionais">Selecione Itens Adicionais</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {itensAdicionais.map((item) => (
                    <Card key={item.id} id="itensAdicionais" onValueChange={handleItemChange} className='h-full'>
                      <CardHeader>
                        <CardTitle className='mb-4'>Encanto (2 a 4 pessoas)</CardTitle>
                        <div className="flex items-center space-x-4 rounded-md border lg:h-60">
                          <Image src={item.photo} alt={item.name} width={502} height={502} className="h-full w-full object-cover"/>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='mb-4'>
                          <p>Inclui: Jogo americano na cor preto, sousplat branco, guardanapo de tecido preto, 2 velas, decorações com flores, trigos e mosquitinhos desidratados.</p>
                        </div>
                        <div className='flex flexCenter'>
                          <Button
                            type="button"
                            className=""
                            onClick={() => handleAdicionarItem({ nome: item.name, preco: item.itemValue })}
                          >
                          Adicionar Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className='flex gap-4 mt-5'>
                  <Button type="submit">Confirmar Reserva</Button>
                  <Button type="button" onClick={() => { setShowItensAdicionais(false); setShowDropdowns(true); }}>Voltar</Button>
                </div>
              </div>
            )}
            {carrinhoOpen && (
              <Button 
                variant="outline" 
                size="icon" 
                type='button'
                className="absolute bottom-16 right-4"
                onClick={() => { setIsDialogOpen(true) }}
              >
                <ShoppingCart className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Carrinho</DialogTitle>
                  <DialogDescription>
                    Abaixo são os itens que voce adicionou.
                  </DialogDescription>
                </DialogHeader>
                {itensCarrinho.map((item, index) => (
                  <div className="flex items-center justify-between my-2 bold-16" key={index}>
                    <div className="flex-1">
                      <p className="text-md">{item.nome}</p>
                    </div>
                    <div className="mr-12">
                      <p className="text-md">R${item.preco}</p>
                    </div>
                    <Button onClick={() => handleRemoverItem(index)}>Remover</Button>
                  </div>
                ))}
                <div className='flexBetween bold-18 border-2 rounded-sm p-4 text-lg'>
                  <p>Total</p>
                  <p>
                    R${' '}
                    {itensCarrinho.reduce((acc, item) => acc + item.preco * 1, 0).toFixed(2)}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            {formError && <p className="text-red-500">Preencha todos os campos obrigatórios.</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservaForm;
