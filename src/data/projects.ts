/**
 * Project data — kept separate from markup so it can later move to WordPress / 1С-Битрикс.
 * Source: ui_kits/website/Shared.jsx → PROJECTS. Case copy (case.*) is still placeholder
 * text from Case.jsx, adapted per project — replace once the studio supplies real cases.
 */
export type Category = 'Сайты' | 'UI/UX' | 'WordPress' | 'Битрикс' | 'Редизайн' | 'AI';

export interface CaseStat { value: string; suffix?: string; caption: string }

export interface Project {
  slug: string;
  title: string;
  /** Path inside /public, or undefined → flat placeholder slot. */
  image?: string;
  meta: string;
  cat: Category;
  result: string;
  services: string;
  year: string;
  case: {
    client: string;
    duration: string;
    tags: string[];
    heading: [string, string];
    lead: string;
    task: [string, string, string?];
    solution: string;
    steps: [string, string, string][];
    stats: CaseStat[];
    quote: [string, string];
    quoteAuthor: string;
    url?: string;
  };
}

const steps = (dev: string): [string, string, string][] => [
  ['01', 'Исследование', '12 интервью, аудит воронки.'],
  ['02', 'Концепция', 'Структура вокруг задач пользователя.'],
  ['03', 'Дизайн-система', '42 компонента, токены, UI-кит.'],
  ['04', 'Разработка', dev],
];

