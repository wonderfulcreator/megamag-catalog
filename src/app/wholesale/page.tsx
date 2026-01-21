import { Mail, ShieldCheck } from "lucide-react";

export default function WholesalePage() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Оптовым клиентам
        </h1>
        <p className="text-zinc-600">
          Этот сайт развёрнут как статический (GitHub Pages). Для полноценного
          личного кабинета (регистрация, модерация, цены, заказы) потребуется
          внешний бэкенд (например Supabase/Firebase или отдельный API на Vercel/Render).
        </p>

        <div className="rounded-3xl border border-zinc-200 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-zinc-900 p-2 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">Запросить оптовые условия</div>
              <div className="text-sm text-zinc-600">
                Напишите нам, и мы пришлём прайс и условия.
              </div>
              <a
                className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                href="mailto:hello@example.com?subject=Опт%20—%20запрос%20условий"
              >
                <Mail className="h-4 w-4" />
                Написать на email
              </a>
              <div className="pt-2 text-xs text-zinc-500">
                email можно поменять в файле <code>src/app/wholesale/page.tsx</code>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-500">
          Если вы решите делать кабинет — я могу встроить его поверх этого проекта.
        </div>
      </div>
    </div>
  );
}
