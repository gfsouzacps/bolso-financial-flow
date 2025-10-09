import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTransacoes } from '@/contexts/ContextoTransacao';

export function FiltrosTransacao() {
  const { filtros, atualizarFiltros, carteiras } = useTransacoes();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select
        value={filtros.tipo || 'todos'}
        onValueChange={(value) => atualizarFiltros({ tipo: value as any })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="receita">Entradas</SelectItem>
          <SelectItem value="despesa">Saídas</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filtros.carteiraId || 'todos'}
        onValueChange={(value) => atualizarFiltros({ carteiraId: value === 'todos' ? undefined : value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Carteira" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          {carteiras.map((carteira) => (
            <SelectItem key={carteira.id} value={carteira.id}>
              {carteira.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal",
              !filtros.dataInicio && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy") : "Data inicial"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filtros.dataInicio}
            onSelect={(date) => atualizarFiltros({ dataInicio: date })}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal",
              !filtros.dataFim && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy") : "Data final"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filtros.dataFim}
            onSelect={(date) => atualizarFiltros({ dataFim: date })}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {(filtros.dataInicio || filtros.dataFim || filtros.tipo !== 'todos' || filtros.carteiraId) && (
        <Button
          variant="ghost"
          onClick={() => atualizarFiltros({ dataInicio: undefined, dataFim: undefined, tipo: 'todos', carteiraId: undefined })}
          className="px-3"
        >
          Limpar
        </Button>
      )}
    </div>
  );
}