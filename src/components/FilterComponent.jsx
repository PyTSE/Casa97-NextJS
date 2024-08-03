import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
export default function FilterComponent({ columns, locais, mesas }) {
  const filteredColumns = columns.filter((column) =>
    ["name", "reservationDate", "location", "table", "paid"].includes(column.accessorKey)
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [location, setLocation] = useState("");
  const [minDateRange, setMinDateRange] = useState(new Date());
  const [selectedLocal, setSelectedLocal] = useState(new Date());
  console.log(selectedLocal);
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
    setColumnFilters((prev) => {
      const existingFilter = prev.find((filter) => filter.id === "data");
      if (existingFilter) {
        return prev.map((filter) =>
          filter.id === "data"
            ? { ...filter, value: dateRange }
            : filter
        );
      } else {
        return [...prev, { id: "data", value: dateRange }];
      }
    });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setColumnFilters((prev) => {
      const existingFilter = prev.find((filter) => filter.id === "local");
      if (existingFilter) {
        return prev.map((filter) =>
          filter.id === "local" ? { ...filter, value } : filter
        );
      } else {
        return [...prev, { id: "local", value }];
      }
    });
  };

  return (
    <>
    <div className="grid grid-cols-4 gap-4 m-6">
    <div className="flexCenter flex-col gap-2">
        <Label>Nome do Cliente</Label>
        <Input
          id="name"
          className="border-2 rounded-sm text-center"
          type="text"
          name="name"
          placeholder="Nome do Cliente"
          onChange={handleDateChange}
        />
      </div>
      <div className="flexCenter flex-col gap-2">
        <Label>Data Início</Label>
        <DatePicker
          id="data"
          className="border-2 rounded-sm text-center cursor-pointer"
          onChange={(date) => setMinDateRange(date.toISOString().split('T')[0])}
          required
          locale={ptBR}
          placeholderText="Selecione uma data"
          dateFormat="dd/MM/yyyy"
          type="date"
          name="start"
          value={dateRange.start}
        />
      </div>
      <div className="flexCenter flex-col gap-2">
        <Label>Data Início</Label>
        <DatePicker
          id="data"
          className="border-2 rounded-sm text-center cursor-pointer"
          onChange={(date) => setMinDateRange(date.toISOString().split('T')[0])}
          required
          locale={ptBR}
          placeholderText="Selecione uma data"
          dateFormat="dd/MM/yyyy"
          type="date"
          name="start"
          value={dateRange.start}
        />
      </div>
      <div className="flexCenter flex-col gap-2">
        <Label>Local</Label>
        <Select
          value={selectedLocal}
          onChange={handleLocationChange}
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
          value={location}
          onChange={handleLocationChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um local" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Locais</SelectLabel>
              {mesas.map((mesa) => (
                <SelectItem key={mesa.id} value={mesa.id}>
                  {mesa.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    </>
  );
}
