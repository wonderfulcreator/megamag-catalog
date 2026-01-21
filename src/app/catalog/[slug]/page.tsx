import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/data/catalog";
import { humanSize } from "@/components/utils";
import type { ProductGroup } from "@/data/types";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Для static export важно, чтобы динамические параметры были полностью известны заранее
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.groups.map((g) => ({ slug: g.id }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

function marketplaceSearchUrl(
  market: "ozon" | "wildberries" | "ymarket",
  q: string
) {
  const enc = encodeURIComponent(q);
  if (market === "ozon") return `https://www.ozon.ru/search/?text=${enc}`;
  if (market === "wildberries")
    return `https://www.wildberries.ru/catalog/0/search.aspx?search=${enc}`;
  return `https://market.yandex.ru/search?text=${enc}`;
}

export default async function ProductGroupPage({ params }: PageProps) {
  const { slug } = await params;

  const group = catalog.groups.find((g) => g.id === slug) as
    | ProductGroup
    | undefined;

  if (!group) return notFound();

  const query = `${group.series} ${group.size ?? ""}`.trim();

  return (
    <div className="container py-8 md:py-10">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад в каталог
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
            {group.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/catalog/${group.coverImage}`}
                alt={group.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                Нет фото
              </div>
            )}
          </div>

          {(group.images?.length ?? 0) > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {group.images.slice(0, 8).map((img) => (
                <div
                  key={img}
                  className="aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/catalog/${img}`}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {group.series}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span className="rounded-xl bg-zinc-100 px-3 py-1">
                {group.type}
              </span>

              {group.size && (
                <span className="rounded-xl bg-zinc-100 px-3 py-1">
                  {humanSize(group.size)}
                </span>
              )}

              <span className="rounded-xl bg-zinc-100 px-3 py-1">
                {group.variantCount} дизайнов
              </span>
            </div>

            {(group.tags?.length ?? 0) > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {group.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 p-5">
            <div className="text-sm font-semibold">Артикулы (варианты дизайна)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.variants.map((v) => (
                <span
                  key={v.sku}
                  className="rounded-xl bg-zinc-100 px-3 py-1 text-sm"
                >
                  {v.sku}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 p-5">
            <div className="text-sm font-semibold">Розница</div>
            <div className="mt-2 text-sm text-zinc-600">
              Кнопки ведут на поиск по серии/размеру. Если позже дадите точные ссылки
              на маркетплейсах — их можно добавить на уровне SKU в данных.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                href={marketplaceSearchUrl("ozon", query)}
                target="_blank"
                rel="noreferrer"
              >
                Ozon <ExternalLink className="h-4 w-4" />
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
                href={marketplaceSearchUrl("wildberries", query)}
                target="_blank"
                rel="noreferrer"
              >
                Wildberries <ExternalLink className="h-4 w-4" />
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
                href={marketplaceSearchUrl("ymarket", query)}
                target="_blank"
                rel="noreferrer"
              >
                Я.Маркет <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="text-sm text-zinc-500">
            Для опта и личного кабинета (как в примере) потребуется внешний бэкенд.
          </div>
        </div>
      </div>
    </div>
  );
}
