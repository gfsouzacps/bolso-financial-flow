import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Clock, Target, CalendarIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { esquemaTransacao, type DadosFormularioTransacao } from '@/lib/validations/transacao';

export function ModalTransacao() {
  const [aberto, setAberto] = useState(false);
  const [mostrarRecorrencia, setMostrarRecorrencia] = useState(false);
  const [ultimoIdCarteira, setUltimoIdCarteira] = useState<string>('');
  const [ultimoIdUsuario, setUltimoIdUsuario] = useState<string>('');
  
  const { adicionarTransacao, carteiras, usuarioAtual, categoriasInvestimento, categoriasTransacao } = useTransacoes();

  const form = useForm<DadosFormularioTransacao>({
    resolver: zodResolver(esquemaTransacao),
    defaultValues: {
      descricao: '',
      valor: 0,
      tipo: 'despesa',
      data: new Date(),
      carteiraId: ultimoIdCarteira || '',
      usuarioId: usuarioAtual?.id || '',
      categoriaId: '',
      categoriaTransacaoId: '',
      recorrencia: {
        tipo: 'none',
        eInfinito: false,
      },
    },
  });

  const camposObservados = form.watch(['descricao', 'valor', 'carteiraId', 'usuarioId']);
  const eFormularioValido = camposObservados[0] && camposObservados[1] > 0 && camposObservados[2] && camposObservados[3];

  useEffect(() => {
    if (usuarioAtual?.id) {
      form.setValue('usuarioId', usuarioAtual.id);
      setUltimoIdUsuario(usuarioAtual.id);
    }
  }, [usuarioAtual, form]);

  const onSubmit = (dados: DadosFormularioTransacao) => {
    const dadosTransacao = {
      descricao: dados.descricao,
      valor: dados.valor,
      tipo: dados.tipo,
      data: dados.data,
      carteiraId: dados.carteiraId,
      usuarioId: dados.usuarioId,
      categoriaId: dados.categoriaId,
      categoriaTransacaoId: dados.categoriaTransacaoId,
      recorrencia: {
        tipo: dados.recorrencia?.tipo || 'none',
        repeticoes: dados.recorrencia?.repeticoes,
        dataFim: dados.recorrencia?.dataFim,
        eInfinito: dados.recorrencia?.eInfinito || false,
      },
    };
    
    setUltimoIdCarteira(dados.carteiraId);
    setUltimoIdUsuario(dados.usuarioId);
    
    adicionarTransacao(dadosTransacao);
    form.reset({
      descricao: '',
      valor: 0,
      tipo: 'despesa',
      data: new Date(),
      carteiraId: dados.carteiraId,
      usuarioId: dados.usuarioId,
      categoriaId: '',
      categoriaTransacaoId: '',
      recorrencia: {
        tipo: 'none',
        eInfinito: false,
      },
    });
    setMostrarRecorrencia(false);
    setAberto(false);
  };

  const tipoRecorrencia = form.watch('recorrencia.tipo');
  const eRecorrenciaInfinita = form.watch('recorrencia.eInfinito');
  const carteiraSelecionada = form.watch('carteiraId');
  const tipoSelecionado = form.watch('tipo');
  const eCarteiraInvestimento = carteiras.find(c => c.id === carteiraSelecionada)?.nome === 'Investimentos';

  const categoriasDisponiveis = categoriasTransacao.filter(categoria => 
    categoria.tipo === tipoSelecionado || categoria.tipo === 'ambos'
  );

  return (
    <TooltipProvider>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogTrigger asChild>
          <Button size="lg" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
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
                      <Input placeholder="Ex: Supermercado" {...field} />
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
                        {carteiras.map((carteira) => (
                          <SelectItem key={carteira.id} value={carteira.id}>
                            <div className="flex items-center gap-2">
                              {carteira.nome}
                              {carteira.nome === 'Investimentos' && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Valor reservado para objetivos futuros</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {eCarteiraInvestimento && (
                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Categoria de Investimento
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriasInvestimento.map((categoria) => (
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
              )}

              <FormField
                control={form.control}
                name="usuarioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input {...field} value={usuarioAtual?.nome || ''} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Collapsible open={mostrarRecorrencia} onOpenChange={setMostrarRecorrencia}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      {mostrarRecorrencia ? 'Ocultar recorrência' : 'Adicionar recorrência'}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="recorrencia.tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Recorrência</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a recorrência" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                              <SelectItem value="yearly">Anual</SelectItem>
                              <SelectItem value="custom">Customizada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {tipoRecorrencia !== 'none' && (
                      <FormField
                        control={form.control}
                        name="recorrencia.eInfinito"
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
                    )}

                    {tipoRecorrencia === 'custom' && !eRecorrenciaInfinita && (
                      <FormField
                        control={form.control}
                        name="recorrencia.repeticoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Repetições</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Ex: 12"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {tipoRecorrencia !== 'none' && !eRecorrenciaInfinita && (
                      <FormField
                        control={form.control}
                        name="recorrencia.dataFim"
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
                  </CollapsibleContent>
                </Collapsible>
              </div>

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
                <Button type="button" variant="outline" onClick={() => setAberto(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={!eFormularioValido}>
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}