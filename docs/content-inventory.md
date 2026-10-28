# Инвентарь контента

Источник: https://juliadubitskaya.ru/ · извлечено 26.10.2026.

Изучены главная, 48 содержательных страниц каталога/контактов/галереи/акций, новости, отзывы, robots.txt и sitemap.xml. Новости пустые; на странице отзывов только форма, опубликованных отзывов нет. Главная содержит служебную инструкцию CMS; её текст исключён. Обучение и сертификаты исключены по заданию; вложенные семинары из sitemap также не переносятся.

Полные исходные описания, строки прайсов и изображения сохранены в [`src/data/source-pages.json`](../src/data/source-pages.json). Нормализованный прайс — только [`src/data/catalog.json`](../src/data/catalog.json); архив не используется для вывода цен. Этот документ описывает классификацию, проблемы и карту переноса, не дублирует весь прайс.

## Иерархия и сопоставление

Предложена схема «направление → группа → услуга → вариант стоимости». Длина волос, материал, зона, время, покрытие и единица измерения сохраняются в вариантах и примечаниях. ID не зависят от русского заголовка. Смысл `source`: факт присутствует на старом сайте, актуальность заказчиком отдельно не переподтверждена.

| Направление (ID) | Группы | Услуг / вариантов |
|---|---|---|
| Парикмахерские услуги (`hair`) | Женские стрижки; Мужские стрижки; Льготные стрижки; Укладки и причёски; Окрашивание; Долговременная укладка; Уход за волосами | 45 / 104 |
| Маникюр и наращивание ногтей (`manicure`) | Маникюр; Укрепление и уход; Покрытия; Наращивание и дизайн | 27 / 42 |
| Педикюр и подология (`pedicure`) | Педикюр; Подология; Корректирующие системы и ортезы; Дополнительные услуги | 43 / 43 |
| Уход за лицом (`face`) | Чистки и пилинг; Уходовые процедуры; Массаж лица и декольте | 11 / 20 |
| Брови и ресницы (`brows`) | Брови; Наращивание ресниц; Уход за ресницами | 19 / 22 |
| Макияж (`makeup`) | Макияж; Консультация и оформление | 8 / 8 |
| Депиляция (`depilation`) | Депиляция воском WHITE LINE; Шугаринг | 16 / 16 |
| Перманентный макияж (`permanent`) | Татуаж | 5 / 5 |
| Пирсинг (`piercing`) | Проколы; Украшения и микродермал | 15 / 15 |
| Массаж (`massage`) | Массаж по зонам; Антицеллюлитный массаж | 11 / 11 |
| Уход за телом (`body`) | СПА-массаж; Пилинг тела; Обёртывания | 12 / 12 |

Всего: 212 услуг / 298 вариантов. Уход за телом хранится как приостановленное направление; это не обещание доступности.

Общий перечень `/uslugi-i-produkty` смешивает направления и отдельные услуги. Депиляция и уход за телом там относятся к косметологии; массаж лица — к массажу. Предложено выделить понятные пользователю направления, а массаж лица оставить при уходе за лицом. Из раздела «Косметология» выделены брови/ресницы, макияж и пирсинг. Педикюр и подология остаются на одной странице с разными группами. Наращивание и дизайн ногтей входят в маникюр. Направления не означают наличие всех перечисленных услуг сейчас.

Дубли без противоречий: восковая депиляция на `/depilyatsiya` и `/depilyatsiya-voskom`; большинство бровей на `/kosmetologiya` и `/brovi-i-resnitsy`; причёски на `/pricheski` и `/zhenskiy-zal`; наращивание и дизайн ногтей на `/manikyur`, `/narashchivaniye-nogtey`, `/dizayn`; ортезы/стельки/титановая нить/скоба Фрезера в подологии и ортезах; Hydro Plus в обычном прайсе и акциях. Эти факты объединены, а не созданы независимые копии прайсов.

## Расхождения и решения до уточнения

КТ-2 пройдена. Пользователь разрешил полную реализацию с прежним ограничением: спорные цены, неподтверждённые услуги и акции не публикуются. Новые бизнес-данные не выбирались. Ни дата sitemap, ни положение страницы в иерархии не дают права автоматически предпочесть одну цену.

