# TibMentor TZ — website user-side

Ishni bajarishda shu faylni ochib turing. TZ asosan **mobil ilova** uchun yozilgan; bu repo faqat **website user-side** (landing, login, dashboard, kurslar, dars, tarif, reyting, profil).

## Havolalar

- Yo‘l xaritasi va interaktiv prototip (telefon ko‘rinishi): [Claude artifact](https://claude.ai/artifact/TKMm3YQ29z4G5kfXqWkVvm)
- Website kesimi, nima saytda / nima emas, narx: [TZ website canvas](/Users/zohidjonzaylobiddinov/.cursor/projects/Users-zohidjonzaylobiddinov-projects-imedteam-uz/canvases/tz-website-scope-pricing.canvas.tsx)

Eski texnik hujjat (joriy stack): `TZ.md`

---

## Brend eslatmasi

- T-01 da ilova nomi: **TibMentor**
- T-02 da logo: **TibUstoz**
- Ish boshlashdan oldin mijozdan qaysi nom qonuniy ekanini bir marta so‘rang.

---

## Asos hujjatdagi 13 ta talab

### T-01. Ilova nomi — TibMentor

«iMed Team» nomi barcha joylarda bir xil yozilgan **TibMentor**ga almashtiriladi.

- **Sayt:** ha
- **Qayerda:** landing, header, sidebar, title, oferta, footer, `app/layout.tsx`
- **Hozir:** `iMed Team` matnlari ko‘p joyda

### T-02. Yangi logotip

Qizil dumaloq logo o‘rniga yangi TibUstoz logotipi ilovaning barcha qismlarida bitta uslubda qo‘llanadi.

- **Sayt:** ha
- **Qayerda:** `public/assets/logo.png`, favicon, header, sidebar, login
- **Hozir:** qizil dumaloq logo

### T-03. Ichki dizayn va brend uslubi

Qizil interfeys yangi logo ranglariga mos, yagona premium uslubda qayta ishlanadi.

- **Sayt:** ha (katta ish)
- **Qayerda:** `app/globals.css` (`--primary: 350 75% 45%`), barcha student/landing sahifalar
- **Hozir:** maroon/qizil premium

### T-04. Admin panelda kirish vaqti

Admin har bir foydalanuvchining ilovaga kirgan sanasi va oxirgi kirgan vaqtini ko‘radi.

- **Sayt:** yo‘q (admin + backend)

### T-05. Avtomatik push

Ilovaga 24 soat kirmagan foydalanuvchiga «Bugun hali dars qilmadingiz. Davom etamizmi?» xabari keladi. Foydalanuvchi qaytib kirsa, hisob qaytadan boshlanadi.

- **Sayt:** qisman — FCM token allaqachon yuboriladi (`hooks/use-push-notifications.ts`)
- **Asosiy ish:** backend cron, website UI deyarli yo‘q

### T-06. Faqat joylangan kontent turi

Modulda faqat admin joylagan bo‘lim (video, audio, hujjat, test) ko‘rinadi. Bo‘sh bo‘lim va bo‘sh ekran bo‘lmaydi.

- **Sayt:** ha
- **Qayerda:** `app/(student)/lessons/[id]/page.tsx`
- **Hozir:** video yo‘q bo‘lsa placeholder; material/test bo‘sh bo‘lsa ham karta chiqadi; audio yo‘q

### T-07. Ilova ichidagi test

Testlar endi PDF emas: foydalanuvchi mavzuni o‘rgangach, testni ilovaning o‘zida ishlaydi.

- **Sayt:** ha (eng katta yangi mahsulot)
- **Hozir:** test = PDF ochish
- **Bog‘liq:** T-08 API bo‘lmasa to‘xtaydi

### T-08. Admin panelda test qo‘shish

Admin savol va variantlar qo‘shib, to‘g‘ri javobni belgilaydi. Savol va variantlar soni cheklanmaydi, vaqt belgilash ixtiyoriy.

- **Sayt:** yo‘q (admin + backend)
- Website T-07/T-09/T-10 shu API ni kutadi

### T-09. Test ishlash jarayoni

Variant tanlangan zahoti to‘g‘ri javob yashil, xato javob qizil bo‘ladi.

- **Sayt:** ha, T-07 ichida

### T-10. Test yakuni

Natija foizda ko‘rsatiladi va ikki tugma chiqadi: «Keyingi mavzuga o‘tish» va «Testni qayta ishlash».

- **Sayt:** ha, T-07 ichida

### T-11. Tariflarni olib tashlash

1, 3, 6 va 12 oylik alohida tariflar olib tashlanadi, o‘rniga bitta oylik Premium keladi.

- **Sayt:** ha
- **Qayerda:** `app/(student)/tariffs/page.tsx`, kurs sotib olish
- **Hozir:** kurs bo‘yicha ko‘p tarif

### T-12. Premium tizimi

Ilovada PREMIUM tugmasi bo‘ladi. Foydalanuvchi har oy Click orqali to‘laydi va barcha kurslarga kirish huquqini oladi.

- **Sayt:** ha
- **Hozir:** kurs-tarif + Click URL bor; global oylik Premium yo‘q
- **Bog‘liq:** to‘lov / obuna API

### T-13. Home bo‘limlari

Bo‘limlar kichik ikonkalar bilan vertikal ro‘yxatda joylashadi va pastga suriladi. Gorizontal katta ikonkalar ishlatilmaydi.

- **Sayt:** qisman — web sidebar allaqachon vertikal (`components/student/Sidebar.tsx`)
- TZ asosan **mobil home** uchun. Prototipdagi home ni webga pixel-perfect qilish shart bo‘lsa, shu yerda

---

## Keyin qo‘shilgan 4 ta talab

### T-14. Reyting

Reyting yangi dizaynga o‘tadi va test natijalari bo‘yicha alohida reyting qo‘shiladi. Foydalanuvchi o‘z o‘rnini doim ko‘radi.

- **Sayt:** ha
- **Qayerda:** `app/(student)/leaderboard/page.tsx`
- **Hozir:** faqat o‘qish vaqti reytingi

### T-15. Profil

Profil yangi dizaynga o‘tadi. Unda Premium holati, test natijalari tarixi va ustozlar uchun «Ustoz» belgisi chiqadi.

- **Sayt:** ha
- **Qayerda:** `app/(student)/profile/page.tsx`
- **Hozir:** oddiy profil, bu maydonlar yo‘q

### T-16. Ustoz unvoni

Admin kontent yaratgan foydalanuvchiga «Ustoz» unvonini beradi. Unvon berilishi bilan barcha kurslar unga doimiy ochiladi.

- **Sayt:** qisman — badge ko‘rsatish + kurslar ochiq
- **Berish:** admin + backend

### T-17. Xabarnomani admin yuboradi

Kursga material qo‘shilganda yoki o‘zgartirilganda avtomatik push ketmaydi. Yangilash tugagach, admin bitta xabarnomani o‘zi yozib yuboradi.

- **Sayt:** deyarli yo‘q — notification ro‘yxati bor (`app/(student)/notifications/page.tsx`)
- **Yuborish:** admin + backend

---

## Ish tartibi (website)

API tayyor bo‘lmagan narsani oldin qilmang.

1. **A. Brend** — T-01, T-02, T-03, kerak bo‘lsa T-13. Backend kutmaydi.
2. **B. Dars + test** — T-06, T-07, T-09, T-10. T-08 API shart.
3. **C. Premium va kabinet** — T-11, T-12, T-14, T-15, T-16 UI. To‘lov API shart.

Website emas, bu repoda qilinmaydi: **T-04, T-08, T-17 yuborish**, T-05 cron, T-16 unvon berish.

## Saytda o‘zgartirmang

- Admin panel
- Mobil ilova
- Prod API ga POST / o‘zgartirish (local `.env` = `https://dev.imedteam.uz`)
