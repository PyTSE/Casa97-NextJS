import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function FilterComponent({ columns }) {
  const filteredColumns = columns.filter((column) =>
    ["name", "reservationDate", "location", "table", "paid"].includes(column.accessorKey)
  );

  console.log('Filtered Columns:', filteredColumns);
  const [columnFilters, setColumnFilters] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [location, setLocation] = useState("");
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
    <div className="grid grid-cols-4 gap-4">
    {filteredColumns
      .map((column) => {
        if (column.accessorKey === "data") {
          return (
            <div key={column.accessorKey} className="">
              <Label>Data Início</Label>
              <Input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
              />
              <Label>Data Fim</Label>
              <Input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
              />
            </div>
          );
        } else if (column.accessorKey === "local") {
          return (
            <div key={column.accessorKey} className="">
              <Label>Local</Label>
              <select
                value={location}
                onChange={handleLocationChange}
              >
                {/* Substitua pelos locais disponíveis */}
                <option value="">Selecione um local</option>
                <option value="Local 1">Local 1</option>
                <option value="Local 2">Local 2</option>
                <option value="Local 3">Local 3</option>
              </select>
            </div>
          );
        } else {
          return (
            <div key={column.accessorKey} className="">
              <Label>
                {column.header}
                <Input
                  type="text"
                  value={
                    columnFilters.find(
                      (filter) => filter.id === column.accessorKey
                    )?.value || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setColumnFilters((prev) => {
                      const existingFilter = prev.find(
                        (filter) => filter.id === column.accessorKey
                      );
                      if (existingFilter) {
                        return prev.map((filter) =>
                          filter.id === column.accessorKey
                            ? { ...filter, value }
                            : filter
                        );
                      } else {
                        return [...prev, { id: column.accessorKey, value }];
                      }
                    });
                  }}
                />
              </Label>
            </div>
          );
        }
      })}
  </div>
  );
}