| Проблема | Точные источники и сведения | Обработка |
|---|---|---|
| Классический маникюр | `/manikyur`: 1 300 без покрытия, 1 600 с лаком, 2 300 с гель-лаком; `/klassicheskiy-manikyur`: 800 без лака, 1 100 с лаком | Одна услуга, конфликтующие варианты |
| Повседневная укладка с мытьём | `/ukladki`: до 15/20/40 см — 1 300/1 500/1 800; `/zhenskiy-zal`: 1 800/2 300/2 500 | Конфликт, не выводить |
| Мелирование | `/okrashivaniye`: фольга до 15/20/40 — 2 500/3 000/4 000, шапочка 2 000; `/melirovaniye`: до 10/15/20/от 20 — 1 000/1 200/1 400/1 800, шапочка 1 100 | Разные цены и шкалы длины. Везде работа без материалов |
| Химическая завивка | `/zhenskiy-zal`: до 15/20/40 см — 3 000/4 000/5 000; `/khimicheskaya-zavivka`: до 10/15/20/от 20 — 1 900/2 150/2 350/2 900 | Разные цены и шкалы; во втором источнике единица длины не подписана |
| Косы | `/zhenskiy-zal`: 1 000; `/pleteniye-kos`: «от 500 - 2500» | Формулировку диапазона и различие подтвердить |
| Узоры машинкой | `/muzhskoy-zal`: от 300; `/risunki-i-uzory`: 300–2 500 | Нижняя граница совпадает; подтвердить верхнюю и одинаковый состав |
| Лак / снятие | `/manikyur`: один тон 150, снятие 100; `/pokrytiye-lakom`: покрытие 350, снятие 50 | Конфликт / возможный разный состав, не выбирать |
| Френч и гель-лак | `/manikyur`: френч 500, гель-лак один тон 1 000, гель-френч 1 500; `/dizayn`: френч 300; `/dolgovremennoye-pokrytiye-tsvetnymi-gelyami-opi`: 900 / 1 200 | Конфликт |
| Снятие гель-лака | `/manikyur`: 400 с последующим покрытием, 600 без; детальный прайс цветных гелей: 400 без уточнения | Сохранить условие и запросить состав |
| Мужские брови | `/kosmetologiya`: 1 000; `/brovi-i-resnitsy`: 1 000–2 500 | Конфликт |
| Airtouch | `/okrashivaniye`: две цены 15 000 / 20 000 при трёх колонках длины | Не назначать длины по пробелам в HTML |
| Доплата за сложность | `/depilyatsiya-voskom`: «За сложность в работе + 10» | Единица не указана, не считать процентом. На сайте есть предупреждение о доплате с предложением уточнить её по телефону; неизвестное число не выводится |
| Ламинирование | `/laminirovaniye`: число ампул в скобках, для коротких «1 пара ампул»; дополнительная ампула 650 | Сохранено исходное число, состав подтвердить; не обещать окончательную цену |
| Подология | `/korrektsiya-rosta-vrosshego-nogtya`: чистка 1 ед., «свыше 2х ногтей», 1 000–4 500; выезд «/ 75+ /» 14 000 первичный, 12 500 повторный 1,5–2 мес. плюс процедура | Значение ограничений не определять самостоятельно |
| Пирсинг | `/pirsing-mochki-ukha`: «двойные, 1 прокол»; украшение отдельно, кроме STUDEX с серёжкой | Три неоднозначные записи переведены в `needs-confirmation` и исключены до пояснения. Остальные условия сохранены |
| Медицинские формулировки | `/about`, `/korrektsiya-rosta-vrosshego-nogtya`, `/pirsing-mochki-ukha` | В архиве сохранены как текст источника; квалификации/лицензии не установлены, не добавлены |

### Недоступность и неполнота

