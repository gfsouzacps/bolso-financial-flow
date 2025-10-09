import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAutenticacao } from '@/contexts/ContextoAutenticacao';
import { Mail, Lock, Chrome } from 'lucide-react';
import { ModalRegistro } from '@/components/ModalRegistro';

const PaginaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login, loginComGoogle, estaCarregando } = useAutenticacao();

  const tratarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(email, senha);
    } catch (error) {
      setErro('Credenciais inválidas. Tente novamente.');
    }
  };

  const tratarLoginComGoogle = async () => {
    setErro('');
    try {
      await loginComGoogle();
    } catch (error) {
      setErro('Erro ao fazer login com Google. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={tratarSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={estaCarregando}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10"
                  disabled={estaCarregando}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={estaCarregando}
            >
              {estaCarregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={tratarLoginComGoogle}
            className="w-full"
            disabled={estaCarregando}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Entrar com Google
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Credenciais de teste:</p>
            <p>E-mail: admin@teste.com</p>
            <p>Senha: 123456</p>
          </div>

          <div className="text-center">
            <ModalRegistro />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaLogin;