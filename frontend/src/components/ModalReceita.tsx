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

const esquemaReceita = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  categoriaTransacaoId: z.string().min(1, 'Categoria é obrigatória'),
  carteiraId: z.string().min(1, 'Carteira é obrigatória'),
  data: z.date(),
});

type DadosFormularioReceita = z.infer<typeof esquemaReceita>;

interface ModalReceitaProps {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

export function ModalReceita({ aberto, onAbertoChange }: ModalReceitaProps) {
  const { adicionarTransacao, categoriasTransacao, carteiras, usuarioAtual } = useTransacoes();

  const form = useForm<DadosFormularioReceita>({
    resolver: zodResolver(esquemaReceita),
    defaultValues: {
      descricao: '',
      valor: 0,
      categoriaTransacaoId: '',
      carteiraId: '',
      data: new Date(),
    },
  });

  const categoriasDeReceita = categoriasTransacao.filter(cat => 
    cat.tipo === 'receita' || cat.tipo === 'ambos'
  );

  const carteirasDisponiveis = carteiras.filter(c => c.nome !== 'Investimentos');

  const onSubmit = (dados: DadosFormularioReceita) => {
    if (!usuarioAtual) return;

    adicionarTransacao({
      descricao: dados.descricao,
      valor: dados.valor,
      tipo: 'receita',
      data: dados.data,
      carteiraId: dados.carteiraId,
      usuarioId: usuarioAtual.id,
      categoriaTransacaoId: dados.categoriaTransacaoId,
    });

    form.reset();
    onAbertoChange(false);
  };

  return (
    <Dialog open={aberto} onOpenChange={onAbertoChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Receita Pontual</DialogTitle>
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
                    <Input placeholder="Ex: Freelance design" {...field} />
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
                      {categoriasDeReceita.map((categoria) => (
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
              name="carteiraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carteira</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a carteira" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carteirasDisponiveis.map((carteira) => (
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
                Salvar Receita
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}