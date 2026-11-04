'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notificationService } from '@/services';
import { UserNotification } from '@/types/mobile-api';
import { CheckCheck, Inbox, Calendar } from 'lucide-react';
import { pathForPushData } from '@/lib/push-routing';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params = filter === 'unread' ? { is_read: false } as any : undefined;
      const response = await notificationService.getNotifications(params);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
        <p className="text-gray-400 font-bold animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Bildirishnomalar</h1>
          <p className="text-lg text-gray-400 font-medium">Barcha muhim xabarlar va yangiliklar bir joyda.</p>
        </div>

        {/* Filter Selector */}
        <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1 shadow-inner h-fit border border-gray-100 w-full sm:w-80">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 tracking-tight
                      ${filter === 'all'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 tracking-tight
                      ${filter === 'unread'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            O'qilmagan
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-gray-100 p-24 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-8">
            <Inbox className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-gray-400 text-xl font-bold">
            {filter === 'unread' ? "O'qilmagan xabarlar yo'q" : "Hozircha xabarlar yo'q"}
          </p>
          <p className="text-gray-300 text-sm mt-2 font-medium">Yangi xabarlar kelishi bilan birinchi bo'lib senga xabar beramiz.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (notification.type) {
                  router.push(pathForPushData({
                    type: notification.type,
                    course_id: notification.course_id,
                  }));
                }
              }}
              className={`bg-white p-8 rounded-2xl border border-gray-100 transition-all duration-500 hover:shadow-premium group relative overflow-hidden
                ${notification.type ? 'cursor-pointer' : ''}
                ${!notification.is_read ? 'ring-2 ring-primary/5 shadow-soft border-primary/10' : 'opacity-80'}`}
            >
              {!notification.is_read && (
                <div className="absolute top-0 right-0 w-3 h-full bg-primary/10"></div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                <div className="space-y-3 flex-1">
                  <h3 className={`text-2xl font-black tracking-tight leading-tight ${!notification.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-base font-medium leading-relaxed max-w-3xl ${!notification.is_read ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 pt-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      <Calendar size={12} />
                      {formatDate(notification.created_at)}
                    </div>
                    {!notification.is_read && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-full tracking-widest shadow-md shadow-primary/20">
                        Yangi
                      </div>
                    )}
                  </div>
                </div>

                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="self-end sm:self-start px-5 py-3 bg-slate-50 text-gray-400 rounded-2xl font-bold text-xs hover:bg-primary-tint hover:text-primary transition-all flex items-center gap-2 group/btn"
                  >
                    <CheckCheck size={16} className="group-hover/btn:scale-110 transition-transform" />
                    O'qilgan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
