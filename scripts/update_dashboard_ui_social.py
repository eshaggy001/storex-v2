import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# 1. Update Translations
# Add updated translations for social connection prompt
mn_replace_target = '            awaitingData: "Өгөгдөл хүлээж байна",'
mn_replacement = """            awaitingData: "Өгөгдөл хүлээж байна",
            unlockGrowth: "Борлуулалтаа өсгөх",
            socialDesc: "AI таны өмнөөс чатанд хариулж, захиалга бүртгэх болно.",
            connectChannels: "Суваг холбох","""

en_replace_target = '          awaitingData: "Awaiting Data",'
en_replacement = """          awaitingData: "Awaiting Data",
          unlockGrowth: "Unlock AI Growth",
          socialDesc: "Let AI handle your DMs and auto-create orders 24/7.",
          connectChannels: "Connect Channels","""

# Only replace if not already present (checking a known key)
if 'unlockGrowth' not in text:
    text = text.replace(mn_replace_target, mn_replacement)
    text = text.replace(en_replace_target, en_replacement)

# 2. Update the UI Block
# I'll replace the block I added in the previous step with the new design
# Searching for the specific 'fa-lock' icon block to identify the section easily
target_ui_start = '{hasNoChannels ? ('
target_ui_end = ') : ('

# I will construct the new UI block.
# Key features:
# - Instagram and Facebook icons (fa-instagram, fa-facebook)
# - Gradient/color branding for the icons
# - Title and Description from translations
# - "Connect Channels" button

new_ui_block = """                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10 overflow-hidden group/social">
                     {/* Background Glow */}
                     <div className="absolute top-1/2 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 group-hover/social:bg-indigo-500/30 transition-all duration-700"></div>

                     <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                        {/* Social Icons Stack */}
                        <div className="flex -space-x-4">
                           <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-2xl shadow-lg transform -rotate-6 border-[3px] border-dark ring-2 ring-white/10 z-10">
                              <i className="fa-brands fa-instagram"></i>
                           </div>
                           <div className="w-14 h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white text-2xl shadow-lg transform rotate-6 border-[3px] border-dark ring-2 ring-white/10 z-0 group-hover/social:translate-x-2 transition-transform">
                              <i className="fa-brands fa-facebook-f"></i>
                           </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-1.5 max-w-xs">
                           <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                              {t.setup.unlockGrowth}
                              <i className="fa-solid fa-arrow-trend-up text-lime animate-bounce-slow"></i>
                           </h4>
                           <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                              {t.setup.socialDesc}
                           </p>
                        </div>
                     </div>

                     <button
                        onClick={() => onNavigate('settings')}
                        className="w-full md:w-auto btn-primary !rounded-2xl !bg-lime !text-dark hover:shadow-[0_0_20px_rgba(237,255,140,0.4)] relative z-10 group/btn"
                     >
                        <span className="uppercase text-[11px] tracking-widest font-bold">{t.setup.connectChannels}</span>
                        <i className="fa-solid fa-link text-[10px] group-hover/btn:rotate-45 transition-transform"></i>
                     </button>
                  </div>"""

# I need to accurately find the block to replace.
# The previous script replaced 'target_block' with 'new_block'.
# I can search for the start of the block I inserted.
search_start_str = '{hasNoChannels ? ('
search_end_str = ') : ('

start_idx = text.find(search_start_str)
end_idx = text.find(search_end_str, start_idx)

if start_idx != -1 and end_idx != -1:
    # Extract the exact content to replace to avoid any mismatch
    # Adding len(search_start_str) to keep the render condition, removing it effectively replaces the content inside
    
    # Actually, simpler approach: I'll use regex or just string replacement of the inner content if I can match it exactly.
    # But since I know the structure, let's construct the full replacement string.
    
    original_content = text[start_idx + len(search_start_str):end_idx]
    # Verify it looks like what we expect (approximately)
    if 'bg-white/5' in original_content:
        text = text[:start_idx + len(search_start_str)] + '\n' + new_ui_block + '\n               ' + text[end_idx:]

with open(path, 'w') as f:
    f.write(text)
