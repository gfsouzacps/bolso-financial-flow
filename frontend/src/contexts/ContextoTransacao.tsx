import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transacao, Carteira, FiltrosTransacao, Usuario, CategoriaInvestimento, CategoriaTransacao, DetalheDespesaRecorrente } from '@/types/transacao';

interface ContextoTransacaoTipo {
  transacoes: Transacao[];
  carteiras: Carteira[];
  usuarios: Usuario[];
  categoriasInvestimento: CategoriaInvestimento[];
  categoriasTransacao: CategoriaTransacao[];
  filtros: FiltrosTransacao;
  usuarioAtual: Usuario | null;
  adicionarTransacao: (transacao: Omit<Transacao, 'id'>) => void;
  atualizarTransacao: (transacao: Transacao) => void;
  adicionarCategoriaInvestimento: (categoria: Omit<CategoriaInvestimento, 'id' | 'criadoEm' | 'atual'>) => void;
  atualizarCategoriaInvestimento: (id: string, categoria: CategoriaInvestimento) => void;
  atualizarFiltros: (filtros: Partial<FiltrosTransacao>) => void;
  setUsuarioAtual: (usuario: Usuario) => void;
  obterTransacoesFiltradas: () => Transacao[];
  obterSaldoTotal: () => number;
  obterTotalReceitas: () => number;
  obterTotalDespesas: () => number;
  obterDespesasRecorrentes: () => { totalMensal: number; totalRestante: number };
  obterDetalhesDespesasRecorrentes: () => DetalheDespesaRecorrente[];
  removerDespesaRecorrente: (transacaoId: string) => void;
  obterReceitaMensal: () => number;
}

const ContextoTransacao = createContext<ContextoTransacaoTipo | undefined>(undefined);

// Dados mocados para demonstração
const mockUsuarios: Usuario[] = [
  { id: '1', nome: 'Você', cor: 'bg-blue-500' },
  { id: '2', nome: 'Sua Esposa', cor: 'bg-pink-500' },
];

const mockCarteiras: Carteira[] = [
  { id: '1', nome: 'Débito', saldo: 1250.00 },
  { id: '2', nome: 'Crédito', saldo: -500.00 },
  { id: '3', nome: 'Investimentos', saldo: 5000.00 },
];

const mockCategoriasTransacao: CategoriaTransacao[] = [
  { id: '1', nome: 'Restaurante', tipo: 'despesa', cor: 'bg-red-500' },
  { id: '2', nome: 'Supermercado', tipo: 'despesa', cor: 'bg-green-500' },
  { id: '3', nome: 'Moradia', tipo: 'despesa', cor: 'bg-blue-500' },
  { id: '4', nome: 'Transporte', tipo: 'despesa', cor: 'bg-yellow-500' },
  { id: '5', nome: 'Lazer', tipo: 'despesa', cor: 'bg-purple-500' },
  { id: '6', nome: 'Saúde', tipo: 'despesa', cor: 'bg-pink-500' },
  { id: '7', nome: 'Educação', tipo: 'despesa', cor: 'bg-indigo-500' },
  { id: '8', nome: 'Salário', tipo: 'receita', cor: 'bg-green-600' },
  { id: '9', nome: 'Outras Receitas', tipo: 'receita', cor: 'bg-emerald-500' },
];

const mockCategoriasInvestimento: CategoriaInvestimento[] = [
  {
    id: '1',
    nome: 'Reserva de Emergência',
    objetivo: 10000,
    atual: 5000,
    cor: 'bg-green-500',
    criadoEm: new Date('2024-01-15')
  },
  {
    id: '2',
    nome: 'Viagem Europa',
    objetivo: 8000,
    atual: 2500,
    cor: 'bg-blue-500',
    criadoEm: new Date('2024-02-01')
  },
  {
    id: '3',
    nome: 'Carro Novo',
    objetivo: 35000,
    atual: 15000,
    cor: 'bg-purple-500',
    criadoEm: new Date('2024-03-10')
  }
];

