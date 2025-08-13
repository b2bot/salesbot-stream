import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/plataforma", label: "Plataforma" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/recursos", label: "Recursos" },
  { to: "/integracoes", label: "Integrações" },
  { to: "/planos", label: "Planos" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Página inicial da B2Bot">
          <img
            src="/lovable-uploads/3115098d-c730-4969-a7ab-9e4498284de2.png"
            alt="Logo B2Bot"
            className="h-7 w-auto"
            loading="eager"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">Fale com um especialista</Button>
          <Button variant="hero">Agendar demonstração</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
