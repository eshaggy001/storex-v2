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
    <div className="space-y-10 animate-fade-in font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dark/5 pb-10">
        <div>
          <h1 className="text-4xl font-bold text-dark tracking-tighter">{lang.title}</h1>
          <p className="text-slate-500 font-medium text-base mt-2">{lang.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex bg-bg p-1.5 rounded-2xl border border-dark/5 shadow-inner">
            <button
              onClick={() => setViewMode('card')}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'card' ? 'bg-white text-dark shadow-sm border border-dark/5' : 'text-slate-400 hover:text-dark'
                }`}
            >
              <i className="fa-solid fa-table-cells"></i> {lang.grid}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-dark shadow-sm border border-dark/5' : 'text-slate-400 hover:text-dark'
                }`}
            >
              <i className="fa-solid fa-list-ul"></i> {lang.list}
            </button>
          </div>

          <div className="relative group flex-1 min-w-[240px] md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime transition-colors text-sm"></i>
            <input
              type="text"
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-dark/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:border-lime focus:ring-4 focus:ring-lime/10 transition-all placeholder:text-slate-300 shadow-soft"
            />
          </div>
          <button
            onClick={onAddProduct}
            className="btn-primary !px-8 !py-4 shadow-xl"
          >
            <i className="fa-solid fa-plus text-dark/70 mr-1"></i> {lang.addProduct}
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-super border border-dark/5 p-24 text-center shadow-soft animate-fade-up">
          <div className="w-24 h-24 bg-bg rounded-card flex items-center justify-center mx-auto mb-8 text-slate-200 text-4xl shadow-inner group overflow-hidden">
            <i className="fa-solid fa-box-open group-hover:scale-110 transition-transform"></i>
          </div>
          <h3 className="text-2xl font-bold text-dark tracking-tight">{lang.notFound}</h3>
          <p className="text-slate-500 mt-3 font-medium text-base max-w-sm mx-auto">{lang.notFoundDesc}</p>
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, i) => {
                const status = getStockStatus(product);
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="bg-white rounded-super border border-dark/5 overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="aspect-[4/5] overflow-hidden relative bg-bg">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className="px-4 py-2 rounded-xl bg-dark text-lime text-[10px] font-bold uppercase tracking-widest shadow-2xl backdrop-blur-md opacity-90">{product.category}</span>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-2xl border backdrop-blur-md ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-lg font-bold text-dark truncate tracking-tight">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-dark tracking-tighter">{product.price.toLocaleString()}₮</p>
                        <div className="w-12 h-12 rounded-xl bg-bg text-dark/30 flex items-center justify-center group-hover:bg-lime group-hover:text-dark transition-all shadow-sm group-hover:shadow-lime/20 group-hover:-rotate-3 translate-y-1">
                          <i className="fa-solid fa-arrow-right text-lg"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-super border border-dark/5 shadow-soft overflow-hidden animate-fade-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-bg/50 border-b border-dark/5">
                    <tr>
                      <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.product}</th>
                      <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{lang.cols.category}</th>
                      <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.price}</th>
                      <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{lang.cols.inventory}</th>
                      <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/5">
                    {filteredProducts.map((product, i) => {
                      const status = getStockStatus(product);
                      return (
                        <tr
                          key={product.id}
                          onClick={() => onSelectProduct(product)}
                          className="group hover:bg-bg/30 transition-all cursor-pointer animate-fade-up"
                          style={{ animationDelay: `${i * 0.03}s` }}
                        >
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg border border-dark/5 shadow-sm group-hover:shadow-md transition-shadow">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-dark text-base tracking-tight group-hover:text-dark transition-colors">
                                  {product.name}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-10 text-center">
                            <span className="px-4 py-2 rounded-xl bg-bg text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-dark/5 shadow-sm">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-6 px-10 text-right">
                            <div className="font-bold text-dark text-base tracking-tight">
                              {product.price.toLocaleString()}₮
                            </div>
                          </td>
                          <td className="py-6 px-10 text-center">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {product.stock === 'unlimited' ? 'Unlimited' : `${product.stock} units`}
                            </div>
                          </td>
                          <td className="py-6 px-10 text-right">
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm ${status.color}`}>
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