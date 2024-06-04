import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from 'next/image';
import Logo from '../../public/casa97.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const ReservaForm = () => {
  const { theme, setTheme } = useTheme()
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [data, setData] = useState('');
  const [numeroPessoas, setNumeroPessoas] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { nome, whatsapp, data, numeroPessoas };
    localStorage.setItem('reservaData', JSON.stringify(formData));
  };

  const logoStyle = {
    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
  };

  return (
    <div className='flex justify-center items-center p-4'>
      <Card className="w-[450px] relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="absolute bottom-4 right-4">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Tema do Celular
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
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                className="mb-[20px]"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">Whatsapp</Label>
              <Input
                id="whatsapp"
                type="text"
                className="mb-[20px]"
                placeholder="Digite seu whatsapp"
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
                placeholder="Digite a data da reserva"
                value={data}
                onChange={(e) => setData(e.target.value)}
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
            <Button type="submit" className="mt-[20px]">Próximo</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservaForm;
