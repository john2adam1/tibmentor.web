'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isVideoUrl } from '@/lib/utils';

interface Banner {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    link_url?: string;
}

interface BannerSliderProps {
    banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    if (!banners || banners.length === 0) return null;

    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl shadow-soft transition-all duration-500 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out h-auto md:h-[220px] lg:h-[250px]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="w-full flex-shrink-0 flex flex-col md:block md:relative h-full cursor-pointer bg-white md:bg-transparent"
                        onClick={() => banner.link_url && window.open(banner.link_url, '_blank')}
                    >
                        {/* Media Container */}
                        <div className="relative w-full aspect-[16/8] md:absolute md:inset-0 md:aspect-auto h-auto md:h-full overflow-hidden">
                            {banner.image_url ? (
                                isVideoUrl(banner.image_url) ? (
                                    <video
                                        src={banner.image_url}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={banner.image_url}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600/0B1D4F/31D0FC?text=TIBMENTOR';
                                        }}
                                    />
                                )
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
                            )}
                        </div>

                        {/* Content Container */}
                        <div className="relative md:absolute md:inset-0 p-4 md:p-6 flex flex-col justify-end items-start pointer-events-none">
                            <div className="max-w-sm w-full bg-slate-50 md:bg-black/30 md:backdrop-blur-md rounded-2xl p-4 border border-gray-100 md:border-white/10 shadow-soft md:shadow-lg pointer-events-auto transform transition-transform duration-300 hover:scale-[1.02]">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg">
                                        Yangi e'lon
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-gray-900 md:text-white leading-tight drop-shadow-sm">
                                        {banner.title}
                                    </h2>
                                    {banner.description && (
                                        <p className="text-gray-500 md:text-white/90 text-xs md:text-sm font-medium leading-snug line-clamp-2 drop-shadow-sm">
                                            {banner.description}
                                        </p>
                                    )}
                                    {banner.link_url && (
                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-2 text-primary md:text-white font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
                                                Batafsil <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