const mockTransacoes: Transacao[] = [
  {
    id: '1',
    descricao: 'Salário',
    valor: 3500.00,
    tipo: 'receita',
    data: new Date('2024-06-01'),
    carteiraId: '1',
    usuarioId: '1',
    categoriaTransacaoId: '8',
    recorrencia: {
      tipo: 'monthly',
      eInfinito: true
    }
  },
  {
    id: '2',
    descricao: 'Supermercado',
    valor: 250.00,
    tipo: 'despesa',
    data: new Date('2024-06-05'),
    carteiraId: '1',
    usuarioId: '2',
    categoriaTransacaoId: '2'
  },
  {
    id: '3',
    descricao: 'Freelance',
    valor: 800.00,
    tipo: 'receita',
    data: new Date('2024-06-10'),
    carteiraId: '1',
    usuarioId: '1',
    categoriaTransacaoId: '9'
  },
  {
    id: '4',
    descricao: 'Financiamento Casa',
    valor: 1200.00,
    tipo: 'despesa',
    data: new Date('2024-06-08'),
    carteiraId: '1',
    usuarioId: '1',
    categoriaTransacaoId: '3',
    recorrencia: {
      tipo: 'monthly',
      repeticoes: 36,
      dataFim: new Date('2027-06-08')
    }
  },
  {
    id: '5',
    descricao: 'Netflix',
    valor: 45.00,
    tipo: 'despesa',
    data: new Date('2024-06-11'),
    carteiraId: '2',
    usuarioId: '2',
    categoriaTransacaoId: '5',
    recorrencia: {
      tipo: 'monthly',
      eInfinito: true
    }
  },
];