- `/ukhod-po-telu`: «Временно эту услугу не оказываем». Содержит шесть СПА-массажей с ценами; область предупреждения неясна. Всё направление приостановлено для публичного вывода до уточнения; вложенные пилинги и обёртывания требуют подтверждения.
- `/antitsellyulitnyy-massazh`: «На данный момент эту услугу не предоставляем». Шесть вариантов сохранены как приостановленные.
- `/depilyatsiya-shugaring`: «Шугаринг временно не делаем». Нет цены.
- `/spa-ukhod-1`: пустая страница; восстановление ногтя в `/klassicheskiy` без цены; IBX, ботокс/наращивание волос, боди-арт, мехенди, глиттер тату присутствуют только в общих текстах, без детального прайса.
- `/about` и `/uslugi-i-produkty` шире фактических страниц и включают приостановленные позиции. Не считать общий перечень доказательством возобновления услуги.
- Стрижка пенсионерам от 65 лет: 500 ₽ мужчинам и женщинам до 12:00 на `/strizhki`; других ограничений не указано. Условие времени обязательно сохранять.
- Окрашивание и мелирование: цены за работу без материалов. Мужские волосы от 10 см — по женскому прайсу. Татуаж: 1–2 часа; коррекция не позднее 1,5 месяца, цена коррекции отсутствует.
- `/about`: работа ежедневно 9:00–21:00; вне графика только предварительная запись и предоплата, +30%. Телефон в шапке совпадает с `/about`; `/kontakty` подтверждает адрес, самостоятельного графика там нет.

## Акции

Все шесть предложений `/aktsii` сохранены в `promotions.json`; цены связаны с каталогом через `priceRef`. Полные рекламные описания и заявленные эффекты — в архиве. Сроков и дат начала/окончания на странице нет; явно истёкших дат не обнаружено. Дата изменения в sitemap не доказывает актуальность.

Полировка волос (30 минут, от 800), омолаживающий массаж лица (20 минут, 500), антистрессовый массаж лица (20 минут, 500), воротниковая зона (15 минут, 350), FACE FIT «Детокс для кожи» (10 минут, 750), HYDRO PLUS (45 минут, 3 700; рекомендован курс 4 процедуры). Цены в рублях. HYDRO PLUS совпадает с обычным прайсом; скидка не установлена. Массаж воротниковой зоны в обычном прайсе длится 30 минут и стоит 1 000 — другая длительность, не автоматический конфликт.

28.10.2026 пользователь разрешил публикацию всех шести на `/aktsii/`. `publish: true` разрешает именно это представление; `needs-confirmation` продолжает отмечать необходимость бизнес-сверки, статусы и группировка основного каталога не меняются. Цены выводятся по существующим `priceRef`, описания сокращены по архиву без добавления эффектов. Сохранены «доступно только в салоне» у FACE FIT и рекомендованный курс 4 процедуры у HYDRO PLUS; на странице указано отсутствие сроков и уточнение актуальности по телефону. Таймеров и заявлений о скидке нет.

## Изображения

Дополнение от 28.10.2026, уточнённое после визуальной приёмки: `incoming/gallery-photos.zip` содержит пять стоковых превью с водяными знаками iStock. По корректирующему заданию используются все пять: `StockPhoto3.jpg` (мужская стрижка), `stockPhoto2.jpg` (мытьё), `stockPhoto4.jpg` (укладка), `stockPhoto5.jpg` (уход), `stockPhoto1.jpg` (интерьер). Файлы сохранены в `src/assets/gallery/` под содержательными именами; watermark не удалён. Пользователь потребовал убрать видимые пояснения и подписи в `/#gallery`; происхождение остаётся во внутренних комментариях и здесь. Это не реальные фотографии салона или его работ. Для окончательной публикации заменить превью чистовыми разрешёнными материалами.

`incoming/beauty-categories-v2.zip` полностью заменил первоначальный комплект AI-изображений. В `src/assets/categories/` находятся только новые портретные WebP 275–278×455 px: `hair` → волосы, `manicure` → маникюр, `pedicure` → педикюр, `face` → уход за лицом, `brows` → брови/ресницы, `makeup` → макияж, `depilation` → депиляция, `permanent` → перманентный макияж, `piercing` → пирсинг, `massage` → массаж. Один набор используется на главной, в `/uslugi/` и вводных областях направлений. По заданию видимые пояснения о происхождении удалены. Astro `Image` формирует WebP/srcset без увеличения исходников; размеры резервируются, миниатюры ниже первого экрана загружаются лениво. Исходники не ретушировались; ZIP и временные материалы не коммитятся.

Галерея: пять реальных коллажей по 698×344 px: зал, косметологический кабинет (два), маникюр, вход. Для КТ-2 выбран фрагмент зала; оригинал и WebP сохранены в `src/assets`. Коллажи малы для полноэкранного изображения; не увеличивать их без необходимости. Фотографии команды и достоверные работы с описанием не обнаружены на изученных страницах. Тематические картинки услуг не считаются работами салона. Их происхождение и права не установлены, в прототип не перенесены.

Все найденные пути изображений ниже доступны на домене источника; полный URL получается добавлением `https://juliadubitskaya.ru`. Ссылки сохранены для будущего отбора, а не как подтверждение качества или лицензии.

| Страница | Доступные изображения |
|---|---|
| /antitsellyulitnyy-massazh | `/thumb/2/6bYSDPvQFGPhE0pcK3W9-g/r/d/massazh_antitsellyu.png` |
| /apparatnyy | `/thumb/2/iGceDQLn0__x95TNpo5NWw/r/d/ped-apparat.png` |
| /brovi-i-resnitsy | `/thumb/2/9EvUZ688j6o6bLP3EqYu8w/r/d/brovi.png` |
| /chistka-litsa | `/thumb/2/ChfJDrdhEbtO18Ts9jHCIg/r/d/chistka_2.png` |
| /depilyatsiya-shugaring | `/thumb/2/avPANAFrNBKKSAloNS0Wzg/r/d/depilyatsiya_shugaring.png` |
| /depilyatsiya-voskom | `/thumb/2/_IQS_gulqd3wq2eGXjo-UQ/r/d/depilyatsiya_vosk2.png` |
| /depilyatsiya | `/thumb/2/S4hvDhXDeb6WvpLKDe3uAw/r/d/depilyatsiya.png` |
| /dizayn | `/thumb/2/rdDrhVIPShhgCPx4r8M1_g/r/d/manikyur_dizayn2.png` |
| /dolgovremennoye-pokrytiye-tsvetnymi-gelyami-opi | `/d/lak_1.png` |
| /galereya | `/thumb/2/DEoRtBRBkCYUKooaRjNxnA/r/d/zal-2.png`<br>`/thumb/2/HN6AyN0OCib4YQl9JrHeHg/r/d/kosmetolog-2.png`<br>`/thumb/2/mcdH4Yx6m5lUtUzPSju9Tw/r/d/kosmetolog-2a.png`<br>`/thumb/2/vVLB2YXw7VcRmOxKBeco2A/r/d/manikyur.png`<br>`/thumb/2/IARBGTLG6CzSyzB4YRfNOw/r/d/vkhod-2.png` |
| /izgotovleniye-individualnykh-ortezov | `/thumb/2/t-FzNUlpfYzVfSDOgvQiCg/r/d/ped-ortezy.png` |
| /khimicheskaya-zavivka | `/thumb/2/E0pDI56NRVli73BNI4_hSw/r/d/khim-zavivka.png` |
| /klassicheskiy-manikyur | `/thumb/2/5esX2FTrVCudfJCcDDEjAg/r/d/manikyur_klass.png` |
| /klassicheskiy | `/thumb/2/hW1qnq2FUNsWa8sHaZBB-Q/r/d/ped-klass.png` |
| /korrektsiya-rosta-vrosshego-nogtya | `/thumb/2/H6hWVYcA_RsFMGabarE3mg/r/d/ped-nogot.png` |
| /kosmetologiya | `/thumb/2/k47R_n0Wn2WY4tPmXGVJ3A/r/d/kosmetologiya.png` |
| /laminirovaniye | `/thumb/2/gIobymix1XVxO8GC6lGsmw/r/d/laminirovaniye_01.png` |
| /manikyur | `/d/manikyur-narashchivaniye_2.png` |
| /massazh-po-litsu-i-dekolte | `/thumb/2/dfDwQ7LWKJahnwFwERLQkA/r/d/massazh.png` |
| /massazh-po-zonam | `/thumb/2/Xq0QsJnjzNRZKu9ieg0IHg/r/d/massazh_zony.png` |
| /massazh | `/thumb/2/VFpASx6LZGjzd1mOXE4xbQ/r/d/avtor.png` |
| /melirovaniye | `/thumb/2/D1IDYITv0WZd9cIQ8DTRZQ/r/d/melirovaniye.png` |
| /muzhskoy-zal | `/thumb/2/EL2TZwrLfULjFxB7GANPnw/r/d/muzh.png` |
| /narashchivaniye-nogtey | `/thumb/2/3d896qIDt51jNuCnvq8Dqw/r/d/manikyur-narashchivaniye2.png` |
| /obertyvaniye | `/thumb/2/M-_BlEDNBRrnpLPBPi-UXw/r/d/obertyvaniye.png` |
| /parafinovoye-ukutyvaniye-kistey-ruk | `/thumb/2/WkTMgrdYQSEaBxogXqhEwg/r/d/manikyur_obert.png` |
| /pedikyur | `/thumb/2/H5G-emwdsNOW01q2OkZjgw/r/d/pedikyur.png` |
| /piling-1 | `/thumb/2/cSkU4gSUDDSK9gLq6r4xSQ/r/d/piling_2.png` |
| /piling | `/thumb/2/PBO0p_vhbU8vPKMhRiRUDg/r/d/piling.png` |
| /pirsing-mochki-ukha | `/thumb/2/TsHiGRRSonX1R4eGc3PeVg/r/d/pirsing.png` |
| /pleteniye-kos | `/thumb/2/6HHk2TFrMd1Mzr4tHuIfaw/r/d/kosy_4.png` |
| /pokrytiye-lakom | `/thumb/2/y3emG_gQV8smPDITxbCo5A/r/d/manikyur_lak.png` |
| /risunki-i-uzory | `/thumb/2/IdG8H-Dyn_LvV-diF1IiAw/r/d/uzory.png` |
| /strizhki | `/thumb/2/29ot1E7AhVndowCx-yABUA/r/d/strizhki.png` |
| /tatuazh-permanentnyy-makiyazh | `/thumb/2/4brugaJ4T1FyVKnPw3Qvcg/r/d/tatuazh.png` |
| /ukhod-po-litsu | `/thumb/2/wiNk1Vv9CQ9m5FMil80MjA/r/d/ukhod.png` |
| /ukhod-po-telu | `/thumb/2/ldP0SKevxL4I39Ss4npezQ/r/d/massazh-2.png` |
| /ukladki | `/thumb/2/3yhGElocQHIyZzjlrMOhDg/r/d/ukladki.png` |
| /vizazh-litsa-make-up | `/thumb/2/xRoryq-pGEfLOYrfgEIC1g/r/d/vizazh.png` |
| /zhenskiy-zal | `/thumb/2/BgxBziMMDWMP8m-T1Cac5A/r/d/strizhki_zhen-zal.png` |

