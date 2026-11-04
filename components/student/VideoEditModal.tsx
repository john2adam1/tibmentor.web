'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { sourceService } from '@/services/source';
import { SourceMobile } from '@/types/mobile-api';
import toast from 'react-hot-toast';
import { Upload, Youtube, ExternalLink, Save, Loader2 } from 'lucide-react';

interface VideoEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: SourceMobile;
    onSuccess: () => void;
}

export default function VideoEditModal({
    isOpen,
    onClose,
    video,
    onSuccess
}: VideoEditModalProps) {
    const [name, setName] = useState(video.name);
    const [url, setUrl] = useState(video.url);
    const [videoUrl, setVideoUrl] = useState(video.video_url || '');
    const [file, setFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await sourceService.updateSource(video.id, {
                id: video.id,
                name,
                url,
                video_url: videoUrl,
                file: file || undefined
            });
            toast.success('Muvaffaqiyatli saqlandi');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Saqlashda xatolik yuz berdi');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Videoni tahrirlash"
            className="max-w-xl"
        >
            <form onSubmit={handleSave} className="space-y-6">
                {/* Video Name */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Video nomi</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-900 transition-all outline-none"
                        placeholder="Masalan: 1-qism: Kirish"
                        required
                    />
                </div>

                {/* YouTube URL */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Youtube size={14} className="text-red-500" /> YouTube Link
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-900 transition-all outline-none"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-[10px] text-gray-400 font-medium italic">
                        YouTube linki orqali videoni avtomatik yuklashga uriniladi.
                    </p>
                </div>

                {/* Server Video URL */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <ExternalLink size={14} className="text-primary" /> Server Link (video_url)
                    </label>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-900 transition-all outline-none"
                        placeholder="https://server.com/video.mp4"
                    />
                    <p className="text-[10px] text-gray-400 font-medium italic">
                        Agar YouTube yuklash muvaffaqiyatsiz bo'lsa, bu yerga to'g'ridan-to'g'ri bog'lanma bering.
                    </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Upload size={14} /> Video faylini yuklash
                    </label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full px-6 py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-gray-100 group-hover:border-primary/20'}`}>
                            {file ? (
                                <>
                                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mb-2">
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 line-clamp-1">{file.name}</span>
                                    <span className="text-[10px] text-primary font-black uppercase mt-1">Almashtirish uchun bosing</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-slate-100 text-gray-400 group-hover:text-primary transition-colors rounded-xl flex items-center justify-center mb-2">
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Faylni tanlang</span>
                                    <span className="text-[10px] text-gray-300 font-medium mt-1">MP4, WebM formatlari tavsiya etiladi</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 px-6 border border-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-4 px-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Saqlanmoqda...
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Saqlash
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
