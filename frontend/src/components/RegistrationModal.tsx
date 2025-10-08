import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

export function RegistrationModal() {
    // Alterado estado de 'name' e 'password' para 'nome' e 'senha'
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // Chamada da função com as novas variáveis
            await register(nome, email, senha);
        } catch (err) {
            setError('Erro ao registrar. Verifique os dados e tente novamente.');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link">Não tem uma conta? Registre-se</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar uma nova conta</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para criar seu acesso à plataforma NoBolso.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-2">
                        {/* Atributos atualizados para 'nome' */}
                        <Label htmlFor="nome">Nome</Label>
                        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} disabled={isLoading} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                    </div>
                    <div className="space-y-2">
                        {/* Atributos atualizados para 'senha' */}
                        <Label htmlFor="senha">Senha</Label>
                        <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} disabled={isLoading} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}