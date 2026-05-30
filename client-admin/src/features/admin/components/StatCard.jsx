const COLOR_MAP = {
  dark: 'bg-main-blue text-white',
  orange: 'bg-orange text-white',
  gold: 'bg-gold text-white',
};

export const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div
    className={`rounded-2xl p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 min-h-[120px] ${COLOR_MAP[color]}`}
  >
    <div className='flex items-start justify-between gap-2 sm:gap-3'>
      <p className='text-[9px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest leading-tight flex-1 min-w-0'>
        {title}
      </p>
      {Icon && (
        <div className='w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center shrink-0'>
          <Icon size={14} className='sm:w-[18px] sm:h-[18px]' />
        </div>
      )}
    </div>
    <p className='text-base sm:text-3xl font-bold leading-tight break-words'>{value ?? '—'}</p>
    {subtitle && <p className='text-[10px] sm:text-xs opacity-90 leading-tight'>{subtitle}</p>}
  </div>
);
