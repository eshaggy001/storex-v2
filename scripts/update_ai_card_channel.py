import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# 1. Update Mongolian Translations
mn_replace_target = '            awaitingData: "Өгөгдөл хүлээж байна",'
mn_replacement = """            awaitingData: "Өгөгдөл хүлээж байна",
            analyticsUnavailable: "Аналитик харах боломжгүй",
            connectToSee: "IG/FB холбож дата харах","""
text = text.replace(mn_replace_target, mn_replacement)

# 2. Update English Translations
en_replace_target = '          awaitingData: "Awaiting Data",'
en_replacement = """          awaitingData: "Awaiting Data",
          analyticsUnavailable: "Analytics Unavailable",
          connectToSee: "Connect IG/FB to see data","""
text = text.replace(en_replace_target, en_replacement)

# 3. Replace the Chat Log Section with Conditional Logic
# I'll construct a unique part of the existing code to target
target_block = """               <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10">
                  <div className="flex items-center gap-10 w-full md:w-auto">
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{t.revenue} 24H</p>
                        <p className="text-2xl font-bold text-lime tracking-tighter">+{metrics.revenue.toLocaleString()}₮</p>
                     </div>
                     <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
                     <div className="space-y-2">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{t.momentum}</p>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                           <i className="fa-solid fa-arrow-up text-[10px]"></i>
                           <span>+14.2%</span>
                           <span className="text-[9px] text-white/30 font-medium lowercase tracking-normal">vs yesterday</span>
                        </div>
                     </div>
                  </div>

                  <button
                     onClick={() => onNavigate('messages')}
                     className="w-full md:w-auto btn-primary !rounded-2xl !bg-white !text-dark hover:!bg-lime shadow-2xl"
                  >
                     <span className="uppercase text-[11px] tracking-widest font-bold">{t.viewChatLog}</span>
                     <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
               </div>"""

new_block = """               {hasNoChannels ? (
                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10">
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/50">
                           <i className="fa-solid fa-lock text-xl"></i>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.setup.analyticsUnavailable}</p>
                           <p className="text-lg font-bold text-white tracking-tight">{t.setup.connectToSee}</p>
                        </div>
                     </div>

                     <button
                        onClick={() => onNavigate('settings')}
                        className="w-full md:w-auto btn-primary !rounded-2xl !bg-lime !text-dark hover:shadow-lime/20"
                     >
                        <span className="uppercase text-[11px] tracking-widest font-bold">{t.setup.connectSocial}</span>
                        <i className="fa-solid fa-link text-[10px]"></i>
                     </button>
                  </div>
               ) : (
                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10">
                     <div className="flex items-center gap-10 w-full md:w-auto">
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{t.revenue} 24H</p>
                           <p className="text-2xl font-bold text-lime tracking-tighter">+{metrics.revenue.toLocaleString()}₮</p>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{t.momentum}</p>
                           <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                              <i className="fa-solid fa-arrow-up text-[10px]"></i>
                              <span>+14.2%</span>
                              <span className="text-[9px] text-white/30 font-medium lowercase tracking-normal">vs yesterday</span>
                           </div>
                        </div>
                     </div>

                     <button
                        onClick={() => onNavigate('messages')}
                        className="w-full md:w-auto btn-primary !rounded-2xl !bg-white !text-dark hover:!bg-lime shadow-2xl"
                     >
                        <span className="uppercase text-[11px] tracking-widest font-bold">{t.viewChatLog}</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                     </button>
                  </div>
               )}"""

text = text.replace(target_block, new_block)

with open(path, 'w') as f:
    f.write(text)
