import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import axios from 'axios';

// A interface Usuario já existe em /tipos/transacao.ts, mas representa um usuário
// no contexto de uma transação (com cor, etc). Aqui, definimos o usuário autenticado.
// O ideal seria ter um arquivo de tipos de usuário separado, mas por ora vamos manter aqui.
interface UsuarioAutenticado {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
}

interface ContextoAutenticacaoTipo {
    usuario: UsuarioAutenticado | null;
    estaCarregando: boolean;
    login: (email: string, senha: string) => Promise<void>;
    registrar: (nome: string, email: string, senha: string) => Promise<void>;
    loginComGoogle: () => Promise<void>;
    sair: () => void;
    estaAutenticado: boolean;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoTipo | undefined>(undefined);

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verificarSessao = async () => {
            try {
                const response = await api.get('/api/auth/meu-perfil');
                setUsuario(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    // Erro esperado de "não logado", não logar no console.
                } else {
                    console.error('Erro ao verificar sessão:', error);
                }
                setUsuario(null);
            } finally {
                setEstaCarregando(false);
            }
        };

        verificarSessao();
    }, []);

    const login = async (email: string, senha: string) => {
        setEstaCarregando(true);
        try {
            const response = await api.post('/api/auth/login', { email, senha });
            const dadosUsuario = response.data;
            setUsuario(dadosUsuario);
            navigate('/');
        } catch (error) {
            console.error('Falha no login:', error);
            throw error;
        } finally {
            setEstaCarregando(false);
        }
    };

    const registrar = async (nome: string, email: string, senha: string) => {
        setEstaCarregando(true);
        try {
            await api.post('/api/auth/registrar', { nome, email, senha });
            await login(email, senha);
        } catch (error) {
            console.error("Falha no registro:", error);
            throw error;
        } finally {
            setEstaCarregando(false);
        }
    };

    const loginComGoogle = async () => {
        // Lógica de login com Google
    };

    const sair = async () => {
        setEstaCarregando(true);
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Falha ao sair:', error);
        } finally {
            setUsuario(null);
            setEstaCarregando(false);
            navigate('/login'); // TODO: A rota de login também será refatorada
        }
    };

    return (
        <ContextoAutenticacao.Provider
            value={{
                usuario,
                estaCarregando,
                login,
                registrar,
                loginComGoogle,
                sair,
                estaAutenticado: !!usuario,
            }}
        >
            {!estaCarregando && children}
        </ContextoAutenticacao.Provider>
    );
}

export function useAutenticacao() {
    const contexto = useContext(ContextoAutenticacao);
    if (contexto === undefined) {
        throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
    }
    return contexto;
}
