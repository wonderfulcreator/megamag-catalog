import { catalog } from "@/data/catalog";
import { CatalogClient } from "@/components/CatalogClient";

export default function CatalogPage() {
  return (
    <div className="container py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Каталог
        </h1>
        <p className="mt-2 text-zinc-600">
          Товары сгруппированы по <span className="font-semibold">типу</span>,{" "}
          <span className="font-semibold">серии</span> и{" "}
          <span className="font-semibold">размеру</span>. Внутри карточки —
          варианты дизайнов (артикулы).
        </p>
      </div>

      <CatalogClient groups={catalog.groups} />
    </div>
  );
}
