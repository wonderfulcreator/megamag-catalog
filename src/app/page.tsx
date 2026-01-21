import Link from "next/link";
import { ArrowRight, Filter, PackageSearch } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Каталог подарочных пакетов
          </h1>
          <p className="text-zinc-600">
            Современная витрина с группировкой по сериям/размерам и удобными
            фильтрами (тип, серия, размер, теги + поиск).
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Перейти в каталог <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-semibold hover:bg-zinc-50"
            >
              Оптовым клиентам <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 pt-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4" /> Фильтры
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Тип • Серия • Размер • Теги
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <PackageSearch className="h-4 w-4" /> Группы
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Варианты дизайнов внутри карточки
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-semibold">GitHub Pages</div>
              <div className="mt-1 text-sm text-zinc-600">
                Статический экспорт и деплой через Actions
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Быстрый старт
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">
{`npm i
npm run dev

# сборка (статический экспорт в /out)
npm run build`}
            </pre>
            <p className="text-sm text-zinc-600">
              Деплой на GitHub Pages включается одной настройкой в репозитории —
              см. README.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
