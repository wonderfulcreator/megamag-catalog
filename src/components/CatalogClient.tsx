"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import { cn, humanSize } from "@/components/utils";
import type { ProductGroup, ProductType } from "@/data/types";

type Filters = {
  q: string;
  type: ProductType | "Все";
  series: string[];
  size: string[];
  tags: string[];
  sort: "default" | "series" | "size" | "variants";
};

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ru"));
}

function parseArrayParam(sp: URLSearchParams, key: string) {
  const raw = sp.getAll(key);
  const exploded = raw.flatMap((v) =>
    v.split(",").map((x) => x.trim()).filter(Boolean)
  );
  return Array.from(new Set(exploded));
}

function buildSearchParams(filters: Filters) {
  const sp = new URLSearchParams();
  if (filters.q.trim()) sp.set("q", filters.q.trim());
  if (filters.type !== "Все") sp.set("type", filters.type);
  for (const s of filters.series) sp.append("series", s);
  for (const s of filters.size) sp.append("size", s);
  for (const t of filters.tags) sp.append("tag", t);
  if (filters.sort !== "default") sp.set("sort", filters.sort);
  return sp;
}

function readFiltersFromUrl(sp: URLSearchParams): Filters {
  return {
    q: sp.get("q") ?? "",
    type: (sp.get("type") as Filters["type"]) ?? "Все",
    series: parseArrayParam(sp, "series"),
    size: parseArrayParam(sp, "size"),
    tags: parseArrayParam(sp, "tag"),
    sort: (sp.get("sort") as Filters["sort"]) ?? "default",
  };
}

function applyFilters(groups: ProductGroup[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  let out = groups.filter((g) => {
    if (f.type !== "Все" && g.type !== f.type) return false;
    if (f.series.length > 0 && !f.series.includes(g.series)) return false;
    if (f.size.length > 0 && !(g.size && f.size.includes(g.size))) return false;
    if (f.tags.length > 0) {
      const set = new Set(g.tags);
      for (const t of f.tags) if (!set.has(t)) return false;
    }
    if (q) {
      const blob = [
        g.series,
        g.size ?? "",
        g.title,
        ...g.tags,
        ...g.variants.map((v) => v.sku),
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  if (f.sort === "series") out = out.sort((a, b) => a.series.localeCompare(b.series, "ru"));
  else if (f.sort === "size") out = out.sort((a, b) => (a.size ?? "").localeCompare(b.size ?? "", "ru"));
  else if (f.sort === "variants") out = out.sort((a, b) => b.variantCount - a.variantCount);

  return out;
}

function facetCounts(
  all: ProductGroup[],
  current: Filters,
  facet: "type" | "series" | "size" | "tags"
) {
  const base: Filters = { ...current };
  if (facet === "type") base.type = "Все";
  if (facet === "series") base.series = [];
  if (facet === "size") base.size = [];
  if (facet === "tags") base.tags = [];

  const filtered = applyFilters(all, base);
  const counts = new Map<string, number>();

  for (const g of filtered) {
    if (facet === "type") counts.set(g.type, (counts.get(g.type) ?? 0) + 1);
    if (facet === "series") counts.set(g.series, (counts.get(g.series) ?? 0) + 1);
    if (facet === "size" && g.size) counts.set(g.size, (counts.get(g.size) ?? 0) + 1);
    if (facet === "tags") for (const t of g.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  return counts;
}

function CheckboxRow({
  label,
  checked,
  count,
  onToggle,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left text-sm",
        "hover:bg-zinc-100 active:bg-zinc-200"
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "h-4 w-4 rounded border",
            checked ? "border-zinc-900 bg-zinc-900" : "border-zinc-300 bg-white"
          )}
        />
        <span className="truncate">{label}</span>
      </span>
      {typeof count === "number" && (
        <span className="shrink-0 text-xs text-zinc-500">{count}</span>
      )}
    </button>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-200 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3"
      >
        <div className="text-sm font-semibold">{title}</div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-500 transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
}

function ProductCard({ group }: { group: ProductGroup }) {
  return (
    <Link
      href={`/catalog/${group.id}`}
      className={cn(
        "group rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition",
        "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
      )}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-50">
        {group.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/catalog/${group.coverImage}`}
            alt={group.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            Нет фото
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{group.series}</div>
            <div className="text-xs text-zinc-500">{humanSize(group.size)}</div>
          </div>
          <div className="rounded-xl bg-zinc-100 px-2 py-1 text-xs font-semibold">
            {group.variantCount} дизайнов
          </div>
        </div>

        <div className="text-xs text-zinc-600">{group.type}</div>

        {group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-xl bg-zinc-100 px-2 py-1 text-[11px] text-zinc-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function CatalogClient({ groups }: { groups: ProductGroup[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() =>
    readFiltersFromUrl(new URLSearchParams(searchParams.toString()))
  );
  const [visible, setVisible] = useState(24);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setFilters(readFiltersFromUrl(new URLSearchParams(searchParams.toString())));
    setVisible(24);
  }, [searchParams]);

  function update(partial: Partial<Filters>) {
    const next: Filters = { ...filters, ...partial };
    setFilters(next);
    const sp = buildSearchParams(next);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const types: Array<Filters["type"]> = useMemo(() => {
    // фиксируем список типов, даже если какой-то временно пустой
    const base: Array<Filters["type"]> = [
      "Все",
      "Бумажные подарочные",
      "Премиум / LUX",
      "Крафт",
      "Под бутылку",
      "Однотонные",
    ];
    // на случай появления новых типов в данных — добавляем их в конец
    const dynamic = uniqueSorted(groups.map((g) => g.type)).filter(
      (t) => !base.includes(t as Filters["type"])
    ) as ProductType[];
    return [...base, ...dynamic];
  }, [groups]);

  const seriesOptions = useMemo(
    () => uniqueSorted(groups.map((g) => g.series)),
    [groups]
  );
  const sizeOptions = useMemo(
    () => uniqueSorted(groups.map((g) => g.size ?? "").filter(Boolean)),
    [groups]
  );
  const tagOptions = useMemo(
    () => uniqueSorted(groups.flatMap((g) => g.tags)),
    [groups]
  );

  const filtered = useMemo(() => applyFilters(groups, filters), [groups, filters]);

  const typeCounts = useMemo(() => facetCounts(groups, filters, "type"), [groups, filters]);
  const seriesCounts = useMemo(() => facetCounts(groups, filters, "series"), [groups, filters]);
  const sizeCounts = useMemo(() => facetCounts(groups, filters, "size"), [groups, filters]);
  const tagCounts = useMemo(() => facetCounts(groups, filters, "tags"), [groups, filters]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function toggleInList(key: "series" | "size" | "tags", value: string) {
    const list = new Set(filters[key]);
    if (list.has(value)) list.delete(value);
    else list.add(value);
    update({ [key]: Array.from(list) } as Partial<Filters>);
  }

  function resetAll() {
    update({ q: "", type: "Все", series: [], size: [], tags: [], sort: "default" });
  }

  const Sidebar = (
    <div className="space-y-3">
      <div className="rounded-3xl border border-zinc-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4" />
          Фильтры
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Поиск по серии / артикулу / тегам…"
            className="w-full bg-transparent text-sm outline-none"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              className="rounded-xl p-1 hover:bg-zinc-100"
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            <option value="default">Сортировка</option>
            <option value="series">по серии</option>
            <option value="size">по размеру</option>
            <option value="variants">по кол-ву дизайнов</option>
          </select>

          <button
            type="button"
            onClick={resetAll}
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          Найдено: <span className="font-semibold text-zinc-800">{filtered.length}</span>
        </div>

        <Section title="Тип">
          {types.map((t) => (
            <CheckboxRow
              key={t}
              label={t}
              checked={filters.type === t}
              count={t === "Все" ? filtered.length : typeCounts.get(t) ?? 0}
              onToggle={() => update({ type: t })}
            />
          ))}
        </Section>

        <Section title="Серия">
          {seriesOptions.map((s) => (
            <CheckboxRow
              key={s}
              label={s}
              checked={filters.series.includes(s)}
              count={seriesCounts.get(s) ?? 0}
              onToggle={() => toggleInList("series", s)}
            />
          ))}
        </Section>

        <Section title="Размер">
          {sizeOptions.map((s) => (
            <CheckboxRow
              key={s}
              label={humanSize(s)}
              checked={filters.size.includes(s)}
              count={sizeCounts.get(s) ?? 0}
              onToggle={() => toggleInList("size", s)}
            />
          ))}
        </Section>

        <Section title="Теги" defaultOpen={false}>
          {tagOptions.map((t) => (
            <CheckboxRow
              key={t}
              label={t}
              checked={filters.tags.includes(t)}
              count={tagCounts.get(t) ?? 0}
              onToggle={() => toggleInList("tags", t)}
            />
          ))}
        </Section>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-auto">
        {Sidebar}
      </aside>

      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-zinc-200 p-3">
          <div className="text-sm">
            Найдено: <span className="font-semibold">{filtered.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <Filter className="h-4 w-4" />
            Фильтры
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[92%] max-w-md overflow-auto bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-base font-semibold">Фильтры</div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl p-2 hover:bg-zinc-100"
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Sidebar}
              <div className="sticky bottom-0 mt-4 bg-white pt-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Показать товары
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((g) => (
            <ProductCard key={g.id} group={g} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-zinc-200 p-6 text-sm text-zinc-600">
            Ничего не найдено. Попробуйте убрать часть фильтров.
          </div>
        )}

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 24)}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-zinc-50"
            >
              Показать ещё
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
