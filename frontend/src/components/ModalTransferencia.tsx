import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTransacoes } from '@/contexts/ContextoTransacao';

const esquemaTransferencia = z.object({
  valor: z.number().positive('Valor deve ser positivo'),
  idCarteiraOrigem: z.string().min(1, 'Carteira de origem é obrigatória'),
  idCarteiraDestino: z.string().min(1, 'Carteira de destino é obrigatória'),
  data: z.date(),
}).refine((data) => data.idCarteiraOrigem !== data.idCarteiraDestino, {
  message: "Carteira de origem deve ser diferente da de destino",
  path: ["idCarteiraDestino"],
});

type DadosFormularioTransferencia = z.infer<typeof esquemaTransferencia>;

interface ModalTransferenciaProps {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

export function ModalTransferencia({ aberto, onAbertoChange }: ModalTransferenciaProps) {
  const { adicionarTransacao, carteiras, usuarioAtual } = useTransacoes();

  const form = useForm<DadosFormularioTransferencia>({
    resolver: zodResolver(esquemaTransferencia),
    defaultValues: {
      valor: 0,
      idCarteiraOrigem: '',
      idCarteiraDestino: '',
      data: new Date(),
    },
  });

  const idCarteiraOrigemObservado = form.watch('idCarteiraOrigem');

  const onSubmit = (dados: DadosFormularioTransferencia) => {
    if (!usuarioAtual) return;

    const carteiraOrigem = carteiras.find(c => c.id === dados.idCarteiraOrigem);
    const carteiraDestino = carteiras.find(c => c.id === dados.idCarteiraDestino);

    if (!carteiraOrigem || !carteiraDestino) return;

    // Criar transação de saída
    adicionarTransacao({
      descricao: `Transferência para ${carteiraDestino.nome}`,
      valor: dados.valor,
      tipo: 'despesa',
      data: dados.data,
      carteiraId: dados.idCarteiraOrigem,
      usuarioId: usuarioAtual.id,
    });

    // Criar transação de entrada
    adicionarTransacao({
      descricao: `Transferência de ${carteiraOrigem.nome}`,
      valor: dados.valor,
      tipo: 'receita',
      data: dados.data,
      carteiraId: dados.idCarteiraDestino,
      usuarioId: usuarioAtual.id,
    });

    form.reset();
    onAbertoChange(false);
  };

  return (
    <Dialog open={aberto} onOpenChange={onAbertoChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferir entre Contas</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCarteiraOrigem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carteira de Origem</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carteiras.map((carteira) => (
                        <SelectItem key={carteira.id} value={carteira.id}>
                          {carteira.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCarteiraDestino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carteira de Destino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carteiras
                        .filter(carteira => carteira.id !== idCarteiraOrigemObservado)
                        .map((carteira) => (
                          <SelectItem key={carteira.id} value={carteira.id}>
                            {carteira.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onAbertoChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Transferir
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}