import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []
skip = 0
for i, line in enumerate(lines):
    if skip > 0:
        skip -= 1
        continue
    
    # Revenue Card
    if 'label={t.revenue}' in line and 'KPICard' in lines[i-1]:
        new_lines.pop() # Remove previous line <KPICard
        new_lines.append('             <KPICard\n')
        new_lines.append('                label={t.revenue}\n')
        new_lines.append('                value={`${metrics.revenue.toLocaleString()}₮`}\n')
        new_lines.append('                trend={metrics.revenue > 0 ? "24.5%" : undefined}\n')
        new_lines.append('                trendUp={metrics.revenue > 0 ? true : undefined}\n')
        new_lines.append('                badgeText={metrics.revenue === 0 ? t.setup.configurePayments : undefined}\n')
        new_lines.append('                badgeColor="bg-indigo-50 text-indigo-600"\n')
        new_lines.append('                icon="fa-money-bill-wave"\n')
        new_lines.append('                iconBgClass="bg-emerald-50"\n')
        new_lines.append('                iconColorClass="text-emerald-600"\n')
        new_lines.append('             />\n')
        skip = 8 # Skip original lines
        continue

    # Chat Orders Card
    if 'label={t.chatOrders}' in line and 'KPICard' in lines[i-1]:
        new_lines.pop()
        new_lines.append('             <KPICard\n')
        new_lines.append('                label={t.chatOrders}\n')
        new_lines.append('                value={metrics.total}\n')
        new_lines.append('                badgeText={metrics.total === 0 ? t.setup.addProduct : `${metrics.conversionRate}% CR`}\n')
        new_lines.append('                badgeColor={metrics.total === 0 ? "bg-[#EDFF8C]/30 text-black border border-[#EDFF8C]/50" : "bg-slate-950 text-white"}\n')
        new_lines.append('                icon="fa-cart-shopping"\n')
        new_lines.append('                iconBgClass="bg-slate-50"\n')
        new_lines.append('                iconColorClass="text-slate-900"\n')
        new_lines.append('             />\n')
        skip = 8
        continue

    # Handled By AI Card
    if 'label={t.handledByAi}' in line and 'KPICard' in lines[i-1]:
        new_lines.pop()
        new_lines.append('             <KPICard\n')
        new_lines.append('                label={t.handledByAi}\n')
        new_lines.append('                value={metrics.aiCount}\n')
        new_lines.append('                trend={metrics.aiCount > 0 ? "12%" : undefined}\n')
        new_lines.append('                trendUp={metrics.aiCount > 0 ? true : undefined}\n')
        new_lines.append('                badgeText={hasNoChannels ? t.setup.connectSocial : undefined}\n')
        new_lines.append('                badgeColor="bg-indigo-50 text-indigo-600"\n')
        new_lines.append('                icon="fa-robot"\n')
        new_lines.append('                iconBgClass="bg-indigo-50"\n')
        new_lines.append('                iconColorClass="text-indigo-600"\n')
        new_lines.append('             />\n')
        skip = 8
        continue

    # Pending Action Card
    if 'label={t.pendingAction}' in line and 'KPICard' in lines[i-1]:
        new_lines.pop()
        new_lines.append('             <KPICard\n')
        new_lines.append('                label={t.pendingAction}\n')
        new_lines.append('                value={metrics.pending}\n')
        new_lines.append('                badgeText={metrics.pending === 0 ? (isSetupMode ? t.setup.activation : t.allGood) : t.needsConfirm}\n')
        new_lines.append('                badgeColor={metrics.pending === 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}\n')
        new_lines.append('                icon="fa-receipt"\n')
        new_lines.append('                iconBgClass="bg-rose-50"\n')
        new_lines.append('                iconColorClass="text-rose-600"\n')
        new_lines.append('             />\n')
        skip = 8
        continue

    new_lines.append(line)

with open(path, 'w') as f:
    f.writelines(new_lines)