## Карта старых URL → целевая структура

Карта актуализирована по фактически реализованным страницам и якорям. Это соответствия для этапа размещения, а не настроенные редиректы. Доменные варианты, слеши и коды ответа определяются после выбора сервера. Для услуг без доступного эквивалента цель не назначается.

| Старый путь | Фактическая цель |
|---|---|
| `/` | `/` |
| `/about` | `/#about` |
| `/aktsii` | `/aktsii/` |
| `/antitsellyulitnyy-massazh` | Не назначена: услуга приостановлена |
| `/apparatnyy` | `/uslugi/pedikyur/#aesthetic` |
| `/brovi-i-resnitsy` | `/uslugi/brovi-i-resnicy/` |
| `/chistka-litsa` | `/uslugi/uhod-za-licom/#cleansing` |
| `/depilyatsiya-shugaring` | Не назначена: услуга приостановлена |
| `/depilyatsiya-voskom` | `/uslugi/depilyaciya/#wax` |
| `/depilyatsiya` | `/uslugi/depilyaciya/#wax` |
| `/dizayn` | `/uslugi/manikyur/#extension` |
| `/dolgovremennoye-pokrytiye-tsvetnymi-gelyami-opi` | Не назначена: конфликтующие цены |
| `/galereya` | `/#gallery` (галерея иллюстраций; реальный зал остаётся в Hero) |
| `/izgotovleniye-individualnykh-ortezov` | `/uslugi/pedikyur/#orthotics` |
| `/khimicheskaya-zavivka` | Не назначена: конфликтующие цены |
| `/klassicheskiy-manikyur` | Не назначена: основная услуга имеет конфликтующие цены |
| `/klassicheskiy` | `/uslugi/pedikyur/#aesthetic` |
| `/kontakty` | `/#contacts` |
| `/korrektsiya-rosta-vrosshego-nogtya` | `/uslugi/pedikyur/#podology` |
| `/kosmetologiya` | `/uslugi/uhod-za-licom/` |
| `/laminirovaniye` | `/uslugi/volosy/#care` |
| `/manikyur` | `/uslugi/manikyur/` |
| `/massazh-po-litsu-i-dekolte` | `/uslugi/uhod-za-licom/#massage` |
| `/massazh-po-zonam` | `/uslugi/massazh/#zones` |
| `/massazh` | `/uslugi/massazh/#zones` |
| `/melirovaniye` | Не назначена: конфликтующие цены и шкалы длины |
| `/muzhskoy-zal` | `/uslugi/volosy/#men` |
| `/narashchivaniye-nogtey` | `/uslugi/manikyur/#extension` |
| `/obertyvaniye` | Не назначена: родительское направление приостановлено |
| `/okrashivaniye` | `/uslugi/volosy/#color` |
| `/parafinovoye-ukutyvaniye-kistey-ruk` | `/uslugi/manikyur/#care` |
| `/parikmakherskiye-uslugi` | `/uslugi/volosy/` |
| `/pedikyur` | `/uslugi/pedikyur/` |
| `/piling-1` | Не назначена: родительское направление приостановлено |
| `/piling` | `/uslugi/uhod-za-licom/#cleansing` |
| `/pirsing-mochki-ukha` | `/uslugi/pirsing/` |
| `/pleteniye-kos` | Не назначена: конфликтующие цены |
| `/pokrytiye-lakom` | Не назначена: конфликтующие цены |
| `/pricheski` | `/uslugi/volosy/#styling` |
| `/risunki-i-uzory` | Не назначена: условия диапазона не подтверждены |
| `/spa-ukhod-1` | Не назначена: исходный прайс пустой |
| `/strizhki` | `/uslugi/volosy/#women` |
| `/tatuazh-permanentnyy-makiyazh` | `/uslugi/permanentnyy-makiyazh/` |
| `/ukhod-po-litsu` | `/uslugi/uhod-za-licom/#care` |
| `/ukhod-po-telu` | Не назначена: направление приостановлено, страница не создана |
| `/ukladki` | Не назначена: конфликтующие цены |
| `/uslugi-i-produkty` | `/uslugi/` |
| `/vizazh-litsa-make-up` | `/uslugi/makiyazh/` |
| `/zhenskiy-zal` | `/uslugi/volosy/#women` |

