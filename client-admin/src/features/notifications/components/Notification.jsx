import { useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  ArrowDownCircle,
  ArrowRightLeft,
  AlertTriangle,
  Tag,
  ShieldAlert,
  Info,
  X,
} from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore.js';
import { formatDate } from '../../../shared/utils/formatters.js';

const TYPE_CONFIG = {
  DEPÓSITO: {
    icon: ArrowDownCircle,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-400',
  },
  TRANSFERENCIA_ENVIADA: {
    icon: ArrowRightLeft,
    bg: 'bg-gold/10',
    iconColor: 'text-gold',
    dot: 'bg-gold-400',
  },
  TRANSFERENCIA_RECIBIDA: {
    icon: ArrowRightLeft,
    bg: 'bg-amber-100',
    iconColor: 'text-orange',
    dot: 'bg-amber-400',
  },
  PRODUCTO: {
    icon: Tag,
    bg: 'bg-main-blue/90',
    iconColor: 'text-main-blue',
    dot: 'bg-main-blue/90',
  },
  DEFAULT: {
    icon: Info,
    bg: 'bg-gray-50',
    iconColor: 'text-gray-400',
    dot: 'bg-gray-400',
  },
};

const getTypeConfig = (type = '') => TYPE_CONFIG[type] ?? TYPE_CONFIG.DEFAULT;

const NotificationItem = ({ notification, onMarkRead }) => {
  const cfg = getTypeConfig(notification.type);
  const Icon = cfg.icon;
  const isUnread = !notification.read;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-4 transition-colors duration-150 cursor-pointer hover:bg-gray-50 ${
        isUnread ? 'bg-orange-50/40' : ''
      }`}
      onClick={() => isUnread && onMarkRead(notification._id)}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${cfg.bg}`}
      >
        <Icon size={17} className={cfg.iconColor} />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <p
            className={`text-sm leading-snug break-words ${
              isUnread ? 'font-semibold text-[#032340]' : 'font-medium text-gray-700'
            }`}
          >
            {notification.title}
          </p>
          {isUnread && <span className={`flex-shrink-0 w-2 h-2 rounded-full ${cfg.dot}`} />}
        </div>

        <p className='text-xs text-gray-500 mt-1 leading-relaxed break-words'>
          {notification.message}
        </p>
        <p className='text-[11px] text-gray-400 mt-1'>{formatDate(notification.createdAt)}</p>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
    <div className='w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3'>
      <Bell size={24} className='text-gray-300' />
    </div>
    <p className='text-sm font-medium text-gray-500'>Sin notificaciones</p>
    <p className='text-xs text-gray-400 mt-1'>Aquí aparecerán tus alertas y movimientos.</p>
  </div>
);

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className='absolute right-0 mt-2 w-80 sm:w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden'
    >
      <div className='flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100'>
        <h3 className='text-sm font-bold text-[#032340]'>Notificaciones</h3>
        <div className='flex items-center gap-2 shrink-0'>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className='flex items-center gap-1 text-xs font-semibold text-[#F28C00] hover:text-orange-600 transition-colors'
            >
              <CheckCheck size={13} />
              Marcar todas como leídas
            </button>
          )}
          <button
            onClick={onClose}
            className='p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className='overflow-y-auto max-h-[420px] divide-y divide-gray-50'>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='w-6 h-6 border-2 border-[#F28C00] border-t-transparent rounded-full animate-spin' />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onMarkRead={markAsRead} />
          ))
        )}
      </div>
    </div>
  );
};
