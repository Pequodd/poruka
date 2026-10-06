/**
 * Project data — kept separate from markup so it can later move to WordPress / 1С-Битрикс.
 * Source: ui_kits/website/Shared.jsx → PROJECTS + CASES (Case v2).
 * Screenshot paths are empty until real shots exist → frames show placeholders.
 * Naming: /assets/cases/<slug>/<NN-nazvanie>-desktop.png and -mobile.png (see README).
 */
export type Category = 'Сайты' | 'UI/UX' | 'WordPress' | 'Битрикс' | 'Редизайн' | 'AI';

export interface CaseStat { value: string; suffix?: string; caption: string }

export interface Screen {
  type: 'scroll' | 'pair' | 'strip' | 'detail' | 'beforeAfter';
  /** «Главная» → caption «01 — Главная» */
  label: string;
  /** One phrase, right side of the caption */
  note?: string;
  /** scroll / pair / detail */
  desktop?: string;
  /** scroll & pair: string; strip: string[] */
  mobile?: string | string[];
  /** strip: caption per phone */
  labels?: string[];
  before?: string;
  after?: string;
  /** detail: offset in % of the image */
  crop?: { x: number; y: number };
  /** detail: 2–3 lines «почему так» */
  why?: string;
}

export interface CaseStudy {
  oneLiner: string;
  client: string;
  duration: string;
  stack: string[];
  tags: string[];
  url: string;
  task: [string, string];
  screens: Screen[];
  colors: string[];
  font: string;
  decision: string;
  stats: CaseStat[];
  quote: [string, string];
  author: string;
}

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
  case: CaseStudy;
}

const BASE: Omit<Project, 'case'>[] = [
  { slug: 'smp-zapchast', title: 'СМП Запчасть', image: '/assets/projects/case-1.png', meta: '2026 · Сайт · Битрикс', cat: 'Сайты', result: '+38% заявок', services: 'Дизайн, разработка', year: '2026' },
  { slug: 'bookspeaker', title: 'Букспискер', image: '/assets/projects/case-2.png', meta: '2025 · WordPress', cat: 'WordPress', result: '×2 конверсия', services: 'UI/UX, WooCommerce', year: '2025' },
  { slug: 'nice-one', title: 'NICE ONE', image: '/assets/projects/case-3.png', meta: '2025 · Редизайн', cat: 'Редизайн', result: '-40% отказов', services: 'Редизайн, SEO', year: '2025' },
  { slug: 'you-net', title: 'You Net', image: '/assets/projects/case-4.png', meta: '2024 · UI/UX', cat: 'UI/UX', result: '+25% retention', services: 'Исследование, UI', year: '2024' },
  { slug: 'okeys', title: 'Okeys', image: '/assets/projects/case-5.png', meta: '2024 · Сайт · AI', cat: 'AI', result: 'Запуск за 3 недели', services: 'AI-дизайн, разработка', year: '2024' },
  { slug: 'zastroyshchik', title: 'Застройщик', meta: '2024 · Битрикс', cat: 'Битрикс', result: '+52% лидов', services: 'Сайт под ключ', year: '2024' },
  { slug: 'logistika', title: 'Логистика', meta: '2023 · Сайт', cat: 'Сайты', result: '+30% заявок', services: 'Дизайн, Elementor', year: '2023' },
];

