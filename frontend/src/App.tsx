import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvedorAutenticacao } from "@/contexts/ContextoAutenticacao";
import { RotaProtegida } from "@/components/RotaProtegida";
import PaginaPrincipal from "./pages/Principal";
import PaginaLogin from "./pages/Login.tsx";
import PaginaNaoEncontrada from "./pages/NaoEncontrado";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProvedorAutenticacao>
          <Routes>
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/" element={
              <RotaProtegida>
                <PaginaPrincipal />
              </RotaProtegida>
            } />
            {/* ADICIONE TODAS AS ROTAS CUSTOMIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
            <Route path="*" element={<PaginaNaoEncontrada />} />
          </Routes>
        </ProvedorAutenticacao>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;