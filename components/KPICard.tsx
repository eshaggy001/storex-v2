import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  badgeText?: string;
  badgeColor?: string;
  icon: string;
  colorClass?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  dark?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  trendUp,
  badgeText,
  badgeColor,
  icon,
  colorClass,
  iconBgClass,
  iconColorClass,
  dark
}) => {
  const finalIconBg = iconBgClass || colorClass || 'bg-slate-50';

  let finalIconColor = iconColorClass;
  if (!finalIconColor) {
    if (colorClass === 'bg-white') finalIconColor = 'text-slate-900';
    else if (colorClass && colorClass.includes('lime')) finalIconColor = 'text-black';
    else finalIconColor = 'text-white';
  }

  const showBadge = !!badgeText || !!trend;
  const finalBadgeText = badgeText || trend;
  const finalBadgeColor = badgeColor || (trendUp ? 'bg-[#EDFF8C]/30 text-[#8ba200]' : 'bg-rose-50 text-rose-600');

  return (
    <div className={`${dark ? 'bg-dark text-white' : 'bg-white text-dark'} p-8 rounded-super border ${dark ? 'border-white/5 shadow-2xl' : 'border-dark/5 shadow-soft'} hover:shadow-xl transition-all duration-500 group relative overflow-hidden`}>
      {/* Background subtle decoration */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${dark ? 'bg-white' : 'bg-lime'}`}></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${finalIconBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
          <i className={`fa-solid ${icon} text-xl ${finalIconColor}`}></i>
        </div>
        {showBadge && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${finalBadgeColor} text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group-hover:px-4 shadow-sm border border-black/5`}>
            {trendUp !== undefined && (
              <i className={`fa-solid ${trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} scale-90`}></i>
            )}
            {finalBadgeText}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className={`${dark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold tracking-[0.15em] uppercase mb-2`}>{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold tracking-tighter transition-all duration-500 group-hover:translate-x-1">{value}</h3>
          {trend && !badgeText && (
            <span className={`text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trendUp ? '+' : ''}{trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;