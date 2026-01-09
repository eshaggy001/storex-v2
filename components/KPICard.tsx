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
  // Determine final classes with backward compatibility
  const finalIconBg = iconBgClass || colorClass || 'bg-slate-50';
  
  // Try to determine text color if not explicitly provided
  let finalIconColor = iconColorClass;
  if (!finalIconColor) {
    if (colorClass === 'bg-white') finalIconColor = 'text-slate-900';
    else if (colorClass && colorClass.includes('lime')) finalIconColor = 'text-black';
    else finalIconColor = 'text-white';
  }

  // Determine badge content
  const showBadge = !!badgeText || !!trend;
  const finalBadgeText = badgeText || trend;
  const finalBadgeColor = badgeColor || (trendUp ? 'bg-[#EDFF8C] text-black' : 'bg-rose-100 text-rose-600 shadow-sm');

  return (
    <div className={`${dark ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'} p-8 rounded-[2.5rem] border ${dark ? 'border-white/5' : 'border-slate-100'} shadow-sm hover:shadow-xl transition-all duration-500 group font-['Manrope']`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-[1.25rem] ${finalIconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
          <i className={`fa-solid ${icon} text-xl ${finalIconColor}`}></i>
        </div>
        {showBadge && (
          <div className="text-right">
            <span className={`text-[12px] font-medium px-3 py-1.5 rounded-full ${finalBadgeColor}`}>
              {trendUp !== undefined && (
                <i className={`fa-solid ${trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              )}
              {finalBadgeText}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className={`${dark ? 'text-slate-400' : 'text-slate-500'} text-[12px] font-medium tracking-wider uppercase leading-none`}>{label}</p>
        <h3 className="text-2xl font-bold mt-2 tracking-tight leading-none">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;