/** Site copy: services, process steps, team, contacts. Source: Shared.jsx / Home.jsx. */
export interface Service { num: string; title: string; description: string; deliverables: string[]; stack: string[]; tag?: string }

export const SERVICES: Service[] = [
  { num: '01', title: 'Сайты под ключ', description: 'От идеи до запуска.', deliverables: ['Исследование и прототип', 'Дизайн всех страниц и адаптив', 'Разработка, наполнение, запуск'], stack: ['WordPress', 'Битрикс', 'Figma'] },
  { num: '02', title: 'UI/UX‑дизайн', description: 'Интерфейсы, которые понятны с первого экрана.', deliverables: ['Сценарии', 'Прототипы', 'UI-кит'], stack: ['Figma'] },
  { num: '03', title: 'WordPress / Elementor', description: 'Сайты, которые клиент редактирует сам.', deliverables: ['Тема', 'Блоки', 'Обучение'], stack: ['WordPress', 'Elementor'] },
  { num: '04', title: '1С‑Битрикс', description: 'Корпоративные сайты и магазины с интеграциями.', deliverables: ['Шаблон', 'Интеграция 1С'], stack: ['Битрикс', '1С'] },
  { num: '05', title: 'Редизайн', description: 'Обновляем без потери SEO и данных.', deliverables: ['Аудит', 'Новый дизайн', 'Перенос'], stack: ['SEO'] },
  { num: '06', title: 'Поддержка и развитие', description: 'Правки, обновления, новые разделы.', deliverables: ['SLA', 'Ежемесячный отчёт'], stack: ['Поддержка'] },
  { num: '07', title: 'Дизайн и разработка с AI', tag: 'New', description: 'Быстрее и дешевле без потери качества.', deliverables: ['AI-концепции', 'Генерация контента'], stack: ['AI'] },
];

export interface Step { title: string; description: string; duration: string; deliverables: string[] }

export const STEPS: Step[] = ([
  ['Бриф', 'Собираем цели, аудиторию, ограничения и критерии успеха.', '1–2 дня', ['Бриф', 'План работ']],
  ['Исследования', 'Конкурентный анализ, интервью, сценарии пользователей.', '2–5 дней', ['Отчёт', 'Карта конкурентов']],
  ['Визуальный анализ', 'Разбираем визуальный язык рынка и находим свободную нишу.', '1–2 дня', ['Аудит']],
  ['Референсы', 'Собираем мудборд и согласуем направление.', '1 день', ['Мудборд']],
  ['Визуальная концепция', 'Ключевой экран в двух направлениях.', '3–5 дней', ['Концепция']],
  ['Согласование', 'Фиксируем направление, вносим правки.', '1–2 дня', ['Протокол']],
  ['Дизайн всех страниц и адаптив', 'Все шаблоны, состояния и мобильные версии.', '2–4 недели', ['Макеты', 'UI-кит']],
  ['Передача в разработку', 'Спецификации, токены, сопровождение вёрстки.', '1–2 дня', ['Спецификация']],
] as [string, string, string, string[]][]).map(([title, description, duration, deliverables]) => ({ title, description, duration, deliverables }));

/** Names and role mapping are placeholders — confirm with the studio. Focus = face frame in % of the photo. */
export const TEAM = [
  { name: 'Эльдар', role: 'Коммуникация и стратегия', about: 'Ведёт проект и общение с клиентом, отвечает за стратегию.', image: '/assets/team/member-1.jpg', objectPosition: '50% 50%', focus: { x: 30, y: 6, w: 40, h: 38 } },
  { name: 'Дарья', role: 'UX/UI‑дизайнер', about: 'Исследования, прототипы и дизайн интерфейсов.', image: '/assets/team/member-2.jpg', objectPosition: '50% 50%', focus: { x: 28, y: 11, w: 42, h: 38 } },
  { name: 'Кирилл', role: 'UX/UI‑дизайнер', about: 'Исследования, прототипы и дизайн интерфейсов.', image: '/assets/team/member-3.jpg', objectPosition: '50% 35%', focus: { x: 24, y: 28, w: 38, h: 34 } },
];

