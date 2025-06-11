
import { Card, CardContent } from '@/components/ui/card';

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
          <span className="text-primary-foreground font-bold text-lg">N</span>
        </div>
        <h1 className="text-3xl font-bold">NoBolso</h1>
      </div>
      <p className="text-center text-muted-foreground">
        Controle suas finanças de forma simples e intuitiva
      </p>
    </div>
  );
}
