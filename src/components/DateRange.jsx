import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-menu';
import { getDatabase, ref, set, onValue, remove } from '@firebase/database';
import { initializeApp } from '@firebase/app';
import { firebaseConfig } from '@/constants';
import { format } from 'date-fns';
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const DateRange = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [formError, setFormError] = useState('');
  const [intervalos, setIntervalos] = useState([]);

  const desativarReservas = async (dataInicio, dataFim) => {
    const intervaloDesativado = {
      dataInicio,
      dataFim,
      timestamp: new Date().toISOString()
    };

    const intervaloRef = ref(database, `intervalosDesativacao/${dataInicio}_${dataFim}`);
    await set(intervaloRef, intervaloDesativado);
  };

  const fetchIntervalos = () => {
    const intervalosRef = ref(database, 'intervalosDesativacao');
    onValue(intervalosRef, (snapshot) => {
      const data = snapshot.val();
      const intervalosArray = data ? Object.values(data) : [];
      setIntervalos(intervalosArray);
    });
  };

  const excluirIntervalo = async (dataInicio, dataFim) => {
    const intervaloRef = ref(database, `intervalosDesativacao/${dataInicio}_${dataFim}`);
    await remove(intervaloRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataInicio || !dataFim) {
      setFormError('Por favor, preencha todas as datas.');
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      setFormError('A data de início não pode ser posterior à data de fim.');
      return;
    }

    try {
      await desativarReservas(dataInicio, dataFim);
      alert('Reservas desativadas com sucesso!');
      setDataInicio('');
      setDataFim('');
      setFormError('');
      fetchIntervalos(); // Atualiza a lista de intervalos
    } catch (error) {
      console.error('Erro ao desativar reservas:', error);
      alert('Ocorreu um erro ao desativar as reservas. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    fetchIntervalos(); // Carrega os intervalos ao iniciar o componente
  }, []);

  return (
    <div className='items-center'>
      <form onSubmit={handleSubmit} className='space-y-4 flex flex-col'>
        <div className='flex flex-col space-y-2'>
          <Label htmlFor='dataInicio'>Data de Início</Label>
          <Input
            id='dataInicio'
            type='date'
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col space-y-2'>
          <Label htmlFor='dataFim'>Data de Fim</Label>
          <Input
            id='dataFim'
            type='date'
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>
        <Button type='submit'>Desabilitar Datas</Button>
        {formError && <p className='text-red-500'>{formError}</p>}
      </form>
      <div className='mt-10'>
        <h2 className='text-lg font-bold'>Intervalos de Reserva Desativadas</h2>
        <ul>
          {intervalos.length > 0 ? (
            intervalos.map((intervalo, index) => {
            const dataInicioFormatada = format(new Date(intervalo.dataInicio), 'dd/MM/yyyy');
              const dataFimFormatada = format(new Date(intervalo.dataFim), 'dd/MM/yyyy');
                return (
            <div className='flexBetween'>
             <li key={index} className='border-b py-2'>
             <p><strong>Início:</strong> {dataInicioFormatada}</p>
             <p><strong>Fim:</strong> {dataFimFormatada}</p>
            </li>
            <Button
                onClick={() => { excluirIntervalo(intervalo.dataInicio, intervalo.dataFim) }}
                className='bg-red-500 text-white'
            >
                Excluir
            </Button>
            </div>                
            )}
        )
          ) : (
            <p className='text-sm mt-2'>Nenhum intervalo desativado encontrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DateRange;
