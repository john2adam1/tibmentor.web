'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react';

export default function OffertaPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-10 sm:px-12 sm:py-16">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity"
                    >
                        <ArrowLeftIcon size={20} />
                        Ortga qaytish
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 leading-tight">
                        Foydalanuvchi shartnomasi
                    </h1>

                    <div className="prose prose-slate max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
                        <section>
                            <p>
                                <strong>Operator:</strong> TibMentor kompaniyasi (keyingi o‘rinlarda — “Operator”)<br />
                                <strong>Ilova nomi:</strong> TibMentor (Android va iOS mobil ilovasi)
                            </p>
                            <p>
                                Ushbu hujjat O‘zbekiston Respublikasi Fuqarolik kodeksiga muvofiq ommaviy oferta hisoblanadi. Ilovada ro‘yxatdan o‘tish yoki undan foydalanishni boshlash orqali Foydalanuvchi ushbu shartlarni to‘liq qabul qilgan hisoblanadi.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">1. Shartnoma predmeti</h2>
                            <p>1.1. Operator Foydalanuvchiga TibMentor mobil ilovasi orqali tibbiyot sohasiga oid ta’limiy materiallardan foydalanish imkoniyatini beradi.</p>
                            <p>1.2. Ilovada mavjud:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>videodarslar, podcast</li>
                                <li>konspektlar</li>
                                <li>testlar</li>
                                <li>klinik misollar</li>
                                <li>algoritmlar</li>
                                <li>bepul va pullik kurslar</li>
                            </ul>
                            <p>1.3. Har bir kurs uchun alohida obuna rasmiylashtiriladi. Ayrim hollarda aksiya berilishi mumkin. Bu ilovada bildirishnoma sifatida keladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">2. Oferta qabul qilinishi</h2>
                            <p>Quyidagilardan biri ofertani qabul qilish (aksept) hisoblanadi:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Ilovada ro‘yxatdan o‘tish</li>
                                <li>Kurs uchun obuna rasmiylashtirish</li>
                                <li>To‘lov amalga oshirish</li>
                                <li>Ilovadan foydalanishni davom ettirish</li>
                            </ul>
                            <p>Aksept qilingan paytdan boshlab ushbu hujjat shartnoma kuchiga ega bo‘ladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">3. Kurslar va obuna tartibi</h2>
                            <p>3.1. Ilovada har bir kurs uchun alohida obuna sotiladi.</p>
                            <p>3.2. Obuna faqat tanlangan kursga kirish huquqini beradi.</p>
                            <p>3.3. Ayrim kurslar bepul bo‘lishi mumkin. Bunga to’lov qilinmaydi. Biroq ofertani qabul qilish kerak bo’ladi.</p>
                            <p>3.4. Pullik kurslarga kirish faqat to‘lov amalga oshirilgandan keyin taqdim etiladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">4. To‘lov va qaytarish siyosati</h2>
                            <p>4.1. To‘lovlar quyidagi platformalar orqali amalga oshirilishi mumkin: click integratsiyalashgan to‘lov tizimi orqali amalga oshiriladi. Agar siz chet davlatda bo’lsangiz, adminga yozishingiz mumkin.</p>
                            <p>4.2. To‘lov amalga oshirilgandan so‘ng xizmatdan foydalanish huquqi beriladi.</p>
                            <p className="font-black text-red-600">4.3. TO‘LOV QAYTARILMAYDI.</p>
                            <p>4.4. Foydalanuvchi to‘lovni amalga oshirishdan oldin kurs tavsifi bilan to‘liq tanishishi shart.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">5. Sertifikat</h2>
                            <p>5.1. Ilovada taqdim etiladigan kurslar yakunida sertifikat berilmaydi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">6. Tibbiy ogohlantirish</h2>
                            <p>6.1. Ilovadagi barcha materiallar faqat ta’limiy maqsadda taqdim etiladi.</p>
                            <p>6.2. Ilova klinik tashxis qo‘yish yoki bemorni davolash uchun rasmiy tibbiy xizmat hisoblanmaydi.</p>
                            <p>6.3. Operator Ilovadagi ma’lumotlar asosida qabul qilingan mustaqil klinik qarorlar uchun javobgar emas.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">7. Intellektual mulk</h2>
                            <p>7.1. Ilovadagi barcha materiallar TibMentor kompaniyasining intellektual mulki hisoblanadi.</p>
                            <p>7.2. Quyidagilar qat’iyan taqiqlanadi:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Video yoki testlarni ko‘chirib tarqatish</li>
                                <li>Ekran yozuvlarini ommaviy ulashish</li>
                                <li>Materiallarni sotish yoki uchinchi shaxslarga berish</li>
                                <li>Test bazasini nusxalash</li>
                            </ul>
                            <p>7.3. Qoidabuzarlik aniqlansa, akkaunt bloklanadi. Sudga beriladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">8. Foydalanuvchi majburiyatlari</h2>
                            <p>Foydalanuvchi:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Haqiqiy ma’lumot bilan ro‘yxatdan o‘tadi</li>
                                <li>Akkaunt maxfiyligini saqlaydi</li>
                                <li>Ilovadan qonuniy maqsadda foydalanadi</li>
                                <li>Spam, haqorat va noqonuniy faoliyat bilan shug‘ullanmaydi</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">9. Texnik cheklovlar</h2>
                            <p>9.1. Ilova internet tezligi va qurilma xususiyatlariga bog‘liq holda ishlaydi.</p>
                            <p>9.2. Operator texnik yangilanish yoki profilaktika sababli vaqtinchalik uzilishlar bo‘lishi mumkinligini ogohlantiradi. Shu vaqtdagi to’lovlarga rozi bo’lishi so’raladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">10. Javobgarlikni cheklash</h2>
                            <p>10.1. Operator Ilovadan foydalanish natijasida yuzaga kelgan bilvosita zararlar uchun javobgar emas.</p>
                            <p>10.2. Operator xizmatning 100% uzluksiz ishlashini kafolatlamaydi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">11. Shartnomani o‘zgartirish</h2>
                            <p>11.1. Operator ushbu ofertani bir tomonlama o‘zgartirish huquqiga ega.</p>
                            <p>11.2. Yangilangan shartlar Ilovada e’lon qilingan kundan boshlab kuchga kiradi.</p>
                            <p>11.3. Ilovadan foydalanishni davom ettirish yangi shartlarga rozilikni anglatadi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">12. Nizolarni hal qilish</h2>
                            <p>12.1. Nizolar avvalo muzokara yo‘li bilan hal qilinadi.</p>
                            <p>12.2. Kelishuvga erishilmasa, nizo O‘zbekiston Respublikasi qonunchiligiga muvofiq ko‘rib chiqiladi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4">13. Operator haqida</h2>
                            <p>13.1. Ilova ichidan “adminga bog’lanish” degan tugmani bosing.</p>
                            <p>13.2. Ilova uchun ko’plab ustozlarning mehnatiga singan. Ularni qadriga yeting! Ilovadan foydalanib manfaat olishingizni istaymiz! Barcha moddiy va nomoddiy kamchiliklar uchun rozi bo’ling!</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
