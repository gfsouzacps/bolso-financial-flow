import { Link } from "react-router-dom";

const NaoEncontrado = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Página Não Encontrada</h2>
      <p className="text-muted-foreground mt-2">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/" className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NaoEncontrado;