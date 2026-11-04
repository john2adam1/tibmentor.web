'use client';

import React from 'react';
import {
    Star,
    BookOpen,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

export default function Services() {
    const books = [
        "Medical English",
        "Gematalogiya",
        "Antibiotiklar Farmakologiyasi",
        "Kardiologiya",
        "Qon-Tomir patologiyasi"
    ];

    const rightGoals = [
        "ILMIY ASOSLANGAN (EVIDENCE-BASED TIBBIYOTNI O’RGATISH)",
        "KLINIK FIKRLASHNI O’STIRISH\nMA’SULIYATLI VA HALOL SHIFOKORLAR YETISHTIRISH",
        "TALABA VA SHIFOKORLARNI ZAMONAVIY VA ISBOTLI TIBBIYOT BILAN\nTO’LAQONLI TANISHTIRISH",
        "NAZARIY VA AMALIY BILIMLARNI BIRGALIKDA UYG’UNLASHTIRA OLISHNI\nO’RGATISH",
        "HAR BIR BEMORGA O’Z YAQINI SIFATIDA INDIVIDUAL YONDASHUVNI\nO’RGATISH",
        "TIBBIYOT TALABASI VA SHIFOKORLARDAGI HAR QANDAY MUOMMOLARIGA\nBARHAM BERISH"
    ];

    return (
        <section id="services" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
                    <div className="space-y-6 reveal relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            TibMentor haqida!
                        </h2>

                        <div className="space-y-5">
                            <p className="text-[15px] font-bold text-slate-800 leading-relaxed border-l-4 border-primary pl-4">
                                “TibMentor” tibbiy platformasi 2021-yildan buyon o‘z faoliyatlarini olib bormoqda. Shu kungacha biz 10000 dan ziyod bo‘lgan talaba va shifokorlarni o‘qitib keldik. Bizda o’z ustida ishlaydigan shifokor va talabalar doimo yangi bilimlar olib kelishmoqda! Bizning talabalar turli xil davlat va xususiy shifoxonalarda malakali mutaxassis bo‘lib ishlab kelishmoqda.
                            </p>
                            <p className="text-[15px] font-medium text-slate-600 leading-relaxed pl-5">
                                Shuningdek, ularning turli xalqaro hamda milliy olimpiadalarda faxrli o‘rinlarni egallab kelayotganlari diqqatga sazovordir. Bizning kurslarimizdagi barcha manbalar xalqaro darajadagi ma’lumotlar asosiga tuzilgan va O’zbekiston muhitiga moslashtirilgan. Kurs davomida nafaqat bilim, balki ustoz shifokorlar tomonidan amaliy tayyor instrumentlar va shablonlarni qo‘lga kiritasiz.
                            </p>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
                                <Star className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors duration-300 group-hover:scale-110" size={64} />
                                <p className="text-[15px] font-medium text-slate-600 leading-relaxed relative z-10">
                                    Kurs davomida nafaqat O’zbekiston va qo‘shni davlatlardan yig‘ilgan shifokor va talabalar bilan networking qilish imkoniyati ham mavjud bo‘ladi! Jamoa tarkib topishdan asosiy maqsadlaridan biri O’zbekiston tibbiyotini yangi darajaga olib chiqishdir! Biz buni bizning eng ustuvor vazifamiz deb bilamiz!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5 reveal">
                        {rightGoals.map((goal, index) => (
                            <div key={index} className="flex items-start gap-4 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                                <div className="mt-0.5 w-6 h-6 rounded-lg bg-white shadow-sm text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="whitespace-pre-line text-[15px] font-bold text-slate-800 leading-relaxed">
                                    {goal}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch reveal">
                    {/* Feedback Card */}
                    <div className="relative group overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/20 flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative z-10 flex-grow">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
                                <Star className="text-primary fill-primary" size={32} />
                            </div>
                            <h3 className="text-4xl font-black mb-4">Feedback</h3>
                            <p className="text-white/60 text-lg font-medium mb-8 leading-relaxed">
                                Minglab talabalar va shifokorlarning samimiy fikrlari bilan telegram kanalimizda tanishing.
                            </p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <a
                                href="https://t.me/imedteam_feedback"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 py-5 px-10 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-primary/20 w-fit"
                            >
                                Fikrlarni o‘qish
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Books Card */}
                    <div className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-primary/20 transition-all duration-500 flex flex-col">
                        <div className="relative z-10 flex-grow">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <BookOpen className="text-primary" size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-6">Mualliflik Kitoblarimiz</h3>
                            <div className="grid gap-4 mb-10">
                                {books.map((book, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600 font-bold group/item">
                                        <div className="w-2 h-2 bg-primary/20 rounded-full group-hover/item:bg-primary group-hover/item:scale-125 transition-all"></div>
                                        {book}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <a
                                href="https://t.me/manager_iMedteam"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 py-5 px-10 rounded-2xl bg-slate-900 text-white font-black hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-900/10 w-fit"
                            >
                                Buyurtma berish
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
