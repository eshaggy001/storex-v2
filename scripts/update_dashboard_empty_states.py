import os

path = '/Users/sandagenkhbaatar/antigravity/storex-v2/components/DashboardOverview.tsx'
with open(path, 'r') as f:
    text = f.read()

# Empty State for Recent Messages
messages_empty_state = """                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                     {conversations.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                              <i className="fa-solid fa-comments text-3xl"></i>
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900">No messages yet</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Connect a channel to start</p>
                           </div>
                           <button onClick={() => onNavigate('settings')} className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Connect Social</button>
                        </div>
                     ) : (
                        conversations.slice(0, 5).map(c => ("""

text = text.replace('                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">\n                     {conversations.slice(0, 5).map(c => (', messages_empty_state)
text = text.replace('                     ))}\n                  </div>', '                     ))}\n                     {conversations.length > 0 && <div className="h-2 w-full"></div>}\n                  </div>')

# Empty State for Top Products
products_empty_state = """                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                     {topProducts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                              <i className="fa-solid fa-box-open text-3xl"></i>
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900">Catalogue is empty</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add products to see rankings</p>
                           </div>
                           <button onClick={() => onNavigate('products')} className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg">Add Product</button>
                        </div>
                     ) : (
                        topProducts.map((product, i) => ("""

text = text.replace('                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">\n                     {topProducts.map((product, i) => (', products_empty_state)

with open(path, 'w') as f:
    f.write(text)