На странице волос доступны также `#men` и `#social`. Страница лица связана с бровями, макияжем, депиляцией и пирсингом через блок других направлений. Для шугаринга, антицеллюлитного массажа и ухода за телом не создавались страницы или пустые группы. Акции выводятся на `/aktsii/` по отдельному разрешению от 28.10.2026. После подтверждения данных карту пересмотреть до настройки редиректов. Конкретные услуги имеют якорь `#service-<group-id>-<service-id>`, например `/uslugi/volosy/#service-women-women-cut`. В дизайне ногтей доступен дизайн за один ноготь, конфликтующий френч исключён.

Служебные и исключённые URL из sitemap: `/obucheniye`, `/seminar-1-depilyatsiya-teplyy-voskom-i-kartridzhami`, `/seminar-2-depilyatsiya-teplym-voskom`, `/seminar-3-shugaring-sakharnaya-pasta`, `/seminar-4-shugaring-sakharnaya-pasta`, `/seminar-5-professionalnoye-modelirovaniye-formy-brovey-magiya-vzglyada`, `/seminar-6-brovi-magiya-vzglyada`, `/seminar-7-voskovaya-depilyatsiya`, `/seminar-8-modelirovaniye-resnits`, `/podarochnyy-sertifikat` — не переносятся; код ответа 404/410 согласовать на этапе публикации. Не перенаправлять обучение на услуги с другим смыслом.

`/novosti` пустая; `/otzyvy-o-nas` содержит только форму без отзывов; `/napishite-nam`, `/search`, `/karta-sayta`, `/opros` — служебные/вне согласованной структуры. Не переносить формы, опрос, поиск, отзывы без проверки содержания и необходимости. Для `/napishite-nam` возможен переход на `/#contacts`, для `/karta-sayta` — на `/uslugi/`; окончательные ответы для остальных определить перед размещением. Robots/sitemap формируются при сборке: demo — meta noindex, пустой sitemap без анонса, robots разрешает чтение HTML; live — явный режим только для `https://juliadubitskaya.ru/`, 13 страниц в sitemap без 404. Внедрение 301 и серверные ответы для миграции отложены до согласования хостинга.
