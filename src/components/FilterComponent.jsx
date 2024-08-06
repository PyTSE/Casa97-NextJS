import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Button } from "./ui/button";
import { getDatabase, onValue, query, ref, orderByChild, startAt, endAt, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/constants";
import { ChevronDown } from "lucide-react";

export default function FilterComponent({ onFilter, columns, locais }) {
  const filteredColumns = columns.filter((column) =>
    ["name", "reservationDate", "location", "table", "paid"].includes(column.accessorKey)
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dateQueryStart, setDateQueryStart] = useState(null);
  const [dateQueryEnd, setDateQueryEnd] = useState(null);
  const [dateStartFormated, setDateStartFormated] = useState(null);
  const [dateEndFormated, setDateEndFormated] = useState(null);
  const [location, setLocation] = useState("");
  const [minDateRange, setMinDateRange] = useState(new Date());
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState(false);
  const [mesas, setMesas] = useState([]);

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);

  useEffect(() => {
    const extractedMesas = [];
    locais.forEach((local) => {
      if (local.mesas) { // Check if 'mesas' field exists
        extractedMesas.push(...local.mesas.map((mesa) => ({
          id: mesa.id, // Assuming mesa has an 'id' field
          label: `Mesa ${mesa.numero}`,
          numero: mesa.numero,
        })));
      }
    });
  
    // Sort mesas by 'numero' in ascending order
    extractedMesas.sort((a, b) => a.numero - b.numero);
  
    setMesas(extractedMesas);
  }, [locais]);
  

  console.log("Mesas:", mesas);
  

  const handleDates = (type, date) => {
    if (type === 'end') {
      setDateQueryEnd(date);
      const dateUTC = parseISO(date);
      const dateLocal = new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
      const dateFormated = format(dateLocal, 'dd/MM/yyyy');
      setDateEnd(dateLocal);
      return setDateEndFormated(dateFormated);
    } else {
      setDateQueryStart(date);
      const dateUTC = parseISO(date);
      const dateLocal = new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
      const dateFormated = format(dateLocal, 'dd/MM/yyyy');
      setDateStart(dateLocal);
      return setDateStartFormated(dateFormated);
    }
  }

  const handleLocalMesaChange = (value) => {
    setSelectedLocal(value);
  };

  const handleMesaChange = (selectedOption) => {
    setSelectedMesa(selectedOption);
  };

  const toggleShowFilters = () => {
    setShowFilters(prevStatus => !prevStatus);
  };

  const handleSubmitFilter = async (event) => {
    event.preventDefault();
    const filters = {
      name: selectedName,
      start: dateStart,
      end: dateEnd,
      location: selectedLocal,
      table: selectedMesa,
    };
    setColumnFilters(filters);

    let queryRef = ref(database, 'reservas');

    if (dateStart || dateEnd) {
      queryRef = query(queryRef, orderByChild('dataReserva'));
      if (dateStart) {
        queryRef = query(queryRef, startAt(dateQueryStart));
      }
      if (dateEnd) {
        queryRef = query(queryRef, endAt(dateQueryEnd));
      }
    }

    onValue(queryRef, async (snapshot) => {
      const reservations = snapshot.val();
      let filteredReservations = {};

      if (reservations) {
        Object.keys(reservations).forEach(key => {
          const reservation = reservations[key];
          let include = true;

          if (selectedName && reservation.nome !== selectedName) {
            include = false;
          }
          if (selectedLocal && reservation.localId !== selectedLocal) {
            include = false;
          }
          if (selectedMesa && reservation.mesaId !== selectedMesa) {
            include = false;
          }

          if (include) {
            filteredReservations[key] = reservation;
          }
        });
        
        const reservasPromises = Object.keys(filteredReservations).map(async (key) => {
          const reserva = filteredReservations[key];
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
            onFilter(reservas);
            setShowFilters(false);
            console.log("Reservas filtradas:", reservas);
            
          })
          .catch(error => console.error("Erro ao formatar reservas filtradas:", error));
      }else{
        onFilter([]);
        setShowFilters(false);
      }
    });
  };

  const clearFilters = () => {
    setSelectedName(null);
    setDateStart(null);
    setDateEnd(null);
    setDateStartFormated(null);
    setDateEndFormated(null);
    setSelectedLocal(null);
    setSelectedMesa(null);
    setColumnFilters([]);
  };

  return (
    <>
      <Button onClick={toggleShowFilters} className="ml-2">
        Filtrar <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      {showFilters && (
        <form onSubmit={handleSubmitFilter}>
          <div className="grid grid-cols-4 gap-4 m-6">
            <div className="flexCenter flex-col gap-2">
              <Label>Nome do Cliente</Label>
              <Input
                id="name"
                className="border-2 rounded-sm text-center"
                type="text"
                name="name"
                placeholder="Nome do Cliente"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              />
            </div>
            <div className="flexCenter flex-col gap-2">
              <Label>Data Início</Label>
              <DatePicker
                id="data-start"
                className="border-2 rounded-sm text-center cursor-pointer"
                onChange={(date) => handleDates('start', date.toISOString().split('T')[0])}
                locale={ptBR}
                placeholderText="Selecione uma data"
                dateFormat="dd/MM/yyyy"
                type="date"
                name="start"
                value={dateStartFormated}
                maxDate={dateEnd}
              />
            </div>
            <div className="flexCenter flex-col gap-2">
              <Label>Data Fim</Label>
              <DatePicker
                id="data-end"
                className="border-2 rounded-sm text-center cursor-pointer"
                onChange={(date) => handleDates('end', date.toISOString().split('T')[0])}
                locale={ptBR}
                placeholderText="Selecione uma data"
                dateFormat="dd/MM/yyyy"
                type="date"
                name="end"
                value={dateEndFormated}
                disabled={!dateStartFormated}
                minDate={dateStart}
              />
            </div>
            <div className="flexCenter flex-col gap-2">
              <Label>Local</Label>
              <Select
                value={selectedLocal}
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
            </div>
            <div className="flexCenter flex-col gap-2">
              <Label>Mesa</Label>
              <Select
                value={selectedMesa}
                onValueChange={handleMesaChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Locais</SelectLabel>
                    {mesas.map((mesas) => (
                      <SelectItem key={mesas.id} value={mesas.id}>
                        {mesas.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flexEnd mt-4">
            <Button type="submit" className="mr-2">
              Aplicar Filtros
            </Button>
            <Button type="button" className="mr-2" onClick={() => setShowFilters(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => clearFilters()}>
              Limpar Filtros
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
