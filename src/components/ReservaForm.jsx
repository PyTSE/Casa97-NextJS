"use client";
require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CalendarCheck, Moon, Sun, ShoppingCart, Circle } from "lucide-react";
import { useTheme } from "next-themes";
import Image from 'next/image';
import { format, parseISO, addDays, isBefore, isEqual } from 'date-fns';
import Logo from '../../public/casa97.png';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, get } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/constants';
import { utcToZonedTime } from 'date-fns-tz';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import ReactInputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import { createMessage, sendMessage } from '@/lib/utils';
import ImageZoom from './ImageZoom';

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

const ReservaForm = (props) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dataReserva, setData] = useState('');
  const [mesaId, setMesaId] = useState('');
  const [localId, setLocalId] = useState('');
  const [showModalPessoas, setShowModalPessoas] = useState(false);
  const [numeroPessoas, setNumeroPessoas] = useState('');
  const [showDropdowns, setShowDropdowns] = useState(false);
  const [showInitialForm, setshowInitialForm] = useState(true);
  const [locais, setLocais] = useState([]);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [mesas, setMesas] = useState([]);
  const [cardHScreen, setCardHScreen] = useState('h-screen');
  const [reservas, setReservas] = useState([]);
  const [formError, setFormError] = useState(false);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [showItensAdicionais, setShowItensAdicionais] = useState(false);
  const [itensAdicionais, setItensAdicionais] = useState([]);
  const [cardClass, setCardClass] = useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDialogFinalOpen, setIsDialogFinalOpen] = React.useState(false);
  const [selectedItensAdicionais, setSelectedItensAdicionais] = useState([]);
  const [cardDescription, setCardDescription] = useState("Faça sua reserva agora para garantir um lugar em uma de nossas mesas exclusivas.");
  const [cardTitle, setCardTitle] = useState("Reserve sua mesa na Casa97");
  const [isAdding, setIsAdding] = useState(false);
  const [desativacaoIntervals, setDesativacaoIntervals] = useState([]);
  const [userClass, setUserClass] = useState('');
  const [localNome, setLocalNome] = useState('');
  const [mesaNome, setMesaNome] = useState(''); 

  const fetchDesativacaoIntervals = async () => {
    const intervalsRef = ref(database, "intervalosDesativacao");
    const snapshot = await get(intervalsRef);
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  };

  const formatDateToYearMonthDay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // `getMonth()` retorna 0-11, então somamos 1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  useEffect(() => {
    const fetchIntervals = async () => {
      const intervals = await fetchDesativacaoIntervals();
      setDesativacaoIntervals(intervals);
    };

    fetchIntervals();
  }, []);

  const date = new Date();
  const options = {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  };
  const options2 = {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  };
  let zonedDate = date.toLocaleString('en-US', options2);
  zonedDate = format(zonedDate, 'yyyy-MM-dd');
  const zonedHour = date.toLocaleTimeString('pt-BR', options);
  if(zonedHour >= '17:30'){
    desativacaoIntervals.push({dataInicio: zonedDate, dataFim: zonedDate});
  }

  useEffect(() => {
    if(props.type === 'user'){
      setUserClass('md:w-1/2');
    }
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
    if(numeroPessoas > 4){
      setShowModalPessoas(true);
      toast({
        title: "Número de pessoas excedido!",
        description: "Por favor, insira um número menor de pessoas ou continue o atendimento via WhatsApp",
        status: "error",
      });
      return;
    }

    if (!nome || !whatsapp || !dataReserva || !numeroPessoas) {
      setFormError(true);
    } else if (!validarWhatsapp(whatsapp)) {
      setFormError(true);
      toast({
        title: "Erro no formulário",
        variant: "destructive",
        description: "Por favor, insira um número de WhatsApp válido no formato (XX) XXXXX-XXXX.",
        status: "error",
      });
    } else if(!validarNome(nome)){
      setFormError(true);
      toast({
        title: "Erro no formulário",
        variant: "destructive",
        description: "Por favor, insira um nome válido.",
        status: "error",
      });
    } else {
      setFormError(false);
      setShowDropdowns(true);
      setshowInitialForm(false);
      setCardClass(cardClass === '' ? 'h-[900px]' : '');
      setCardDescription("");
      setCardTitle("Selecione o Local");
    }
    
  };

  const handleContact = () => {
    const phoneNumber = '554732279537';
    const message = `Olá, gostaria de uma mesa para ${numeroPessoas} pessoas`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const handleAdicionarItem = (item) => {

    setCarrinhoOpen(true);
    setItensCarrinho((prevItensCarrinho) => [...prevItensCarrinho, item])
    toast({
      icon: <ShoppingCart/>,
      title: "Item adicionado ao carrinho!",
      description: `${item.nome} adicionado ao carrinho com sucesso.`,
    });
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
      setCardHScreen('h-screen');
      setCardDescription("Faça sua reserva agora para garantir um lugar em uma de nossas mesas exclusivas.");
      setCardTitle("Reserve sua mesa na Casa97");
  };

  const handleShowItensAdicionais = () => {
    if (mesaId && localId) {
      setShowItensAdicionais(true);
      setShowDropdowns(false);
      setCardTitle("Selecione Itens Adicionais");
    } else {
      setFormError(true);
    }
  };

  const handleLocalMesaChange = async (value) => {
    const selectedLocal = locais.find(local => local.id === value);
    setLocalNome(selectedLocal ? selectedLocal.name : '');
    if (selectedLocal) {
      const sortedMesas = (selectedLocal.mesas || []).sort((a, b) => a.numero - b.numero);
      setMesas(sortedMesas);
      setLocalId(selectedLocal.id);
      setMesaId('');
      setCardHScreen('');
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
      const unsubscribe = onValue(reservasRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reservasData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          const reservasFiltradas = reservasData.filter((reserva) => reserva.dataReserva === dataReserva);
          setReservas(reservasFiltradas);
        } else {
          setReservas([]);
        }
      });
  
      return () => unsubscribe();
    }
  }, [dataReserva, localId]);

  const validarWhatsapp = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, '');
    
    const regex = /^\d{2}\d{5}\d{4}$/;
    return regex.test(numeroLimpo);
  };

  function validarNome(nome) {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return regex.test(nome);
  }
  const handleMesaSelect = async (mesaSelecionada) => {
    if (!dataReserva) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data antes de escolher a mesa.",
        variant: "destructive",
      });
      return;
    }
  
    const reservasRef = ref(database, `reservas/${localId}`);
    const snapshot = await get(reservasRef);
    const reservas = snapshot.val();
  
    const mesaReservada = reservas
      ? Object.values(reservas).some(
          (reserva) =>
            reserva.mesaId === mesa.id &&
            reserva.dataReserva === dataReserva
        )
      : false;
  
    if (mesaReservada) {
      toast({
        title: "Mesa já reservada",
        description: "Esta mesa já foi reservada para a data selecionada. Por favor, escolha outra.",
        variant: "destructive",
      });
    } else {
      setMesaId(mesaSelecionada.id);
      setMesaNome(mesas.find((mesa) => mesa.id === mesaSelecionada.id)?.numero || '');   
      toast({
        title: "Mesa selecionada",
        description: `Mesa ${mesaSelecionada.numero} selecionada com sucesso.`,
        variant: "success",
      });
    }
  };
  
  const formatDateToISO = (dateString) => {
    const parsedDate = new Date(dateString);
    return format(parsedDate, 'yyyy-MM-dd');
  };
  const [year, month, day] = dataReserva.split('-');
  const formattedDate = `${day}/${month}/${year}`;
  
  const handleSubmit = async (e) => {
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
      pago: itensCarrinho.length > 0 ? "N" : "Y",
      itensAdicionais: itensCarrinho.map(item => item.id), // Filtrando apenas os IDs dos itens adicionais no submit
      timestamp: new Date().toISOString()
    };
    setIsDialogFinalOpen(true);
    const payload = {
      formattedDate,
      nome,
      whatsapp,
      itensCarrinho: itensCarrinho.length > 0 ? itensCarrinho : 0,
      mesaNome,
      localNome,
      numeroPessoas
    }
    await sendMessage(payload);
    
    set(reservaRef, reservaData)
      .then(() => {
        const mesaRef = ref(database, `spaces/${localId}/mesas/${mesaId}`);
        set(mesaRef, { ...mesas.find(mesa => mesa.id === mesaId), reservado: 'Y', ultimaReserva: dataReserva});

        setNome('');
        setWhatsapp('');
        setData('');
        setMesaId('');
        setLocalId('');
        setNumeroPessoas('');
        setItensCarrinho([]);
        setShowDropdowns(false);
        setShowItensAdicionais(false);
        setshowInitialForm(true);
        setFotoLocal(null);

        toast({
          icon: <CalendarCheck />,
          title: "Reserva realizada!",
          description: `Reserva para ${nome} na data ${formattedDate} realizada com sucesso.`,
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

  const handleDateChange = (date) => {
    const formattedDate = formatDateToISO(date);
    setData(formattedDate);
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
  
  const isDateDisabled = (date) => {
    const normalizedDate = formatDateToYearMonthDay(date);
    return desativacaoIntervals.some(
      (range) =>
        normalizedDate >= (range.dataInicio) &&
        normalizedDate <= (range.dataFim)
    );
  };

  const isMesaAtiva = (mesa) => mesa.ativo !== false;
  
  const today = new Date();
  const minDate = new Date();
  
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 7);
  const maxDate = futureDate;
  
  return (
    <>
      <Card className={`w-full max-h-full overflow-y-auto ${userClass}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className=" bottom-1 right-10">
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
          <div style={logoStyle} className='flexBetween items-center'>
            <CardTitle>{cardTitle}</CardTitle>
            <Image src={Logo} className='h-[42px] w-[42px]' alt="" />
          </div>
          <CardDescription>
            {cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
            {showInitialForm && (
              <div className='flex flex-col gap-4'>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
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
                  <ReactInputMask
                    mask="(99) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => {
                      // Remover todos os caracteres não numéricos
                      const apenasNumeros = e.target.value.replace(/\D/g, '');
                      setWhatsapp(apenasNumeros);
                    }}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        id="whatsapp"
                        type="text"
                        required
                        placeholder="(XX) XXXXX-XXXX"
                      />
                    )}
                  </ReactInputMask>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Reserva</Label>
                  <div>
                  {props.type === "user" && (
                    <DatePicker
                      id="data"
                      className="border-2 rounded-sm text-center cursor-pointer"
                      selected={dataReserva ? parseISO(dataReserva) : null}
                      onChange={handleDateChange}
                      required
                      locale={ptBR}
                      placeholderText="Selecione uma data"
                      minDate={minDate}
                      maxDate={maxDate}
                      filterDate={(date) => !isDateDisabled(date)}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                  {props.type === "admin" && (
                    <DatePicker
                      id="data"
                      className="border-2 rounded-sm text-center cursor-pointer"
                      selected={dataReserva ? parseISO(dataReserva) : null}
                      onChange={handleDateChange}
                      required
                      locale={ptBR}
                      placeholderText="Selecione uma data"
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="numero-pessoas">Número de Pessoas</Label>
                  <Input
                    id="numero-pessoas"
                    type="number"
                    min={1}
                    max={25}
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
                    <Select id="local" onValueChange={handleLocalMesaChange} value={localId}>
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
                      <ImageZoom src={fotoLocal} alt="Foto do Local"/>
                    </div>
                  )}
                </div>
                <div className='flexCenter flex-col w-full lg:w-1/2'>
                  <Label htmlFor="mesa">Selecione a Mesa</Label>
                  {mesas.map((mesa) => {
                    const isDisabledByCapacity = numeroPessoas > mesa.numeroPessoas;
                    const isDisabled = !isMesaAtiva(mesa) || reservas.some(reserva => reserva.mesaId === mesa.id) || isDisabledByCapacity;

                    return (
                      <div key={mesa.id} className="w-full flex justify-center space-x-2 m-3">
                        <Button
                          type="button"
                          className={`w-full ${mesaId === mesa.id ? 'bg-blue-500 !important' : ''}`}
                          variant='default'
                          disabled={isDisabled}
                          onClick={() => {
                            if (!isDisabled) {
                              handleMesaSelect(mesa);
                            }
                          }}
                        >
                          Mesa {mesa.numero}
                          {reservas.some(reserva => reserva.mesaId === mesa.id) && " (Reservado)"}
                          {!isMesaAtiva(mesa) && " (Desativada)"}
                          {isDisabledByCapacity && ` - Mesa para ${mesa.numeroPessoas} pessoas`}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='flex gap-4'>
                <Button type="button" onClick={handleShowItensAdicionais}>Próximo</Button>
                <Button type="button" onClick={handleCancelDropdowns}>Voltar</Button>
              </div>
              </>

            )}
            {showItensAdicionais && (
              <div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${props.type === "admin" ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-5`}>
                  {itensAdicionais.map((item) => (
                    <Card key={item.id} id="itensAdicionais" onValueChange={handleItemChange} className='h-full'>
                      <CardHeader>
                        <CardTitle className='mb-4'>{item.name}</CardTitle>
                        <div className="flex items-center space-x-4 rounded-md border lg:h-60">
                          <ImageZoom src={item.photo} alt={item.name} />
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
                  <Button type="submit">Confirmar Reserva</Button>
                  <Button type="button" onClick={() => { setShowItensAdicionais(false); setShowDropdowns(true); }}>Voltar</Button>
                </div>
              </div>
            )}
            {carrinhoOpen && (
              <>
              <Button 
                className="fixed-button"
                type="button"
                onClick={() => setIsDialogOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Carrinho</span>
              </Button>
              </>
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
                {itensCarrinho.map((item) => (
                  <div className="flex items-center justify-between my-2 bold-16" key={item.id}>
                    <div className="flex-1">
                      <p className="text-md">{item.nome}</p>
                    </div>
                    <div className="mr-12">
                      <p className="text-md">R${item.preco}</p>
                    </div>
                    <Button onClick={() => handleRemoverItem(item.id)}>Remover</Button>
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
            <Dialog open={isDialogFinalOpen} onOpenChange={setIsDialogFinalOpen}>
              <DialogTrigger asChild />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reserva Confirmada!</DialogTitle>
                </DialogHeader>
                <p className='text-lg'>Em breve voce receberá uma confirmação via WhatsApp.</p>
                <div className='flexBetween flex-col gap-4 text-sx items-start'>
                </div>
              </DialogContent>
            </Dialog>
            {formError && <p className="text-red-500">Preencha todos os campos obrigatórios.</p>}
        </form>
        </CardContent>
      </Card>
      <Dialog open={showModalPessoas} onOpenChange={setShowModalPessoas}>
        <DialogTrigger asChild />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Número de Pessoas Excedido</DialogTitle>
          </DialogHeader>
          <p className='text-lg'>Não temos mais mesas disponíveis para o número de pessoas selecionado, por favor entre em contato conosco via WhatsApp para que possamos auxilia-lo.</p>
          <div className='flexBetween flex-col gap-4 text-sx items-start'>
            <Button onClick={handleContact}>Entrar em contato</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservaForm;
