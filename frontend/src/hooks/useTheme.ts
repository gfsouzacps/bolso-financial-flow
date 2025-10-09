import { useState, useEffect } from 'react';

export function useTheme() {
  const [tema, setTema] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Verificar preferência salva no localStorage
    const temaSalvo = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (temaSalvo) {
      setTema(temaSalvo);
      document.documentElement.classList.toggle('dark', temaSalvo === 'dark');
    } else {
      // Verificar preferência do sistema
      const prefereModoEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTema(prefereModoEscuro ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefereModoEscuro);
    }
  }, []);

  const alternarTema = () => {
    const novoTema = tema === 'light' ? 'dark' : 'light';
    setTema(novoTema);
    localStorage.setItem('theme', novoTema);
    document.documentElement.classList.toggle('dark', novoTema === 'dark');
  };

  return {
    tema,
    alternarTema
  };
}