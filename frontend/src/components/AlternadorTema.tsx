import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme.ts';

export function AlternadorTema() {
  const { tema, alternarTema } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={alternarTema}
      className="h-9 w-9"
    >
      {tema === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}