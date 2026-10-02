# ПОРУКА — сайт студии

Next.js (App Router) + TypeScript + CSS Modules. Статический экспорт, хостинг — GitHub Pages.

**Сайт:** https://pequodd.github.io/poruka/

## Страницы
- `/` — Главная v2: Hero (гильош на canvas) → О нас → Работы (вариант B) → Marquee → Услуги → Процесс (sticky + three.js) → Команда → Контакт → Footer
- `/portfolio/` — сетка/список с фильтрами
- `/cases/[slug]/` — шаблон кейса, страница на каждый проект

## Структура
```
app/                      маршруты (layout, page, portfolio, cases/[slug])
styles/tokens/*.css       токены дизайн-системы (цвета, типографика, отступы) — источник истины
styles/globals.css        подключение токенов, шрифты Onest + JetBrains Mono (next/font), reduced-motion
src/components/ui/        Button, IconButton, Chip, SectionMarker, Stat, Marquee, Placeholder,
                          ServiceRow, TeamCard, ProjectCard, TextField, ChipGroup, ContactForm, Wordmark
src/components/layout/    HeaderV2, Footer
src/components/sections/  Hero (+Guilloche), About, Works (+WorksTable), Services, Process (+Process3D), Team, Contact
src/components/pages/     Portfolio, Case
src/data/projects.ts      данные проектов (PROJECTS) + тексты кейсов
src/data/content.ts       услуги, этапы процесса, команда, контакты, меню
src/lib/processScene.ts   three.js-сцена «Процесса» (64 блока, 8 состояний)
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
- Имена и роли команды, реальные тексты кейсов (сейчас — плейсхолдеры по Case.jsx).
- Изображения проектов 6–7 и оригиналы ≥2000px.
- Отправка формы: `ContactForm` принимает `onSubmit` — подключить к CRM / Telegram-боту / CMS.
- Ссылки на Telegram/Behance/VC.ru в `src/data/content.ts`.
