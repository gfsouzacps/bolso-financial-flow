import { useState } from 'react';
import { ProvedorTransacao } from '@/contexts/ContextoTransacao';
import { Header } from '@/components/Header';
import { SeletorUsuario } from '@/components/SeletorUsuario';
import { CardSaldo } from '@/components/CardSaldo';
import { FiltrosTransacao } from '@/components/FiltrosTransacao';
import { ListaTransacoes } from '@/components/ListaTransacoes';
import { GraficoFinanceiro } from '@/components/GraficoFinanceiro';
import { CardInvestimento } from '@/components/CardInvestimento';
import { CardResumo } from '@/components/CardResumo';
import { CardDespesasRecorrentes } from '@/components/CardDespesasRecorrentes';
import { DetalhesDespesasRecorrentes } from '@/components/DetalhesDespesasRecorrentes';
import { BotaoAcaoRapida } from '@/components/BotaoAcaoRapida';
import { ModalDespesa } from '@/components/ModalDespesa';
import { ModalReceita } from '@/components/ModalReceita';
import { ModalRecorrente } from '@/components/ModalRecorrente';
import { ModalChat } from '@/components/ModalChat';

const PaginaPrincipal = () => {
  const [mostrarDetalhesRecorrentes, setMostrarDetalhesRecorrentes] = useState(false);
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
  const [modalReceitaAberto, setModalReceitaAberto] = useState(false);
  const [modalRecorrenteAberto, setModalRecorrenteAberto] = useState(false);

  if (mostrarDetalhesRecorrentes) {
    return (
      <ProvedorTransacao>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
            <DetalhesDespesasRecorrentes aoVoltar={() => setMostrarDetalhesRecorrentes(false)} />
          </div>
        </div>
      </ProvedorTransacao>
    );
  }

  return (
    <ProvedorTransacao>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
          <Header />
          <SeletorUsuario />
          <CardSaldo />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 order-1 lg:order-1">
              <FiltrosTransacao />
              <ListaTransacoes />
            </div>
            <div className="lg:col-span-1 order-2 lg:order-2">
              <GraficoFinanceiro />
            </div>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <CardDespesasRecorrentes onClick={() => setMostrarDetalhesRecorrentes(true)} />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <CardInvestimento />
            <CardResumo />
          </div>
          
          <BotaoAcaoRapida
            onCliqueDespesa={() => setModalDespesaAberto(true)}
            onCliqueReceita={() => setModalReceitaAberto(true)}
            onCliqueRecorrente={() => setModalRecorrenteAberto(true)}
          />
          
          <ModalDespesa aberto={modalDespesaAberto} onAbertoChange={setModalDespesaAberto} />
          <ModalReceita aberto={modalReceitaAberto} onAbertoChange={setModalReceitaAberto} />
          <ModalRecorrente aberto={modalRecorrenteAberto} onAbertoChange={setModalRecorrenteAberto} />
          <ModalChat />
        </div>
      </div>
    </ProvedorTransacao>
  );
};

export default PaginaPrincipal;