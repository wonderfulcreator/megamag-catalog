import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

function CatalogFallback() {
  return (
    <div className="container py-8 md:py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm text-zinc-600">Загрузка каталога…</div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogClient />
    </Suspense>
  );
}
