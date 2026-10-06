# ПОРУКА — сайт студии

Next.js (App Router) + TypeScript + CSS Modules. Статический экспорт, хостинг — GitHub Pages.

**Сайт:** https://pequodd.github.io/poruka/

## Страницы
- `/` — Главная v3: центрированный первый экран (гильош за «стеклянными» колонками) → О нас → Работы (вариант B) → Marquee → Услуги → Процесс (sticky + three.js) → Команда → Контакт → Footer
- `/v4/` — вариант главной «бенто студии»: видимая сетка ячеек, ячейка под курсором расширяется, два 3D-объекта (блоки «Процесса» сами перестраиваются по этапам; печать-диск «ставит печать» при наведении); «Процесс» в духе Apple (фраза-вступление, этапы крупным текстом, приглушённое 3D); скрыт от поиска
- `/v5/` — вариант главной в духе Apple: заголовок по центру, последняя работа в рамке браузера вырастает на весь экран при прокрутке; «Процесс» в духе Apple; скрыт от поиска
- `/v2/` — прежний первый экран (текст слева, гильош справа сверху), оставлен для сравнения, скрыт от поиска
- `/portfolio/` — сетка/список с фильтрами
- `/cases/[slug]/` — кейс v2 (на скриншотах): первый экран с мета-рядом → обложка → задача → 5 экранных блоков → решения → результат → следующий проект → контакт

## Структура
```
app/                      маршруты (layout, page, portfolio, cases/[slug])
styles/tokens/*.css       токены дизайн-системы (цвета, типографика, отступы) — источник истины
styles/globals.css        подключение токенов, шрифты Onest + JetBrains Mono (@fontsource, локально), reduced-motion
src/components/ui/        Button, IconButton, Chip, SectionMarker, Stat, Marquee, Placeholder,
                          ServiceRow, TeamCard, ProjectCard, TextField, ChipGroup, ContactForm, Wordmark
src/components/layout/    HeaderV2, Footer
src/components/sections/  Hero (+Guilloche), About, Works (+WorksTable), Services, Process (+Process3D), Team, Contact
src/components/pages/     Portfolio, Case
src/components/case/      BrowserFrame, PhoneFrame, BrowserScroll, ScreenPair, MobileStrip, ScreenDetail, BeforeAfter, NextProject
src/data/projects.ts      данные проектов (PROJECTS) + кейсы: тексты, цифры и список экранов case.screens
src/data/content.ts       услуги, этапы процесса, команда, контакты, меню
src/lib/processScene.ts   three.js-сцена «Процесса» (64 блока, 8 состояний)
src/lib/sealScene.ts      three.js-печать «ПОРУКА · РУЧАЕМСЯ ЗА РЕЗУЛЬТАТ» (для /v4/)
public/assets/            изображения проектов и команды
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
- Отправка формы: `ContactForm` принимает `onSubmit` — подключить к CRM / Telegram-боту / CMS.
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
