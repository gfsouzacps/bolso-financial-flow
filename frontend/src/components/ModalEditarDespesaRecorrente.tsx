import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTransacoes } from '@/contexts/ContextoTransacao';

const esquemaEdicaoRecorrente = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  tipo: z.enum(['receita', 'despesa']),
  categoriaTransacaoId: z.string().optional(),
  frequencia: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semester', 'yearly']),
  dataFim: z.date().optional(),
  eInfinito: z.boolean(),
});

type DadosFormularioEdicaoRecorrente = z.infer<typeof esquemaEdicaoRecorrente>;

interface ModalEditarDespesaRecorrenteProps {
  despesaId: string;
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

export function ModalEditarDespesaRecorrente({ despesaId, aberto, onAbertoChange }: ModalEditarDespesaRecorrenteProps) {
  const { transacoes, atualizarTransacao, categoriasTransacao } = useTransacoes();
  
  const transacaoRecorrente = transacoes.find(t => 
    t.id === despesaId && t.recorrencia?.tipo !== 'none'
  );

  const form = useForm<DadosFormularioEdicaoRecorrente>({
    resolver: zodResolver(esquemaEdicaoRecorrente),
    defaultValues: {
      descricao: '',
      valor: 0,
      tipo: 'despesa',
      categoriaTransacaoId: '',
      frequencia: 'monthly',
      dataFim: undefined,
      eInfinito: false,
    },
  });

  useEffect(() => {
    if (transacaoRecorrente) {
      form.reset({
        descricao: transacaoRecorrente.descricao,
        valor: transacaoRecorrente.valor,
        tipo: transacaoRecorrente.tipo,
        categoriaTransacaoId: transacaoRecorrente.categoriaTransacaoId || '',
        frequencia: transacaoRecorrente.recorrencia?.tipo as any || 'monthly',
        dataFim: transacaoRecorrente.recorrencia?.dataFim,
        eInfinito: transacaoRecorrente.recorrencia?.eInfinito || false,
      });
    }
  }, [transacaoRecorrente, form]);

  const onSubmit = (dados: DadosFormularioEdicaoRecorrente) => {
    if (!transacaoRecorrente) return;

    const transacaoAtualizada = {
      ...transacaoRecorrente,
      descricao: dados.descricao,
      valor: dados.valor,
      tipo: dados.tipo,
      categoriaTransacaoId: dados.categoriaTransacaoId,
      recorrencia: {
        ...transacaoRecorrente.recorrencia!,
        tipo: dados.frequencia,
        dataFim: dados.dataFim,
        eInfinito: dados.eInfinito,
      },
    };

    atualizarTransacao(transacaoAtualizada);
    onAbertoChange(false);
  };

  const tipoSelecionado = form.watch('tipo');
  const eRecorrenciaInfinita = form.watch('eInfinito');

  const categoriasDisponiveis = categoriasTransacao.filter(categoria => 
    categoria.tipo === tipoSelecionado || categoria.tipo === 'ambos'
  );

  const opcoesFrequencia = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quinzenal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'bimonthly', label: 'Bimestral' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'semester', label: 'Semestral' },
    { value: 'yearly', label: 'Anual' },
  ];

  if (!transacaoRecorrente) return null;

  return (
    <Dialog open={aberto} onOpenChange={onAbertoChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Transação Recorrente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aluguel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="receita">Entrada</SelectItem>
                      <SelectItem value="despesa">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoriaTransacaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriasDisponiveis.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
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
              name="frequencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {opcoesFrequencia.map((opcao) => (
                        <SelectItem key={opcao.value} value={opcao.value}>
                          {opcao.label}
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
              name="eInfinito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Sem fim (vitalícia)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!eRecorrenciaInfinita && (
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Final</FormLabel>
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
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onAbertoChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}