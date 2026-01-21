# Подарочные пакеты — статический каталог (GitHub Pages)

Этот репозиторий — витрина каталога с группировкой по **типу / серии / размеру** и фильтрами (**тип, серия, размер, теги + поиск**).

## Что внутри
- `/src/app/catalog` — каталог с фильтрами и карточками групп
- `/src/app/catalog/[slug]` — страница группы (галерея + список артикулов)
- `/src/data/catalog.json` — данные каталога
- `/public/catalog` — изображения товаров (WEBP)

## Локальный запуск

```bash
npm i
npm run dev
```

Откройте: http://localhost:3000

## Сборка (статический экспорт)

```bash
npm run build
```

Статические файлы появятся в папке `out/`.

## Деплой на GitHub Pages (через Actions)

1) Создайте репозиторий на GitHub и залейте туда этот проект (ветка `main`).

2) В репозитории откройте:
**Settings → Pages → Build and deployment → Source: GitHub Actions**

3) (ВАЖНО) Выберите тип Pages:

### Вариант A — project pages
Адрес будет вида `https://<user>.github.io/<repo>/`.

В этом случае задайте переменную репозитория:
**Settings → Secrets and variables → Actions → Variables → New repository variable**
- Name: `NEXT_PUBLIC_BASE_PATH`
- Value: `/<repo>`

Например, если репозиторий называется `megamag-catalog`, значение: `/megamag-catalog`.

### Вариант B — user/organization pages
Адрес будет вида `https://<user>.github.io/` (репозиторий должен называться `<user>.github.io`).

В этом случае переменную `NEXT_PUBLIC_BASE_PATH` НЕ задаём (оставляем пусто).

4) Сделайте push в `main` — workflow сам соберёт и задеплоит сайт.

## Правки каталога
- Данные лежат в `src/data/catalog.json`.
- Можно добавлять точные ссылки на маркетплейсы на уровне SKU (структура в `src/data/types.ts`).

## Ограничение статического хостинга
GitHub Pages отдаёт только статические файлы — без серверной логики.
Поэтому личный кабинет/регистрация/модерация требуют внешнего бэкенда (Supabase/Firebase/отдельный API).

