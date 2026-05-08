const COLOR_MAP = {
    dark:"bg-[#0d1f35] text-white",
    orange:"bg-orange text-white",
    green:"bg-[#1a6b4a] text-white",
    purple:"bg-[#6b21a8] text-white",
};

export const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${COLOR_MAP[color]}`}>
        <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{title}</p>
            {Icon && (
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                </div>
            )}
        </div>
        <p className="text-3xl font-bold leading-none">{value ?? "—"}</p>
        {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
    </div>
);