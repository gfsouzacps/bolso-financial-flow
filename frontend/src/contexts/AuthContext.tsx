import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

interface User {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    register: (nome: string, email: string, senha: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Começa como true para verificar a sessão
    const navigate = useNavigate();

    // useEffect para verificar a sessão na inicialização do app
    useEffect(() => {
        const verificarSessao = async () => {
            try {
                // O cookie é enviado automaticamente pelo navegador
                const response = await api.get('/api/auth/meu-perfil');
                setUser(response.data);
            } catch (error) {
                // Se a chamada falhar (ex: 401), significa que não há sessão válida.
                setUser(null);
            } finally {
                // Terminamos de verificar, a aplicação pode ser exibida.
                setIsLoading(false);
            }
        };

        verificarSessao();
    }, []); // O array vazio [] garante que isso só rode uma vez

    const login = async (email: string, senha: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', { email, senha });

            // A resposta da API é o próprio usuário. Colocamos no estado.
            const userData = response.data;
            setUser(userData);

            // NADA é salvo no localStorage.

            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (nome: string, email: string, senha: string) => {
        setIsLoading(true);
        try {
            await api.post('/api/auth/registrar', { nome, email, senha });
            await login(email, senha);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        // ... (sua lógica de login com Google aqui, que também não deve usar localStorage)
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Limpamos apenas o estado em memória.
            setUser(null);
            setIsLoading(false);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                loginWithGoogle,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {/* Não renderiza os filhos enquanto estiver verificando a sessão */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}