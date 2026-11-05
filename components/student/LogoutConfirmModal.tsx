'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** "Chiqishni istaysizmi?" confirmation, shared by Profile and Sidebar. */
export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hisobdan chiqish" className="max-w-md">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <LogOut size={36} />
                </div>
                <div className="space-y-2">
                    <p className="text-slate-900 font-black text-xl leading-tight tracking-tight">
                        Chiqishni istaysizmi?
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                        Hisobingizdan chiqasiz. Qayta kirish uchun login qilishingiz kerak bo‘ladi.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98]"
                    >
                        Ha, chiqish
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                    >
                        Yo‘q, qolish
                    </button>
                </div>
            </div>
        </Modal>
    );
}
