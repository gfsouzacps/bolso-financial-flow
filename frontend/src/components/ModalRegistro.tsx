import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useAutenticacao } from '@/contexts/ContextoAutenticacao';

export function ModalRegistro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const { registrar, estaCarregando } = useAutenticacao();

    const tratarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        try {
            await registrar(nome, email, senha);
        } catch (err) {
            setErro('Erro ao registrar. Verifique os dados e tente novamente.');
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
                <form onSubmit={tratarSubmit} className="space-y-4">
                    {erro && <p className="text-red-500 text-sm">{erro}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} disabled={estaCarregando} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={estaCarregando} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="senha">Senha</Label>
                        <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} disabled={estaCarregando} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={estaCarregando}>
                        {estaCarregando ? 'Registrando...' : 'Registrar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}