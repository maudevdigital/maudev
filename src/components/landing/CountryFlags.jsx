import { currencyList } from "@/data/currencies";
import Flag from "@/components/landing/Flag";

export default function CountryFlags() {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-5">
      <ul className="flex -space-x-2" aria-hidden="true">
        {currencyList.map(({ code, country }) => (
          <li
            key={code}
            title={code}
            className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-background transition-transform duration-200 hover:z-10 hover:-translate-y-0.5"
          >
            <Flag country={country} size={32} />
          </li>
        ))}
      </ul>

      <p className="text-sm leading-snug text-muted-foreground">
        <strong className="font-semibold text-foreground">Cotizamos en tu moneda.</strong>{" "}
        Trabajamos a distancia con toda Latinoamérica.
      </p>
    </div>
  );
}
