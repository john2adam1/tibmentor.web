"use client";
import { useState } from "react";

export default function Team() {
    const [showAll, setShowAll] = useState(false);
    const VISIBLE_COUNT = 6;

    const teamMembers = [
        {
            name: "Himmatulloh Rahmatov",
            role: "Asoschi",
            desc: "“TibMentor” platformasi asoschisi. Farg’ona Shahar Bolalar Shifoxonasi. 3 yillik tajribaga ega Pediatr shifokor. “TibMentor” da pediatriya fani bo’yicha ma’ruzachi.",
            img: "/assets/himmatulloh.png"
        },
        {
            name: "Ulug’bek Mahmudov",
            role: "Ma'ruzachi",
            desc: "Farg‘ona tibbiyot instituti, endokrinologiya kafedrasi assistenti va tayanch doktaranti. Toshkent shahar endokrinologiya markazida onlayn diabet maktabi mudiri.",
            img: "/assets/ulugbekmahmudov.jpg"
        },
        {
            name: "Bekjon Sattarov",
            role: "Ma'ruzachi",
            desc: "TTA radiologiya kafedrasida assistenti. 5 yillik ish tajribaga ega. Hozirda Janubiy Koreyaning Yonsei Cancer Centerida amaliyotda.",
            img: "/assets/bekjonsattarov.jpg"
        },
        {
            name: "Mirzahamid Mirzalatipov",
            role: "Ma'ruzachi",
            desc: "Farg’ona shahar “Bolajon” klinikasi LOR jarroh shifokori. 4 yillik tajribaga ega. “TibMentor” da LOR fani ma’ruzachisi.",
            img: "/assets/mirzahamidmirzapolatov.jpg"
        },
        {
            name: "Doniyor Yakubov",
            role: "Ma'ruzachi",
            desc: "FJSTI gospital xirurgiya kafedrasi assistenti. “MDM clinic” urolog shifokori. 4 yillik ish tajriba. “TibMentor” da urologiya fani ma’ruzachisi",
            img: "/assets/doniyoryakubov.jpg"
        },
        {
            name: "Rasuljon Xolmatov",
            role: "Ma'ruzachi",
            desc: "ADTI klinikasi nevrologiya bo'limi. ADTI Nevrologiya kafedrasi assistenti va tayanch doktoranti. Ish tajribasi 8 yil.",
            img: "/assets/rasuljonxolmatov.jpg"
        },
        {
            name: "Zohidjon Zaylobiddinov",
            role: "IT mutaxassisi",
            desc: "Toshkent Davlat Tibbiyot Universiteti bakalavr talabasi. 1 yildan buyon TibMentor jamoasida mobil ilova, website qurish va ularni ishini tashkillashtirish ishlarini boshqarib keladi.",
            img: "/assets/zohidjon.jpg"
        },
        {
            name: "Mahliyo Rashidova",
            role: "Ma'ruzachi",
            desc: "“TibMentor” jamoasi a'zosi va Tibbiy radiolog, uzist 8 yillik ish tajribaga ega. ADTI Tibbiy radiologiya kafedrasi assitenti va doktaranti. “Onko-med” xususiy shifoxonasida shifokor uzist bo’lib ishlab kelmoqda. Ko’plab xalqaro davlatlarda tajriba orttirgan. “TibMentor” platformasi UTT va boshqa radiologik kurslar ma’ruzachisi",
            img: "/assets/mahliyorashidova.jpg"
        },
        {
            name: "Muhammadqodir Arabboyev",
            role: "Ma'ruzachi",
            desc: "TibMentor jamoasi a'zosi va “TibMentor” platformasi urologiya kursi o’qituvchisi. Central Asian Medical University Urologiya yoʻnalishi magistratranti. Qoʻshtepa Tuman Poliklinika Shifokori",
            img: "/assets/muhammadqodirarabboyev.jpg"
        },
        {
            name: "Nilufar Mamadaliyeva",
            role: "Ma'ruzachi",
            desc: "“TibMentor” jamoasi a'zosi va “TibMentor” fiziologiya kursi o’qituvchisi. FJSTI bituruvchi kurs talabasi.",
            img: "/assets/nilufarmamadaliyeva.png"
        },
        {
            name: "Rahmonqul Namozov",
            role: "Ma'ruzachi",
            desc: "“TibMentor” jamoasi a'zosi va Surxondaryo Viloyat Koʻp Tarmoqli Tibbiyot Markazi Nefrologiya-Gemodializ boʻlimida ishlayman. “TibMentor” platformasi Nefrologiya kursi lektori.",
            img: "/assets/rahmonqulnomozov.jpg"
        },
        {
            name: "Sardorbek Mamurov",
            role: "Ma'ruzachi",
            desc: "“TibMentor” jamoasi a'zosi va Namangan viloyati “Mamura Shifo” klinikasi revmatologi. “TibMentor” platformasi revmatologiya kursi lektori. Medical English kitobi va patologiya darsliklari muallifi.",
            img: "/assets/sardorbekmamurov.JPG"
        },
        {
            name: "Ulugbek Zaylobidinov",
            role: "Ma'ruzachi",
            desc: "“TibMentor” jamoasi a'zosi va tajribali mutaxassis shifokor.",
            img: "/assets/ulugbekzaylobidinov.png"
        },
        {
            name: "Hikmatillayev Diyorbek",
            role: "Ma'ruzachi",
            desc: "“TibMentor” platformasi  anatomiya fani o’qituvchisi.  Farmed klinikasi navbatchi travmatolog-ortopedi.",
            img: "/assets/umarbekhikmatillayev.jpg"
        },
        {
            name: "Yuldosheva Mohichehra",
            role: "Ma'ruzachi",
            desc: "“TibMentor” platformasi pediatriya kursi o’qituvchisi.",
            img: "/assets/yuldoshevamohichehra.jpg"
        },
        {
            name: "Behzod Madaminov",
            role: "Ma'ruzachi",
            desc: "“TibMentor” platformasi o’quv bo’limi product manageri. Preklinik Patologiya fanlari, Biokimyo, Fiziologiya, Nevrologiya kabi fanlarni va Gematologiya, Kardiologiya, Qon-Tomir patologiyasi kitobi muallifi. Hozirda Germaniyada Neyrojarrohlik bo’yicha o’qishni davom ettirmoqda.",
            img: "/assets/behzodmadaminov.jpg"
        },
        {
            name: "Elyor Fayzullayev",
            role: "Ma'ruzachi",
            desc: "Kardiolog shifokor. Tez tibbiy yordam shifokori. \"TibMentor\" platformasida Tez tibbiy yordam fanidan lektor va Klinik Laborator diagnostika fanidan lektor.",
            img: "/assets/elyorfayzulla.png"
        }
    ];

    return (
        <section id="team" className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                        “TibMentor” jamoasi
                    </h2>
                    <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                        Bizda shifokorlik va ustozlik mahoratiga ega bo’lgan, yetarli tajribaga ega bo’lgan TOP ustoz shifokorlar dars o’tishadi!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.slice(0, showAll ? teamMembers.length : VISIBLE_COUNT).map((member, idx) => (
                        <div
                            key={idx}
                            className="reveal group bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-900/10 border border-white/5 hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 text-center"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-primary/20 rounded-full rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                                <div className="absolute inset-0 bg-slate-800 rounded-full overflow-hidden border-2 border-white/10 shadow-sm">
                                    <img
                                        src={member.img + "?v=1"}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=be123c&color=fff' }}
                                    />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {member.name}
                            </h3>

                            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                {member.role}
                            </p>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-4">
                                {member.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {teamMembers.length > VISIBLE_COUNT && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-base hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                        >
                            {showAll ? "Kamroq ko'rish" : `Yana ${teamMembers.length - VISIBLE_COUNT} ta ustozni ko'rish`}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-5 h-5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