export function ProvedorTransacao({ children }: { children: ReactNode }) {
  const [transacoes, setTransacoes] = useState<Transacao[]>(mockTransacoes);
  const [carteiras] = useState<Carteira[]>(mockCarteiras);
  const [usuarios] = useState<Usuario[]>(mockUsuarios);
  const [categoriasInvestimento, setCategoriasInvestimento] = useState<CategoriaInvestimento[]>(mockCategoriasInvestimento);
  const [categoriasTransacao] = useState<CategoriaTransacao[]>(mockCategoriasTransacao);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(mockUsuarios[0]);
  const [filtros, setFiltros] = useState<FiltrosTransacao>({
    tipo: 'todos'
  });

  const adicionarTransacao = (transacao: Omit<Transacao, 'id'>) => {
    const novaTransacao: Transacao = {
      ...transacao,
      id: Date.now().toString(),
    };
    setTransacoes(prev => [novaTransacao, ...prev]);
  };

  const atualizarTransacao = (transacaoAtualizada: Transacao) => {
    setTransacoes(prev => 
      prev.map(transacao => 
        transacao.id === transacaoAtualizada.id ? transacaoAtualizada : transacao
      )
    );
  };

  const adicionarCategoriaInvestimento = (categoria: Omit<CategoriaInvestimento, 'id' | 'criadoEm' | 'atual'>) => {
    const novaCategoria: CategoriaInvestimento = {
      ...categoria,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atual: 0,
    };
    setCategoriasInvestimento(prev => [...prev, novaCategoria]);
  };

  const atualizarCategoriaInvestimento = (id: string, categoriaAtualizada: CategoriaInvestimento) => {
    setCategoriasInvestimento(prev => 
      prev.map(categoria => categoria.id === id ? categoriaAtualizada : categoria)
    );
  };

  const removerDespesaRecorrente = (transacaoId: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== transacaoId));
  };

  const atualizarFiltros = (novosFiltros: Partial<FiltrosTransacao>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  };

  const obterTransacoesFiltradas = () => {
    return transacoes.filter(transacao => {
      const tipoCorresponde = filtros.tipo === 'todos' || transacao.tipo === filtros.tipo;
      const dataInicioCorresponde = !filtros.dataInicio || transacao.data >= filtros.dataInicio;
      const dataFimCorresponde = !filtros.dataFim || transacao.data <= filtros.dataFim;
      const carteiraCorresponde = !filtros.carteiraId || transacao.carteiraId === filtros.carteiraId;
      const usuarioCorresponde = !filtros.usuarioId || transacao.usuarioId === filtros.usuarioId;

      return tipoCorresponde && dataInicioCorresponde && dataFimCorresponde && carteiraCorresponde && usuarioCorresponde;
    });
  };

  const obterSaldoTotal = () => {
    return transacoes.reduce((total, transacao) => {
      return transacao.tipo === 'receita' 
        ? total + transacao.valor 
        : total - transacao.valor;
    }, 0);
  };

  const obterTotalReceitas = () => {
    return transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0);
  };

  const obterTotalDespesas = () => {
    return transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0);
  };

  const obterDespesasRecorrentes = () => {
    const despesasRecorrentes = transacoes.filter(t => 
      t.tipo === 'despesa' && 
      t.recorrencia && 
      t.recorrencia.tipo !== 'none'
    );

    let totalMensal = 0;
    let totalRestante = 0;

    despesasRecorrentes.forEach(despesa => {
      if (despesa.recorrencia) {
        let valorMensal = 0;
        switch (despesa.recorrencia.tipo) {
          case 'monthly':
            valorMensal = despesa.valor;
            break;
          case 'weekly':
            valorMensal = despesa.valor * 4.33;
            break;
          case 'yearly':
            valorMensal = despesa.valor / 12;
            break;
        }

        totalMensal += valorMensal;

        if (despesa.recorrencia.eInfinito) {
          totalRestante = Infinity;
        } else if (despesa.recorrencia.repeticoes) {
          const mesesRestantes = despesa.recorrencia.repeticoes - 1;
          totalRestante += valorMensal * mesesRestantes;
        }
      }
    });

    return { totalMensal, totalRestante };
  };

  const obterDetalhesDespesasRecorrentes = (): DetalheDespesaRecorrente[] => {
    const despesasRecorrentes = transacoes.filter(t => 
      t.tipo === 'despesa' && 
      t.recorrencia && 
      t.recorrencia.tipo !== 'none'
    );

    return despesasRecorrentes.map(despesa => {
      let valorMensal = 0;
      let totalRestante = 0;

      if (despesa.recorrencia) {
        switch (despesa.recorrencia.tipo) {
          case 'monthly':
            valorMensal = despesa.valor;
            break;
          case 'weekly':
            valorMensal = despesa.valor * 4.33;
            break;
          case 'yearly':
            valorMensal = despesa.valor / 12;
            break;
        }

        if (despesa.recorrencia.eInfinito) {
          totalRestante = Infinity;
        } else if (despesa.recorrencia.repeticoes) {
          const mesesRestantes = despesa.recorrencia.repeticoes - 1;
          totalRestante = valorMensal * mesesRestantes;
        }
      }

      return {
        id: despesa.id,
        descricao: despesa.descricao,
        valorMensal,
        dataFim: despesa.recorrencia?.dataFim,
        eInfinito: despesa.recorrencia?.eInfinito || false,
        totalRestante
      };
    });
  };

  const obterReceitaMensal = () => {
    const receitaRecorrente = transacoes.filter(t => 
      t.tipo === 'receita' && 
      t.recorrencia && 
      t.recorrencia.tipo !== 'none'
    );

    return receitaRecorrente.reduce((total, receita) => {
      if (receita.recorrencia) {
        switch (receita.recorrencia.tipo) {
          case 'monthly':
            return total + receita.valor;
          case 'weekly':
            return total + (receita.valor * 4.33);
          case 'yearly':
            return total + (receita.valor / 12);
          default:
            return total;
        }
      }
      return total;
    }, 0);
  };

  return (
    <ContextoTransacao.Provider
      value={{
        transacoes,
        carteiras,
        usuarios,
        categoriasInvestimento,
        categoriasTransacao,
        usuarioAtual,
        filtros,
        adicionarTransacao,
        atualizarTransacao,
        adicionarCategoriaInvestimento,
        atualizarCategoriaInvestimento,
        removerDespesaRecorrente,
        atualizarFiltros,
        setUsuarioAtual,
        obterTransacoesFiltradas,
        obterSaldoTotal,
        obterTotalReceitas,
        obterTotalDespesas,
        obterDespesasRecorrentes,
        obterDetalhesDespesasRecorrentes,
        obterReceitaMensal,
      }}
    >
      {children}
    </ContextoTransacao.Provider>
  );
}

export function useTransacoes() {
  const contexto = useContext(ContextoTransacao);
  if (contexto === undefined) {
    throw new Error('useTransacoes deve ser usado dentro de um ProvedorTransacao');
  }
  return contexto;
}