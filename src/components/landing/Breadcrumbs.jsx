import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
        <li><Link to="/" className="transition-colors hover:text-primary">Inicio</Link></li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            {item.href ? <Link to={item.href} className="hover:text-primary">{item.label}</Link> : <span aria-current="page" className="text-foreground">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
