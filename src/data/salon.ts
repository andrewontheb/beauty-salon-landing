export const salon = {
  name: 'Юлия Дубицкая',
  phone: '+7 (495) 689-17-16',
  phoneHref: 'tel:+74956891716',
  address: 'Москва, ул. Октябрьская, д. 35',
  district: 'Марьина Роща',
  hours: 'Ежедневно с 9:00 до 21:00',
  appointment: 'Позвоните, чтобы выбрать удобное время и записаться к мастеру.',
  extraHours: 'До 9:00 и после 21:00 — по предварительной записи и предоплате, +30% к стоимости прайса.',
  map: {
    placeUrl: 'https://yandex.ru/maps/org/yulii_dubitskoy_salon/1022568523/',
    embedUrl: 'https://yandex.com/map-widget/v1/org/yulii_dubitskoy_salon/1022568523/?ll=37.613293%2C55.789688&z=17&lang=ru_RU&scroll=false',
    title: 'Салон Юлии Дубицкой на Яндекс Картах — Москва, Октябрьская улица, 35',
  },
  sources: ['https://juliadubitskaya.ru/about', 'https://juliadubitskaya.ru/kontakty'],
} as const;

export const home = {
  description: 'Стрижки и окрашивание, уход за лицом, маникюр и педикюр в Марьиной Роще.',
  about: 'Салон «Юлия Дубицкая» находится на Октябрьской улице, в районе Марьина Роща. Здесь можно подстричься, сделать окрашивание, маникюр или педикюр, подобрать уход за лицом.',
} as const;
