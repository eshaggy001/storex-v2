import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# 1. Update Translations
# Add updated translations for add product prompt
mn_replace_target = '            connectChannels: "Суваг холбох",'
mn_replacement = """            connectChannels: "Суваг холбох",
            buildCatalogue: "Бараагаа бүртгүүлэх",
            productDesc: "Бүтээгдэхүүнээ нэмээд борлуулалтаа эхлүүлээрэй.",
            addProduct: "Шинэ бараа нэмэх","""

en_replace_target = '          connectChannels: "Connect Channels",'
en_replacement = """          connectChannels: "Connect Channels",
          buildCatalogue: "Build Your Catalogue",
          productDesc: "Add your first product to start generating sales.",
          addProduct: "Add First Product","""

# Replace text
text = text.replace(mn_replace_target, mn_replacement)
text = text.replace(en_replace_target, en_replacement)

# 2. Update Conditional Logic
# Current check for AI card footer: {hasNoChannels ? ...
# User wants "Add First Product" INSTEAD of social connect here.
# But logically, IS "no products" the right condition?
# If I have NO products, I should definitely add product first.
# If I have products but NO channels, I should connect channels.
# User explicitly said "social connect-iin orond" (instead of social connect), "add first product bolgii" (make it add first product).
# So I will prioritize `products.length === 0`.

# I will assume `products` is available in scope (it is, from props).

# I will replace the condition `{hasNoChannels ?` with `{products.length === 0 ?`.
# And I will replace the UI block inside with the new "Add Product" UI.

# Step 2a: Replace condition
text = text.replace('{hasNoChannels ? (', '{products.length === 0 ? (')

# Step 2b: Replace UI Block
# I'll search for the block I added previously (the social block)
# It starts with `<div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10 overflow-hidden group/social">`

target_ui_start = '<div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10 overflow-hidden group/social">'
target_ui_end = '                  </div>'

# I'll enable regex mode for replacement or just construct the string again carefully.
# Since I know I just wrote it, I can identify it by unique strings.

# Social block content has "group/social" and "fa-instagram"
start_idx = text.find('group/social')
# We need to find the start of the div containing 'group/social'
# It should be a few lines up.
inner_start_idx = text.rfind('<div', 0, start_idx) 
# and end of the block...
inner_end_idx = text.find('{/* Background Glow */}', start_idx) # wait, background glow is inside.

# Let's replace the whole block between the condition and the else.
condition_start = '{products.length === 0 ? (' # We already renamed it above in string
cond_idx = text.find(condition_start)
else_idx = text.find(') : (', cond_idx)

# New UI Content for Add Product
new_product_ui = """                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-12 bg-white/5 backdrop-blur-md p-6 rounded-card border border-white/10 overflow-hidden group/product">
                     {/* Background Glow */}
                     <div className="absolute top-1/2 left-10 w-32 h-32 bg-lime/20 rounded-full blur-3xl -translate-y-1/2 group-hover/product:bg-lime/30 transition-all duration-700"></div>

                     <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                        {/* Product Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime to-emerald-500 flex items-center justify-center text-dark text-3xl shadow-lg border-[3px] border-dark ring-2 ring-white/10 z-10 group-hover/product:scale-110 transition-transform duration-500">
                           <i className="fa-solid fa-box-open"></i>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-1.5 max-w-sm">
                           <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                              {t.setup.buildCatalogue}
                              <i className="fa-solid fa-plus text-lime animate-pulse"></i>
                           </h4>
                           <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                              {t.setup.productDesc}
                           </p>
                        </div>
                     </div>

                     <button
                        onClick={() => onNavigate('products')}
                        className="w-full md:w-auto btn-primary !rounded-2xl !bg-white !text-dark hover:!bg-lime hover:shadow-[0_0_20px_rgba(237,255,140,0.4)] relative z-10 group/btn"
                     >
                        <span className="uppercase text-[11px] tracking-widest font-bold">{t.setup.addProduct}</span>
                        <i className="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                     </button>
                  </div>"""

if cond_idx != -1 and else_idx != -1:
    # Slice and dice
    text = text[:cond_idx + len(condition_start)] + '\n' + new_product_ui + '\n               ' + text[else_idx:]
else:
    print("Could not find condition block to replace")

with open(path, 'w') as f:
    f.write(text)
