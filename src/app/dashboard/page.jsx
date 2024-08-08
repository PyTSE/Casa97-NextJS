"use client";

import * as React from "react";
import ReactInputMask from 'react-input-mask';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, remove, update } from "firebase/database";
import { firebaseConfig } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format, parseISO } from 'date-fns';
import ReservaForm from "@/components/ReservaForm";
import DateRange from "@/components/DateRange";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthGuard from "@/components/AuthGuard";
import { toast } from "@/components/ui/use-toast";
import FilterComponent from "@/components/FilterComponent";
import moment from "moment-timezone";

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export default function TabelaDeReservas() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [localId, setLocalId] = React.useState('');
  const [localIdToEdit, setLocalIdToEdit] = React.useState('');
  const [itensAdicionais, setItensAdicionais] = React.useState([]);
  const [locais, setLocais] = React.useState([]);
  const [dataReserva, setData] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [mesas, setMesas] = React.useState([]);
  const [mesaId, setMesaId] = React.useState('');
  const [mesaIdToEdit, setMesaIdToEdit] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [reservas, setReservasData] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [reservationToCancel, setReservationToCancel] = React.useState(null);
  const [reservationToEdit, setReservationToEdit] = React.useState(null);
  const [whatsapp, setWhatsapp] = React.useState('');
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(null);
  const [showIInputEdit, setShowIInputEdit] = React.useState(false);
  const [showItensAdicionaisEdit, setShowItensAdicionaisEdit] = React.useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [reservationToPayment, setReservationToPayment] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [showReservaForm, setShowReservaForm] = React.useState(null);
  const [nomeCliente, setNomeCliente] = React.useState('');
  const [isDisableDialogOpen, setIsDisableDialogOpen] = React.useState(null);
  const [cart, setCart] = React.useState({});
  const [showFilters, setShowFilters] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [filtersOn, setFiltersOn] = React.useState(false);
  

  const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD');
  console.log(hoje);

  React.useEffect(() => {
    const dbRef = ref(database, "reservas");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reservasPromises = Object.keys(data).map(async (key) => {
          const reserva = data[key];
          const mesaRef = ref(database, `spaces/${reserva.localId}/mesas/${reserva.mesaId}`);
          const localRef = ref(database, `spaces/${reserva.localId}`);
          const itemsPromises = (reserva.itensAdicionais || []).map(async (itemId) => {
            const itemRef = ref(database, `items/${itemId}`);
            const itemSnapshot = await get(itemRef);
            return { id: itemId, ...itemSnapshot.val() };
          });
  
          const [mesaSnapshot, localSnapshot, items] = await Promise.all([
            get(mesaRef),
            get(localRef),
            Promise.all(itemsPromises)
          ]);
  
          const mesaNome = mesaSnapshot.val().numero;
          const localNome = localSnapshot.val().name;
  
          return {
            id: key,
            name: reserva.nome,
            whatsapp: reserva.whatsapp,
            reservationDate: reserva.dataReserva,
            table: mesaNome,
            location: localNome,
            items: items,
            paid: reserva.pago,
            ended: reserva.finalizado,
          };
        });
        
        Promise.all(reservasPromises)
        .then(reservas => {
          // Ordenar reservas: futuras primeiro, passadas depois
          const sortedReservas = reservas.sort((a, b) => {
            const dateA = moment.tz(a.reservationDate, 'America/Sao_Paulo').startOf('day');
            const dateB = moment.tz(b.reservationDate, 'America/Sao_Paulo').startOf('day');
          
            // Se a data for menor que hoje, deve ficar por último
            const isBeforeHojeA = dateA.isBefore(hoje);
            const isBeforeHojeB = dateB.isBefore(hoje);
          
            if (isBeforeHojeA && !isBeforeHojeB) return 1; // dateA deve vir depois de dateB
            if (!isBeforeHojeA && isBeforeHojeB) return -1; // dateA deve vir antes de dateB
          
            // Comparar datas se ambas forem antes ou depois de hoje
            return dateA.isBefore(dateB) ? -1 : 1;
          });
          setTableData(sortedReservas);
          setReservasData(sortedReservas);
        })
        .catch(error => console.error("Erro ao carregar reservas:", error));
      } else {
        setReservasData([]);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  React.useEffect(() => {
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

  React.useEffect(() => {
    const calculateTotal = () => {
      let newTotal = 0;
      itensAdicionais.forEach((item) => {
        if (cart[item.id]) {
          newTotal += item.itemValue * cart[item.id];
        }
      });
      setTotal(newTotal);
    };

    calculateTotal();
  }, [cart, itensAdicionais]);
  
  const columns = [
    {
      accessorKey: "name",
      header: "Nome do Cliente",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "whatsapp",
      header: "Whatsapp do Cliente",
      cell: ({ row }) => <div>{row.getValue("whatsapp")}</div>,
    },
    {
      accessorKey: "reservationDate",
      header: "Data da Reserva",
      cell: ({ row }) => {
        const reservationDate = row.getValue("reservationDate");

        if (!reservationDate) {
          return <div></div>;
        }
        
        const dataInicioUTC = parseISO(reservationDate);
        
        const dataInicioLocal = new Date(dataInicioUTC.getTime() + dataInicioUTC.getTimezoneOffset() * 60000);
        
        const dataInicioFormatada = format(dataInicioLocal, 'dd/MM/yyyy');

        return (
          <div>{dataInicioFormatada}</div>
        );
      }
    },
    {
      accessorKey: "table",
      header: "Mesa Reservada",
      cell: ({ row }) => <div>{row.getValue("table")}</div>,
    },
    {
      accessorKey: "location",
      header: "Local Reservado",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "items",
      header: "Itens Adicionais",
      cell: ({ row }) => (
        <ul>
          {row.getValue("items").map((item) => (
            <li key={item.id}>{item.name} - R$ {item.itemValue}</li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: "paid",
      header: "Pago",
      cell: ({ row }) => (
        <ul>
          {row.getValue("paid") === "Y" ? (
            <Badge>Sim</Badge>
          ) : (
            <Badge variant="destructive">Não</Badge>
          )}
        </ul>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const reservation = row.original;
      
        const handleCancelReservation = (reservation) => {
          setDialogOpen(true);
          setReservationToCancel(reservation);
        };
      
        const handleEditReservation = (reservation) => {
          setIsEditDialogOpen(true);
          setReservationToEdit(reservation);
          setNomeCliente(reservation.name);
          const fetchData = async () => {
            try {
              const itensRef = ref(database, 'items');
              const reservaRef = ref(database, `reservas/${reservation.id}`);
          
              const itensUnsubscribe = onValue(itensRef, (snapshot) => {
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
          
              const reservaUnsubscribe = onValue(reservaRef, (snapshot) => {
                const reservaData = snapshot.val() || {};
                const { localId, mesaId, itensAdicionais = [] } = reservaData;
                setLocalId(localId || '');
                setMesaId(mesaId || '');
                itensAdicionais.forEach(itemId => {
                  if (itemId) {
                    handleAddItem(itemId);
                  }
                });
              });
          
              return () => {
                itensUnsubscribe();
                reservaUnsubscribe();
              };
            } catch (error) {
              console.error('Erro ao consultar o banco de dados', error);
            }
          };
        
          fetchData();
          setWhatsapp(reservation.whatsapp);
          setData(reservation.reservationDate);
          setShowIInputEdit(true);
        };
        
      
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
              {reservation.paid === "N" && (
                <DropdownMenuItem onClick={() => handlePayment(reservation)} className="cursor-pointer">
                  Alterar para Pago
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleCancelReservation(reservation)} className="cursor-pointer">
                Cancelar Reserva
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditReservation(reservation)} className="cursor-pointer">
                Alterar Reserva
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }    
  ];

  const handleFilter = (data) => {
    setFilteredData(data);
    setTableData(data);
    setFiltersOn(true);
    setShowFilters(false);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCancelEdit = () => {
    setCart({});
    setShowItensAdicionaisEdit(false);
  };

  const handleConfirmCancel = async () => {
    if (reservationToCancel) {
      const reservationRef = ref(database, `reservas/${reservationToCancel.id}`);
      await remove(reservationRef);
      setReservasData(prev => prev.filter(r => r.id !== reservationToCancel.id));
      setDialogOpen(false);
    }
  };

  const handleAddItem = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
  };

  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: Math.max((prevCart[itemId] || 0) - 1, 0)
    }));
  };

  const calculateTotal = () => {
    return itensAdicionais.reduce((total, item) => {
      const quantity = cart[item.id] || 0;
      return total + (item.itemValue * quantity);
    }, 0);
  };
  
  const handleSubmit = async () => {
    if (reservationToCancel) {
      const reservationRef = ref(database, `reservas/${reservationToCancel.id}`);
      await remove(reservationRef);
      setReservasData(prev => prev.filter(r => r.id !== reservationToCancel.id));
      setDialogOpen(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (reservationToPayment) {
      const reservationRef = ref(database, `reservas/${reservationToPayment.id}`);
      await update(reservationRef, { pago: "Y" });
      setReservasData(prev => prev.map(r => r.id === reservationToPayment.id ? { ...r, paid: "Y" } : r));
      setIsPaymentDialogOpen(false);
    }
  };

  const handlePayment = (reservation) => {
    setReservationToPayment(reservation);
    setIsPaymentDialogOpen(true);
  }

  const handleLocalMesaChange = async (localId) => {
    setLocalId(localId);
    setMesaId('');
    const selectedLocal = locais.find(local => local.id === localId);
    
    if (selectedLocal) {
      // Obter todas as mesas ativas do local selecionado
      const mesasAtivas = selectedLocal.mesas.filter(mesa => mesa.ativo);
  
      // Obter as reservas para a data selecionada
      const reservasRef = ref(database, 'reservas');
      const reservasSnapshot = await get(reservasRef);
      const reservasData = reservasSnapshot.val() || {};

      const mesasComReserva = mesasAtivas.map(mesa => {
        const isReserved = Object.values(reservasData).some(reserva => {
          return reserva.mesaId === mesa.id && reserva.dataReserva === dataReserva;
        });
        return {
          ...mesa,
          reservado: isReserved,
        };
      });
  
      setMesas(mesasComReserva);
    }
  };

  const handleAditionalItensEdit = async () => {
    setShowIInputEdit(false);
    setShowItensAdicionaisEdit(true);
  };

  const isOldReservation = (reservationDate) => {
    const reservationDateObj = moment.tz(reservationDate, 'America/Sao_Paulo').startOf('day');
    return reservationDateObj.isBefore(hoje, 'day');
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const whatsappCliente = whatsapp;
    const localSelecionado = localId;
    const mesaSelecionada = mesaId;
    
    const updatedReservation = {
      nome: nomeCliente,
      whatsapp: whatsappCliente,
      dataReserva: dataReserva,
      localId: localSelecionado,
      mesaId: mesaSelecionada,
      itensAdicionais: Object.keys(cart).filter(id => cart[id] > 0)
    };
  
    try {
      const reservaRef = ref(database, `reservas/${reservationToEdit.id}`);
      await update(reservaRef, updatedReservation);
      toast({
        variant: "outline",
        title: "Reserva atualizada com sucesso!",
      });
      setIsEditDialogOpen(false);
      setCart({});
      setShowItensAdicionaisEdit(false);
    } catch (error) {
      console.error('Erro ao atualizar a reserva:', error);
    }
  };

  return (
    <AuthGuard>
    <div>
      <div className="flex flex-col gap-5 my-4 py-4">
        <div className="flex ml-4">
          <div>
          <Button className="ml-2" onClick={() => setShowReservaForm(true)}>
            Adicionar Reserva
          </Button>
          </div>
          <div>
          <Button className="ml-2" onClick={() => setIsDisableDialogOpen(true)}>
            Desativar Reservas
          </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FilterComponent onFilter={handleFilter} columns={columns} locais={locais}/>
        </div>
        <div className="">
          <div className="flexEnd pr-5">
            {filtersOn && (
              <Button
                onClick={() => {
                  setFiltersOn(false);
                  setTableData(reservas);
                }}
              >
                Remover Filtros
              </Button>
            )
            }
          </div>
        </div>
      </div>
      <div className="rounded-md border">
      {tableData.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>Nenhuma reserva encontrada.</p>
          </div>
      ) : (
        <>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                        {header.column.getIsSorted() === "desc" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
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
                  className={isOldReservation(row.original.reservationDate) ? "bg-neutral-300" : ""}
                  data-state={row.getIsSelected() ? "selected" : ""}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma reserva encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flexCenter gap-4 p-5">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <span>
            Página{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </strong>{" "}
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </div>
        </>
      )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja cancelar esta reserva? Esta ação é irreversível.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Não</Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>Sim, cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar para Pago</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja alterar o status de pagamento desta reserva?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Não</Button>
            <Button onClick={handleConfirmPayment}>Sim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>Edite os detalhes da reserva.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mb-4">
        <form onSubmit={handleSubmit}>
          {showIInputEdit && (
            <>
              <Label htmlFor="edit-name">Nome do Cliente</Label>
              <Input 
                type="text" 
                id="edit-name" 
                defaultValue={reservationToEdit?.name}
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)} 
              />
              <Label htmlFor="edit-whatsapp">WhatsApp</Label>
              <ReactInputMask
                    id="edit-whatsapp"
                    mask="(99) 99999-9999"
                    value={whatsapp}
                    defaultValue={reservationToEdit?.whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
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
              <Label htmlFor="data">Data da Reserva</Label>
                  <Input
                    id="data"
                    type="date"
                    defaultValue={dataReserva}
                    value={dataReserva}
                    onChange={(e) => setData(e.target.value)}
                    required
                  />
              <Label htmlFor="value">Local</Label>
              <Select 
                id="local" 
                value={localId}
                onValueChange={handleLocalMesaChange}
              >
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
              <Label htmlFor="value">Mesa</Label>
              <Select 
                id="mesa" 
                value={mesaId}
                defaultValue={mesaId}
                onValueChange={(value) => setMesaId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma mesa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Mesas</SelectLabel>
                    {mesas.map((mesa) => (
                      <SelectItem 
                        key={mesa.id} 
                        value={mesa.id} 
                        disabled={mesa.reservado}
                      >
                        {mesa.numero} {mesa.reservado ? "(RESERVADO)" : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className='mt-5' onClick={handleAditionalItensEdit}>Itens Adicionais</Button>
            </>
          )}
          {showItensAdicionaisEdit && (
            <div>
              {itensAdicionais.map((item) => {
              return (
                <div key={item.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{item.name}</p>
                      <p>{item.description}</p>
                      <p>{`${item.itemValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        type="button"
                        onClick={() => handleRemoveItem(item.id)} 
                        disabled={cart[item.id] <= 0}
                      >
                        -
                      </Button>
                      <span className="mx-2">{cart[item.id] || 0}</span>
                      <Button type="button" onClick={() => handleAddItem(item.id)}>
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </form>
        </div>
        <DialogFooter className="gap-36">
          <div className="bold-16 flex-col">
            <h3>Total:</h3>
            <h3>{calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
          </div>
          <div>
            <Button type="submit" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
            {showItensAdicionaisEdit ? (
              <Button variant="ghost" onClick={() => {setShowIInputEdit(true); setShowItensAdicionaisEdit(false); }}>Voltar</Button>
            ) : (
              <DialogClose asChild>
                <Button variant="ghost"onClick={() => {handleCancelEdit();  setCart({});}}>Cancelar</Button>
              </DialogClose>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={showReservaForm} onOpenChange={setShowReservaForm}>
        <DialogContent className=" max-w-[40vw] h-full overflow-y-auto">
          <DialogHeader>
            <DialogClose asChild>
              <Button className="absolute top-4 right-4" variant="ghost">
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="w-full">
            <ReservaForm type="admin"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReservaForm(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desabilitar Reservas</DialogTitle>
          </DialogHeader>
          <DateRange></DateRange>
        </DialogContent>
    </Dialog>
    </div>
    </AuthGuard>
  );
}
