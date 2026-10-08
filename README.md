# ПОРУКА — сайт студии

Next.js (App Router) + TypeScript + CSS Modules. Статический экспорт, хостинг — GitHub Pages.

**Сайт:** https://pequodd.github.io/poruka/

## Страницы
- `/` — главная (единственная версия): первый экран — зацикленное видео с рифлёным стеклом (`public/assets/v7`, вертикальное для телефонов, постер при reduced motion), заголовок собирается по буквам и смешивается с видео «разницей»; дальше по странице путешествуют два сцепленных стеклянных звена (three.js, `src/lib/orbitScene.ts`) — (00) О нас → (01) Услуги на стеклянных карточках → (02) Работы (закреплённый блок с крупными кейсами) → (03) Почему мы (ультрамариновая шторка) → (04) Истории → (05) Процесс (3D-кубики, стеклянная карточка этапа) → (06) Команда → (07) Вопросы (ответы — черновик, сверить со студией) → (08) Контакт — тёмный финальный призыв на затемнённом видео первого экрана с кнопкой «Написать в Telegram», переходящий в футер. Шапка — «жидкое стекло», второй акцент — ультрамарин `--accent-ultra`
- `/portfolio/` — в той же системе: заголовок «РАБОТЫ» собирается по буквам, сквозные стеклянные звенья, липкая стеклянная капсула фильтров, скруглённые карточки со стеклянной плашкой (без скриншота — плитка в цветах клиента), список на стеклянной панели, ультрамариновый призыв, контакт и футер
- `/cases/[slug]/` — кейс в той же системе: заглавный заголовок по буквам, факты на стеклянной панели, скруглённая обложка, (01) Задача → (02) Экраны (скруглённые рамки, подписи «(01/05)») → (03) Решения на стекле → (04) Результат на ультрамарине → следующий проект → (05) Контакт → футер

## Структура
```
app/                      маршруты (layout, page, portfolio, cases/[slug])
styles/tokens/*.css       токены дизайн-системы (цвета, типографика, отступы) — источник истины
styles/globals.css        подключение токенов, шрифты Onest + JetBrains Mono (@fontsource, локально), reduced-motion
src/components/ui/        Button, Chip, SectionMarker, Placeholder, TeamCard
src/components/layout/    HeaderV2 (шапка «жидкое стекло»)
src/components/v7/        секции главной (Hero, Statement, Services, Works, Wipe, Stories, Clients, Team, Faq, Contact, Footer),
                          Orbit (сквозные стеклянные звенья), Look (стеклянный режим + появления), Letters
src/components/sections/  ProcessStage (+Process3D)
src/components/pages/     Portfolio, Case
src/components/case/      BrowserFrame, PhoneFrame, BrowserScroll, ScreenPair, MobileStrip, ScreenDetail, BeforeAfter, NextProject
src/data/projects.ts      данные проектов (PROJECTS) + кейсы: тексты, цифры и список экранов case.screens
src/data/content.ts       услуги, этапы процесса, команда, контакты, меню
src/lib/processScene.ts   three.js-сцена «Процесса» (64 блока, 8 состояний)
src/lib/orbitScene.ts     three.js-сцена сцепленных стеклянных звеньев
public/assets/            изображения проектов и команды; v7/ — видео и постеры первого экрана
```

Данные отделены от вёрстки — их можно перенести в WordPress / 1С-Битрикс.

## Разработка
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # статический экспорт в out/
```

## Деплой
Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт с `BASE_PATH=/<repo>` и публикует `out/` в ветку `gh-pages`.
В настройках репозитория: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`**.

## Что осталось от студии
- Имена и роли команды; тексты и цифры кейсов (сейчас — черновики из прототипа Case v2).
- Скриншоты сайтов клиентов для кейсов (см. «Скриншоты для кейсов»).
- Изображения проектов 6–7 и оригиналы ≥2000px.
- Заявки: формы на сайте нет — финальный призыв ведёт в Telegram (`CONTACTS.telegramUrl` в `src/data/content.ts`), ниже почта и телефон.
- Ссылки на Telegram/Behance/VC.ru в `src/data/content.ts`.

## Скриншоты для кейсов
Экраны кейса задаются в `src/data/projects.ts` → `case.screens`. Пока путь пустой, в рамке показывается плейсхолдер.

| type | что показывает | поля |
|---|---|---|
| `scroll` | длинная страница прокручивается в рамке браузера при скролле | `desktop`, `mobile` |
| `pair` | десктоп + телефон на белой подложке | `desktop`, `mobile` |
| `strip` | лента мобильных экранов | `mobile: []`, `labels: []` |
| `detail` | увеличенный фрагмент ×1.5 + «почему так» | `desktop` (≥2×), `crop {x,y}`, `why` |
| `beforeAfter` | было / стало со шторкой | `before`, `after` |

Правила съёмки:
- ширина **1440** (десктоп) и **390** (мобильный), **полная высота страницы**, PNG;
- без cookie-баннеров, чатов и всплывающих окон, только реальный контент;
- фрагменты для `detail` — с плотностью ≥2×;
- до/после — тот же адрес, та же ширина и высота;
- файлы: `public/assets/cases/<slug>/<NN-nazvanie>-desktop.png` и `-mobile.png`, например `public/assets/cases/smp-zapchast/01-glavnaya-desktop.png`; в данных путь пишется без `public`: `/assets/cases/smp-zapchast/01-glavnaya-desktop.png`.