// Case v2 copy, one object per project (ported as-is from the prototype).
// prettier-ignore
const CASES: Record<string, CaseStudy> = {
  'smp-zapchast':{oneLiner:'Каталог запчастей для спецтехники с подбором по модели',client:'СМП Запчасть',duration:'10 недель',stack:['1С-Битрикс','1С'],tags:['UI/UX','Битрикс'],url:'smp-zapchast.ru',
   task:['Клиенты звонили, чтобы узнать, подойдёт ли деталь.',' Мы сделали подбор по технике и каталог, где ответ виден до звонка.'],
   screens:[{type:'scroll',label:'Главная',note:'Оффер и подбор запчасти в один клик'},{type:'pair',label:'Каталог',note:'Фильтры по технике, бренду и наличию'},
    {type:'detail',label:'Карточка товара',note:'Совместимость и срок поставки на первом экране',why:'Главный вопрос покупателя — подойдёт ли деталь. Поэтому совместимость стоит выше цены, а срок поставки — рядом с кнопкой.',crop:{x:20,y:12}},
    {type:'strip',label:'Мобильная версия',note:'Заявка с объекта, с телефона',labels:['Главная','Каталог','Карточка','Корзина','Заявка']},{type:'scroll',label:'Подбор по технике',note:'Марка → модель → узел → деталь'}],
   colors:['#1D1D1B','#F2C200','#E9E9E4','#5A5A57'],font:'Manrope',decision:'Жёлтый взяли с техники клиента и оставили только для действий: кнопки, наличие, выбранный фильтр.',
   stats:[{value:'+38',suffix:'%',caption:'Заявок с сайта'},{value:'×2',caption:'Конверсия в заказ'},{value:'−40',suffix:'%',caption:'Отказов'}],quote:['«Менеджеры перестали отвечать на вопрос „подойдёт ли“.',' Теперь звонят уже с номером детали.»'],author:'Руководитель отдела продаж · СМП Запчасть'},
  'bookspeaker':{oneLiner:'Каталог спикеров с подбором под формат и бюджет события',client:'Букспискер',duration:'8 недель',stack:['WordPress','WooCommerce'],tags:['UI/UX','WordPress'],url:'bookspeaker.ru',
   task:['Организаторы выбирали спикера неделями в переписке.',' Мы собрали каталог, где тема, формат и гонорар видны сразу.'],
   screens:[{type:'pair',label:'Каталог спикеров',note:'Тема, формат и гонорар в карточке'},{type:'strip',label:'Мобильная версия',note:'Заявка на спикера за 4 шага',labels:['Главная','Каталог','Спикер','Заявка']},
    {type:'detail',label:'Фильтр',note:'Пять параметров вместо двадцати',why:'Оставили фильтры, которыми организаторы пользовались в интервью: тема, формат, город, бюджет, дата.',crop:{x:0,y:8}},
    {type:'scroll',label:'Главная',note:'Поиск спикера по теме с первого экрана'},
    {type:'detail',label:'Карточка спикера',note:'Темы, видео и гонорар без звонка',why:'Организатору нужно три ответа: о чём говорит, как выступает, сколько стоит. Все три — на первом экране карточки.',crop:{x:20,y:15}}],
   colors:['#1E2A4A','#FF8A3D','#F4EFE6','#2B2B2B'],font:'Unbounded',decision:'Тёмно-синий — фон для фотографий спикеров, оранжевый — только для заявки.',
   stats:[{value:'×2',caption:'Конверсия в заявку'},{value:'+45',suffix:'%',caption:'Просмотров карточек'},{value:'3',suffix:' мин',caption:'До первой заявки'}],quote:['«Организаторы приходят с выбранным спикером.',' Переписка сократилась с недели до одного звонка.»'],author:'Основатель · Букспискер'},
  'nice-one':{oneLiner:'Редизайн магазина одежды без потери позиций в поиске',client:'NICE ONE',duration:'6 недель',stack:['WordPress','WooCommerce'],tags:['Редизайн','SEO'],url:'niceone.ru',
   task:['Старый сайт выглядел как шаблон и терял мобильный трафик.',' Мы обновили визуальный язык и сохранили структуру URL.'],
   screens:[{type:'beforeAfter',label:'Главная',note:'Тот же оффер, вдвое меньше шума'},{type:'scroll',label:'Каталог',note:'Фото, цена и размеры без наведения'},{type:'pair',label:'Карточка товара',note:'Таблица размеров рядом с кнопкой'},
    {type:'detail',label:'Подбор размера',note:'Размер по росту и весу, без таблицы',why:'Возвраты шли из-за размера. Теперь покупатель вводит рост и вес, а таблица открывается по запросу.',crop:{x:40,y:20}},
    {type:'strip',label:'Мобильная версия',note:'70% заказов приходят с телефона',labels:['Главная','Каталог','Товар','Корзина','Оформление']}],
   colors:['#111111','#E6FF4F','#F5F5F0','#8C8C88'],font:'Inter Tight',decision:'Убрали шесть цветов старого сайта, оставили чёрный и один лаймовый для акций.',
   stats:[{value:'−40',suffix:'%',caption:'Отказов'},{value:'+27',suffix:'%',caption:'Мобильных заказов'},{value:'0',caption:'Потерянных позиций в поиске'}],quote:['«Боялись просесть в поиске после переезда.',' Не потеряли ни одной позиции.»'],author:'Владелец · NICE ONE'},
  'you-net':{oneLiner:'Интерфейс сервиса для подключения домашнего интернета',client:'You Net',duration:'12 недель',stack:['Figma','React'],tags:['UI/UX','Исследование'],url:'younet.ru',
   task:['Пользователи бросали подключение на третьем шаге.',' Мы пересобрали онбординг и кабинет: одно действие на экран.'],
   screens:[{type:'pair',label:'Онбординг',note:'Один вопрос на экран, прогресс всегда виден'},{type:'strip',label:'Личный кабинет',note:'Баланс, тариф и поддержка в два касания',labels:['Баланс','Тариф','Оплата','Поддержка','Профиль']},
    {type:'detail',label:'Выбор тарифа',note:'Сравнение без таблицы',why:'Вместо таблицы на 12 строк — три карточки с разницей в одну строку. Остальное раскрывается по запросу.',crop:{x:10,y:20}},
    {type:'scroll',label:'Сайт сервиса',note:'Тарифы и проверка адреса до регистрации'},
    {type:'detail',label:'Проверка адреса',note:'Ответ «можно подключить» за 2 секунды',why:'Раньше адрес проверяли после регистрации. Мы перенесли проверку на первый экран: человек узнаёт ответ до того, как оставит данные.',crop:{x:5,y:35}}],
   colors:['#3B2BFF','#00D1A0','#F2F3F7','#14141A'],font:'Golos',decision:'Фиолетовый — бренд, зелёный — только статус «подключено». Других акцентов в интерфейсе нет.',
   stats:[{value:'+25',suffix:'%',caption:'Retention за 3 месяца'},{value:'−35',suffix:'%',caption:'Обращений в поддержку'},{value:'4',caption:'Шага вместо 9'}],quote:['«Подключение перестало быть квестом.',' Поддержка теперь отвечает на вопросы про скорость, а не про кнопки.»'],author:'Продакт-менеджер · You Net'},
  'okeys':{oneLiner:'Сайт для запуска продукта, собранный за 3 недели с AI',client:'Okeys',duration:'3 недели',stack:['Next.js','AI'],tags:['AI','Сайт'],url:'okeys.ru',
   task:['Сайт нужен был к запуску через месяц.',' Концепции и черновой контент мы сгенерировали с AI, а время потратили на детали.'],
   screens:[{type:'scroll',label:'Главная',note:'Продукт и цена на первом экране'},{type:'pair',label:'Тарифы',note:'Три тарифа, разница в одной строке'},
    {type:'detail',label:'Форма заявки',note:'Три поля и срок ответа у кнопки',why:'Убрали всё, что можно уточнить в разговоре: остались имя, телефон и тариф. Срок ответа — 1 час — написан рядом с кнопкой.',crop:{x:25,y:30}},
    {type:'strip',label:'Мобильная версия',note:'Весь путь до заявки с телефона',labels:['Главная','Продукт','Тарифы','Заявка','Контакты']},{type:'scroll',label:'Страница продукта',note:'Как работает продукт, за 6 экранов'}],
   colors:['#FF5A1F','#0F0F0F','#FFF4EC','#6B6B6B'],font:'Onest',decision:'Оранжевый из упаковки продукта — единственный цвет на сайте, всё остальное чёрно-белое.',
   stats:[{value:'3',suffix:' нед.',caption:'От брифа до запуска'},{value:'−30',suffix:'%',caption:'Бюджета против обычного процесса'},{value:'+18',suffix:'%',caption:'Конверсия в заявку'}],quote:['«Успели к запуску и не пожертвовали качеством.',' Сайт выглядит так, будто его делали три месяца.»'],author:'Сооснователь · Okeys'},
  'zastroyshchik':{oneLiner:'Сайт жилого комплекса с подбором квартиры по планировке',client:'Застройщик (NDA)',duration:'9 недель',stack:['1С-Битрикс','amoCRM'],tags:['Битрикс','Сайт'],url:'example-dev.ru',
   task:['Покупатели не находили нужную планировку и уходили на агрегаторы.',' Мы сделали подбор по этажу, площади и виду из окна.'],
   screens:[{type:'scroll',label:'Выбор квартиры',note:'Этаж, площадь и цена в одном фильтре'},{type:'pair',label:'Карточка квартиры',note:'Планировка, вид из окна и ипотека'},
    {type:'detail',label:'Генплан',note:'Корпуса и свободные квартиры на одной схеме',why:'Покупатель сначала выбирает дом, потом квартиру. Генплан показывает свободные квартиры прямо на корпусах.',crop:{x:15,y:10}},
    {type:'strip',label:'Мобильная версия',note:'Подбор квартиры с телефона',labels:['Главная','Подбор','Квартира','Ипотека']},{type:'scroll',label:'Ход строительства',note:'Фото и сроки по каждому корпусу'}],
   colors:['#2F3B2C','#C9A46A','#F1EEE7','#1A1A1A'],font:'Raleway',decision:'Палитру взяли с фасада: тёмно-зелёный, латунь и светлый камень.',
   stats:[{value:'+52',suffix:'%',caption:'Лидов'},{value:'−20',suffix:'%',caption:'Стоимость заявки'},{value:'2',suffix:' мин',caption:'До выбора квартиры'}],quote:['«Отдел продаж получает заявки с выбранной квартирой.',' Первый звонок стал короче вдвое.»'],author:'Директор по маркетингу · Застройщик'},
  'logistika':{oneLiner:'Сайт транспортной компании с расчётом стоимости доставки',client:'Логистика (NDA)',duration:'5 недель',stack:['WordPress','Elementor'],tags:['Сайт','Elementor'],url:'example-logistics.ru',
   task:['Стоимость доставки клиенты узнавали только по телефону.',' Мы вынесли калькулятор на главную и связали его с заявкой.'],
   screens:[{type:'scroll',label:'Главная',note:'Калькулятор и сроки на первом экране'},{type:'pair',label:'Услуги',note:'Направления и сроки в одной таблице'},
    {type:'detail',label:'Калькулятор',note:'Стоимость до заявки, а не после звонка',why:'Три поля вместо девяти: откуда, куда, вес. Остальное менеджер уточняет после заявки.',crop:{x:30,y:5}},
    {type:'strip',label:'Мобильная версия',note:'Расчёт и заявка с телефона',labels:['Главная','Калькулятор','Услуги','Заявка']},{type:'scroll',label:'Отслеживание',note:'Статус груза по номеру накладной'}],
   colors:['#0B3D91','#FFB800','#F2F4F7','#222222'],font:'Montserrat',decision:'Синий и жёлтый — цвета автопарка клиента, на сайте жёлтый только у калькулятора.',
   stats:[{value:'+30',suffix:'%',caption:'Заявок'},{value:'−50',suffix:'%',caption:'Звонков «сколько стоит»'},{value:'5',suffix:' нед.',caption:'Срок проекта'}],quote:['«Звонков „сколько стоит“ стало вдвое меньше.',' Менеджеры занимаются заявками, а не расчётами.»'],author:'Коммерческий директор · Логистика'}};

export const PROJECTS: Project[] = BASE.map((p) => ({ ...p, case: CASES[p.slug] }));

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const caseHref = (p: Project) => `/cases/${p.slug}/`;
export const FILTERS = ['Все', 'Сайты', 'UI/UX', 'WordPress', 'Битрикс', 'Редизайн', 'AI'] as const;
