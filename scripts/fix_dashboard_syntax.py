import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Check if the line is just the start of a KPICard but doesn't have the closing bracket logic
    # The error lines look like:
    # 459:                 iconColorClass="text-emerald-600"
    # 460:              <KPICard
    
    if 'iconColorClass=' in line and '/>' not in line:
        new_lines.append(line)
        new_lines.append('              />\n')
        continue
    
    if 'badgeColor=' in line and 'icon=' not in lines[lines.index(line)+1] and 'chatOrders' in text:
        # This is for the chatOrders card specifically in my previous output
        pass

    new_lines.append(line)

# Let's just rewrite the whole grid part correctly this time to be safe.
# Find the start of the grid
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'KPI Grid & Action Hub' in line:
        start_idx = i + 1
    if start_idx != -1 and 'ACTION HUB (P0)' in line:
        end_idx = i - 1
        break

if start_idx != -1 and end_idx != -1:
    grid_content = [
        '         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">\n',
        '            <KPICard\n',
        '               label={t.revenue}\n',
        '               value={`${metrics.revenue.toLocaleString()}₮`}\n',
        '               trend={metrics.revenue > 0 ? "24.5%" : undefined}\n',
        '               trendUp={metrics.revenue > 0 ? true : undefined}\n',
        '               badgeText={metrics.revenue === 0 ? t.setup.configurePayments : undefined}\n',
        '               badgeColor="bg-indigo-50 text-indigo-600"\n',
        '               icon="fa-money-bill-wave"\n',
        '               iconBgClass="bg-emerald-50"\n',
        '               iconColorClass="text-emerald-600"\n',
        '            />\n',
        '            <KPICard\n',
        '               label={t.chatOrders}\n',
        '               value={metrics.total}\n',
        '               badgeText={metrics.total === 0 ? t.setup.addProduct : `${metrics.conversionRate}% CR`}\n',
        '               badgeColor={metrics.total === 0 ? "bg-[#EDFF8C]/30 text-black border border-[#EDFF8C]/50" : "bg-slate-950 text-white"}\n',
        '               icon="fa-cart-shopping"\n',
        '               iconBgClass="bg-slate-50"\n',
        '               iconColorClass="text-slate-900"\n',
        '            />\n',
        '            <KPICard\n',
        '               label={t.handledByAi}\n',
        '               value={metrics.aiCount}\n',
        '               trend={metrics.aiCount > 0 ? "12%" : undefined}\n',
        '               trendUp={metrics.aiCount > 0 ? true : undefined}\n',
        '               badgeText={hasNoChannels ? t.setup.connectSocial : undefined}\n',
        '               badgeColor="bg-indigo-50 text-indigo-600"\n',
        '               icon="fa-robot"\n',
        '               iconBgClass="bg-indigo-50"\n',
        '               iconColorClass="text-indigo-600"\n',
        '            />\n',
        '            <KPICard\n',
        '               label={t.pendingAction}\n',
        '               value={metrics.pending}\n',
        '               badgeText={metrics.pending === 0 ? (isSetupMode ? t.setup.activation : t.allGood) : t.needsConfirm}\n',
        '               badgeColor={metrics.pending === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}\n',
        '               icon="fa-receipt"\n',
        '               iconBgClass="bg-rose-50"\n',
        '               iconColorClass="text-rose-600"\n',
        '            />\n',
        '         </div>\n'
    ]
    
    final_lines = lines[:start_idx] + grid_content + lines[end_idx:]
    with open(path, 'w') as f:
        f.writelines(final_lines)
else:
    print("Could not find Grid indices")
