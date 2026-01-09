import React, { useState, useEffect } from 'react';
import { Product } from '../types';

type ViewMode = 'card' | 'list';

const ProductList: React.FC<{ products: Product[]; onAddProduct: () => void; onSelectProduct: (product: Product) => void; userLanguage?: 'mn' | 'en' }> = ({ products, onAddProduct, onSelectProduct, userLanguage = 'mn' }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('productViewMode') as ViewMode) || 'card');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    mn: {
      title: "Бүтээгдэхүүн",
      subtitle: "Бараа материалын удирдлага",
      grid: "Хүснэгт",
      list: "Жагсаалт",
      search: "Хайх...",
      addProduct: "Нэмэх",
      notFound: "Бүтээгдэхүүн олдсонгүй",
      notFoundDesc: "Хайлтаа өөрчлөх эсвэл шинээр нэмнэ үү.",
      cols: { product: "Бүтээгдэхүүн", id: "ID", category: "Ангилал", price: "Үнэ", inventory: "Үлдэгдэл", status: "Төлөв" },
      status: { order: "Захиалга", inStock: "Бэлэн", soldOut: "Дууссан" }
    },
    en: {
      title: "Products",
      subtitle: "Manage catalog and inventory levels.",
      grid: "Grid",
      list: "List",
      search: "Search items...",
      addProduct: "Add Product",
      notFound: "No products found",
      notFoundDesc: "Try adjusting your search or add a new product.",
      cols: { product: "Product", id: "ID", category: "Category", price: "Price", inventory: "Inventory", status: "Status" },
      status: { order: "Order", inStock: "In Stock", soldOut: "Sold Out" }
    }
  };

  const lang = t[userLanguage];

  useEffect(() => localStorage.setItem('productViewMode', viewMode), [viewMode]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.availabilityType === 'made_to_order') return { label: `${lang.status.order} (${product.deliveryDays}d)`, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
    const stock = product.stock;
    if (product.stock === 'unlimited') return { label: `${lang.status.inStock} (∞)`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    if (stock === 0) return { label: lang.status.soldOut, color: 'bg-rose-50 text-rose-600 border-rose-100' };
    return { label: `${lang.status.inStock}: ${stock}`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  return (
    <div className="space-y-8 animate-fade-in font-['Manrope']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lang.title}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{lang.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === 'card' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fa-solid fa-grid-2"></i> {lang.grid}
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fa-solid fa-list"></i> {lang.list}
            </button>
          </div>

          <div className="relative group flex-1 min-w-[220px] md:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-sm"></i>
            <input 
              type="text" 
              placeholder={lang.search} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm" 
            />
          </div>
          <button 
            onClick={onAddProduct} 
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg uppercase tracking-wide shrink-0"
          >
            <i className="fa-solid fa-plus text-[#EDFF8C]"></i> {lang.addProduct}
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 text-2xl">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{lang.notFound}</h3>
          <p className="text-slate-500 mt-2 font-medium text-sm">{lang.notFoundDesc}</p>
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                return (
                  <div 
                    key={product.id} 
                    onClick={() => onSelectProduct(product)} 
                    className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden relative bg-slate-50">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] text-[#EDFF8C] text-[10px] font-bold uppercase tracking-widest shadow-md">{product.category}</span>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg border ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{product.name}</h3>
                      <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{product.price.toLocaleString()}₮</p>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#EDFF8C] transition-all">
                          <i className="fa-solid fa-arrow-right-long text-sm"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.product}</th>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.id}</th>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.category}</th>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.price}</th>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.inventory}</th>
                      <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product);
                      return (
                        <tr 
                          key={product.id} 
                          onClick={() => onSelectProduct(product)}
                          className="group hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-8 text-xs font-semibold text-slate-500">{product.id}</td>
                          <td className="py-5 px-8">
                            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-5 px-8">
                            <div className="font-bold text-slate-900 text-sm">
                              {product.price.toLocaleString()}₮
                            </div>
                          </td>
                          <td className="py-5 px-8">
                             <div className="text-xs font-semibold text-slate-700">
                               {product.stock === 'unlimited' ? 'Unlimited' : `${product.stock} units`}
                             </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;