export const PROJECTS: Project[] = [
  {
    slug: 'smp-zapchast', title: 'СМП Запчасть', image: '/assets/projects/case-1.png',
    meta: '2026 · Сайт · Битрикс', cat: 'Сайты', result: '+38% заявок', services: 'Дизайн, разработка', year: '2026',
    case: {
      client: 'СМП Запчасть', duration: '8 недель', tags: ['Сайт', 'Битрикс'],
      heading: ['Каталог запчастей,', 'который приносит заявки'],
      lead: 'Дизайн и разработка на 1С-Битрикс: новая структура каталога, быстрый подбор и интеграция с CRM.',
      task: ['Старый сайт не продавал.', ' Позиции терялись в меню, заявка шла через звонок, а мобильная версия отсутствовала. ', 'Нужно было удвоить онлайн-заявки.'],
      solution: 'Мы начали с интервью с покупателями и менеджерами, перестроили каталог вокруг задач покупателя и собрали дизайн-систему, чтобы клиент сам добавлял новые позиции.',
      steps: steps('Битрикс, интеграция с amoCRM.'),
      stats: [{ value: '+38', suffix: '%', caption: 'Онлайн-заявок' }, { value: '×2', caption: 'Конверсия в заявку' }, { value: '-40', suffix: '%', caption: 'Отказов' }],
      quote: ['«Впервые подрядчик сам предложил метрики и отвечал за них.', ' Сайт окупился за два месяца.»'], quoteAuthor: 'Имя Фамилия · Директор',
    },
  },
  {
    slug: 'bookspeaker', title: 'Букспискер', image: '/assets/projects/case-2.png',
    meta: '2025 · WordPress', cat: 'WordPress', result: '×2 конверсия', services: 'UI/UX, WooCommerce', year: '2025',
    case: {
      client: 'BookSpeaker', duration: '6 недель', tags: ['UI/UX', 'WordPress'],
      heading: ['Магазин аудиокниг,', 'в котором легко выбрать'],
      lead: 'UI/UX и разработка на WordPress + WooCommerce: новая витрина, понятная карточка и быстрая оплата.',
      task: ['Покупатели уходили из корзины.', ' Каталог был перегружен, а оформление заказа занимало пять шагов. ', 'Нужно было поднять конверсию.'],
      solution: 'Мы провели юзабилити-тесты, сократили оформление до одного экрана и собрали библиотеку блоков, чтобы клиент сам собирал подборки.',
      steps: steps('WordPress, WooCommerce, платёжный шлюз.'),
      stats: [{ value: '×2', caption: 'Конверсия' }, { value: '+46', suffix: '%', caption: 'Средний чек' }, { value: '-35', suffix: '%', caption: 'Брошенных корзин' }],
      quote: ['«Сайт стал понятным даже нашим самым взрослым покупателям.', ' Продажи выросли в первый же месяц.»'], quoteAuthor: 'Имя Фамилия · Основатель',
    },
  },
  {
    slug: 'nice-one', title: 'NICE ONE', image: '/assets/projects/case-3.png',
    meta: '2025 · Редизайн', cat: 'Редизайн', result: '-40% отказов', services: 'Редизайн, SEO', year: '2025',
    case: {
      client: 'NICE ONE', duration: '7 недель', tags: ['Редизайн', 'SEO'],
      heading: ['Редизайн без потери', 'трафика и позиций'],
      lead: 'Обновили визуальный язык и структуру, сохранив SEO-позиции и все данные.',
      task: ['Сайт устарел визуально.', ' Посетители уходили с первого экрана, а любое изменение грозило потерей трафика. ', 'Нужно было обновиться безопасно.'],
      solution: 'Мы провели SEO-аудит, сохранили структуру URL, переработали ключевые экраны и перенесли контент без простоя.',
      steps: steps('Перенос контента, редиректы, контроль индексации.'),
      stats: [{ value: '-40', suffix: '%', caption: 'Отказов' }, { value: '+22', suffix: '%', caption: 'Органический трафик' }, { value: '0', caption: 'Потерянных позиций' }],
      quote: ['«Боялись потерять поисковый трафик — а он вырос.', ' Команда отвечала за каждый шаг.»'], quoteAuthor: 'Имя Фамилия · Маркетолог',
    },
  },
  {
    slug: 'you-net', title: 'You Net', image: '/assets/projects/case-4.png',
    meta: '2024 · UI/UX', cat: 'UI/UX', result: '+25% retention', services: 'Исследование, UI', year: '2024',
    case: {
      client: 'You Net', duration: '10 недель', tags: ['UI/UX', 'Исследование'],
      heading: ['Интерфейс, к которому', 'хочется возвращаться'],
      lead: 'Исследование и UI для сервиса: новые сценарии, онбординг и личный кабинет.',
      task: ['Пользователи не возвращались.', ' Ключевые функции были спрятаны, а онбординг объяснял не то. ', 'Нужно было поднять удержание.'],
      solution: 'Мы провели интервью, построили карту сценариев, переработали онбординг и собрали UI-кит для команды разработки.',
      steps: steps('Спецификации и сопровождение вёрстки.'),
      stats: [{ value: '+25', suffix: '%', caption: 'Retention' }, { value: '×1,6', caption: 'Активация' }, { value: '-30', suffix: '%', caption: 'Обращений в поддержку' }],
      quote: ['«Мы наконец увидели продукт глазами пользователя.', ' Метрики подтвердили это.»'], quoteAuthor: 'Имя Фамилия · Продакт',
    },
  },
  {
    slug: 'okeys', title: 'Okeys', image: '/assets/projects/case-5.png',
    meta: '2024 · Сайт · AI', cat: 'AI', result: 'Запуск за 3 недели', services: 'AI-дизайн, разработка', year: '2024',
    case: {
      client: 'Okeys', duration: '3 недели', tags: ['AI', 'Сайт'],
      heading: ['Сайт за три недели', 'с дизайном и разработкой на AI'],
      lead: 'AI-концепции, генерация контента и разработка — быстрее и дешевле без потери качества.',
      task: ['Запуск был нужен срочно.', ' Классический цикл занял бы три месяца, а бюджет был ограничен. ', 'Нужно было успеть к старту продаж.'],
      solution: 'Мы сгенерировали и отобрали концепции с помощью AI, вручную довели ключевые экраны и собрали сайт на готовой дизайн-системе.',
      steps: steps('Быстрая сборка, наполнение, запуск.'),
      stats: [{ value: '3', caption: 'Недели до запуска' }, { value: '-45', suffix: '%', caption: 'Бюджет' }, { value: '+28', suffix: '%', caption: 'Заявок' }],
      quote: ['«Успели к старту продаж — и без компромиссов по качеству.', ' Будем работать дальше.»'], quoteAuthor: 'Имя Фамилия · Директор',
    },
  },
  {
    slug: 'zastroyshchik', title: 'Застройщик',
    meta: '2024 · Битрикс', cat: 'Битрикс', result: '+52% лидов', services: 'Сайт под ключ', year: '2024',
    case: {
      client: 'Застройщик «Название»', duration: '12 недель', tags: ['Сайт', 'Битрикс'],
      heading: ['Сайт застройщика,', 'который продаёт квартиры'],
      lead: 'Сайт под ключ на 1С-Битрикс: выбор квартиры на генплане, ипотечный калькулятор и интеграция с CRM.',
      task: ['Лиды шли только с рекламы.', ' Выбор квартиры был неудобным, а планировки — в PDF. ', 'Нужно было увеличить заявки с сайта.'],
      solution: 'Мы спроектировали интерактивный подбор квартир, связали его с CRM и собрали дизайн-систему для новых жилых комплексов.',
      steps: steps('Битрикс, интеграция с CRM и фидами.'),
      stats: [{ value: '+52', suffix: '%', caption: 'Лидов' }, { value: '×1,8', caption: 'Время на сайте' }, { value: '-25', suffix: '%', caption: 'Стоимость лида' }],
      quote: ['«Отдел продаж получил заявки, а не звонки с вопросами.', ' Сайт работает на нас.»'], quoteAuthor: 'Имя Фамилия · Коммерческий директор',
    },
  },
  {
    slug: 'logistika', title: 'Логистика',
    meta: '2023 · Сайт', cat: 'Сайты', result: '+30% заявок', services: 'Дизайн, Elementor', year: '2023',
    case: {
      client: 'Логистическая компания', duration: '5 недель', tags: ['Сайт', 'WordPress'],
      heading: ['Сайт логистической', 'компании, понятный за 30 секунд'],
      lead: 'Дизайн и сборка на Elementor: расчёт стоимости, понятные услуги и редактирование без разработчика.',
      task: ['Клиенты не понимали, что им подходит.', ' Услуги были описаны языком перевозчика, а расчёт делался вручную. ', 'Нужно было упростить заявку.'],
      solution: 'Мы переписали услуги языком клиента, добавили калькулятор и обучили команду редактировать сайт самостоятельно.',
      steps: steps('WordPress, Elementor, обучение.'),
      stats: [{ value: '+30', suffix: '%', caption: 'Заявок' }, { value: '-50', suffix: '%', caption: 'Времени на расчёт' }, { value: '100', suffix: '%', caption: 'Правок без разработчика' }],
      quote: ['«Сайт наконец говорит на языке наших клиентов.', ' Правки делаем сами за минуты.»'], quoteAuthor: 'Имя Фамилия · Директор',
    },
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const caseHref = (p: Project) => `/cases/${p.slug}/`;
export const FILTERS = ['Все', 'Сайты', 'UI/UX', 'WordPress', 'Битрикс', 'Редизайн', 'AI'] as const;
