# Premium fan bo'yicha: mobil ilova uchun o'zgarishlar (T-12)

Premium endi 3 ta qat'iy paket emas, **fan (modul) bo'yicha** sotiladi. Admin fanga premium narxi qo'yadi, shu fan premiumi uning barcha kurslarini ochadi. Hozir bular Fundamental, Preklinik va Klinik fanlar, lekin soni o'zgarishi mumkin. Modullar ro'yxatini ilovada qattiq yozmang, faqat API'dan oling.

Endpointlar o'sha-o'sha, o'zgargani maydonlar.

## 1. Premium ekrani

`GET /mobile/premium` (nomlar `Accept-Language` bo'yicha)

```json
{
  "is_premium": true,
  "premium_until": "2026-11-26T13:00:00+05:00",
  "is_ustoz": false,
  "packages": [
    {
      "subject_id": "…",
      "name": "Fundamental fanlar",
      "image_url": "…",
      "courses": ["Anatomiya", "Fiziologiya", "Biokimyo"],
      "price": 50000,
      "duration_months": 1,
      "is_active": true,
      "until": "2026-11-26T13:00:00+05:00"
    }
  ]
}
```

Kartochka bilan moslik:

| Kartochkada | Maydon |
|-------------|--------|
| Ikonka | `image_url` |
| Sarlavha | `name` |
| Ostidagi qator ("Anatomiya, fiziologiya, biokimyo") | `courses`, vergul bilan birlashtiring |
| «Narx / oy» | `price` (so'm) |
| «Faol · DD.MM.YYYY gacha», tanlab bo'lmaydi | `is_active: true`, `until` |

- Ro'yxatga faqat narxi qo'yilgan fanlar kiradi. `packages` bo'sh bo'lsa: «Narx hali belgilanmagan», tugmani yashiring.
- Yuqoridagi umumiy «Narx» bloki uchun tanlangan kartochkaning `price` qiymatini ko'rsating.
- Tugma matni: «<name> Premiumini olish».
- Modullarga bo'linishdan oldin umumiy premium olganlarda muddati tugaguncha hamma kartochka `is_active: true`.

## 2. Sotib olish

`POST /mobile/premium/order`

```json
{ "subject_id": "…", "promocode_id": "…" }
```

- `subject_id`: tanlangan kartochkaning `subject_id`. Majburiy.
- `promocode_id` ixtiyoriy.
- Javob avvalgidek: `{ "order_id": "…", "url": "https://my.click.uz/…" }`. `url` ni oching, to'lovdan keyin `GET /mobile/premium` ni qayta chaqiring.
- Faol modulga qayta to'lov shu modul muddatini uzaytiradi.

Promokod tekshiruvi:

```json
POST /mobile/promocode/check
{ "type": "premium", "subject_id": "…", "promocode": "BAHOR10" }
```

Xatolar (`400`):

| `message` | Ma'nosi |
|-----------|---------|
| `premium price is not configured` | Fan premium emas yoki narxi qo'yilmagan |
| `subject_id is required` | `subject_id` yuborilmagan yoki noto'g'ri |

## 3. Kurs sahifasi

`GET /mobile/course/:id` ga qo'shildi:

```json
{ "has_access": false, "subject_id": "…", "premium_price": 50000 }
```

- `has_access: false` va `premium_price > 0` bo'lsa: «♛ <fan nomi> Premiumini olish». Bosilganda Premium ekrani shu `subject_id` tanlangan holda ochiladi.
- `premium_price: 0` bo'lsa fan premiumsiz, premium tugmasini ko'rsatmang.

## 4. Profil

`GET /mobile/user/get/profile` dagi `packages` endi fanlar bo'yicha:

```json
"packages": [
  { "subject_id": "…", "name": "Fundamental fanlar", "is_active": true,  "until": "2026-11-29T13:00:00+05:00" },
  { "subject_id": "…", "name": "Klinik fanlar",      "is_active": false, "until": null }
]
```

Har bir faol modul uchun qator: «Premium: <name> · DD.MM.YYYY gacha» + «Uzaytirish».

## 5. Eski maydonlar

`package` (`fundamental`, `preclinical`, `clinical`) vaqtincha qabul qilinadi va qaytariladi, lekin yangi kodda ishlatmang. Keyingi bosqichda olib tashlanadi.