export const CONTACTS = {
  email: 'hello@poruka.studio',
  telegram: '@poruka',
  telegramUrl: 'https://t.me/poruka',
  phone: '+7 000 000-00-00',
  city: 'Челябинск · работаем удалённо',
  socials: ['Telegram', 'Behance', 'VC.ru'],
  year: '2026',
};

export const NAV: [string, string][] = [
  ['Работы', '/portfolio/'],
  ['Услуги', '/#services'],
  ['Процесс', '/#process'],
  ['Команда', '/#team'],
  ['Вопросы', '/#faq'],
  ['Контакт', '/#contact'],
];

/** Full cycle for /v2/: six steps from brief to support; `PROCESS_SHAPES` picks the 3D form for each. */
export const STEPS_FULL: Step[] = ([
  ['Бриф и оценка', 'Обсуждаем задачи, аудиторию и сроки. Фиксируем объём, цену и план работ.', '1–3 дня', ['Бриф', 'Смета', 'План работ']],
  ['Исследование и прототип', 'Разбираем конкурентов и сценарии, собираем структуру и прототип ключевых страниц.', '1–2 недели', ['Структура', 'Прототип']],
  ['Дизайн', 'Визуальная концепция, затем все страницы, состояния и мобильные версии.', '2–4 недели', ['Макеты', 'UI‑кит']],
  ['Разработка', 'Вёрстка, CMS, интеграции с 1С и CRM, наполнение.', '2–6 недель', ['Сайт на тестовом домене']],
  ['Запуск', 'Проверяем на устройствах, переносим на домен, подключаем аналитику и SEO‑базу.', '2–3 дня', ['Аналитика', 'Перенос SEO']],
  ['Поддержка', 'Правки, обновления и новые разделы по SLA, ежемесячный отчёт.', 'по договору', ['SLA', 'Отчёт']],
] as [string, string, string, string[]][]).map(([title, description, duration, deliverables]) => ({ title, description, duration, deliverables }));
export const PROCESS_SHAPES = [0, 3, 6, 7, 4, 2];

/** Formats and prices. PRICES ARE PLACEHOLDERS («ХХ ХХХ») — replace with the studio's numbers. */
export const PRICING = [
  { title: 'Лендинг', for: 'Запуск продукта, акции, услуги с одним предложением', cta: 'Обсудить лендинг', price: 'от ХХ ХХХ ₽', term: 'от 3 недель', items: ['Прототип и дизайн', 'Адаптив под телефоны', 'WordPress или Next.js', 'Аналитика и формы заявок'] },
  { title: 'Корпоративный сайт', for: 'Компании с каталогом, несколькими услугами и интеграциями', cta: 'Обсудить сайт', price: 'от ХХХ ХХХ ₽', term: '6–12 недель', items: ['Исследование и структура', 'Дизайн всех страниц', '1С‑Битрикс или WordPress', 'Интеграции с 1С и CRM'], accent: true },
  { title: 'Поддержка', for: 'Готовые сайты, которым нужны правки и развитие', cta: 'Обсудить поддержку', price: 'от ХХ ХХХ ₽ / мес', term: 'по договору', items: ['Правки и обновления', 'Новые разделы', 'Резервные копии', 'Ежемесячный отчёт'] },
];

/** What each format includes, for the comparison table: true = входит, false = нет, string = как именно. */
export const PRICING_COMPARE: [string, (boolean | string)[]][] = [
  ['Исследование и структура', [false, true, false]],
  ['Прототип', [true, true, false]],
  ['Дизайн', ['1–3 экрана', 'все страницы', 'новые разделы']],
  ['Адаптив под телефоны', [true, true, true]],
  ['CMS', ['WordPress / Next.js', '1С‑Битрикс / WordPress', 'ваша']],
  ['Интеграции с 1С и CRM', [false, true, 'по запросу']],
  ['Аналитика и цели', [true, true, 'отчёт раз в месяц']],
  ['Правки после запуска', ['2 недели', '1 месяц', 'по SLA']],
];
