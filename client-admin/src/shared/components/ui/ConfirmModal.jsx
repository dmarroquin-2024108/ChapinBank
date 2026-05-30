import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const confirmStyles =
    variant === 'danger'
      ? 'bg-orange hover:bg-[#c07018] text-white'
      : 'bg-orange hover:bg-[#c07018] text-white';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4 animate-fadeIn'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0'>
            <AlertTriangle size={18} className='text-orange-500' />
          </div>
          <h2 className='text-base font-bold text-[#0d1f35]'>{title}</h2>
        </div>

        {description && <p className='text-sm text-gray-500 leading-relaxed'>{description}</p>}

        <div className='flex justify-end gap-2 pt-1'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer'
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer ${confirmStyles}`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
