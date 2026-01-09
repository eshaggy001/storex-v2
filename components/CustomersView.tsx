import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import AddCustomerModal from './AddCustomerModal';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Partial<Customer>) => void;
  userLanguage?: 'mn' | 'en';
}

const CustomersView: React.FC<CustomersViewProps> = ({ customers, onSelectCustomer, onAddCustomer, userLanguage = 'mn' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const t = {
    mn: {
      title: "Хэрэглэгчид",
      subtitle: "Хэрэглэгчийн мэдээлэл болон түүх.",
      total: "Нийт хэрэглэгч",
      returning: "Байнгын үйлчлүүлэгч",
      unique: "давтагдашгүй",
      repeat: "давтан захиалсан",
      add: "Хэрэглэгч нэмэх",
      search: "Нэр эсвэл утасаар хайх...",
      showing: "Жагсаалт",
      notFound: "Хэрэглэгч олдсонгүй",
      notFoundDesc: "Захиалга орж ирэхэд автоматаар үүснэ.",
      cols: { customer: "Хэрэглэгч", contact: "Холбоо барих", activity: "Идэвх", spent: "Нийт дүн", last: "Сүүлд", status: "Төлөв" },
      manual: "Гараар"
    },
    en: {
      title: "Customers",
      subtitle: "Overview of your retail audience and active buyers.",
      total: "Total Customers",
      returning: "Returning Customers",
      unique: "unique profiles",
      repeat: "placed more than one order",
      add: "Add customer",
      search: "Search by name or phone...",
      showing: "Viewing List",
      notFound: "No customers found",
      notFoundDesc: "Customers will appear here once you start receiving messages or orders.",
      cols: { customer: "Customer", contact: "Contact & Channel", activity: "Activity", spent: "Total Spent", last: "Last Interaction", status: "Status" },
      manual: "Manual Entry"
    }
  };

  const lang = t[userLanguage];

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.phoneNumber && c.phoneNumber.includes(searchQuery))
    );
  }, [customers, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      returning: customers.filter(c => c.status === 'returning').length
    };
  }, [customers]);

  return (
    <div className="space-y-8 animate-fade-in font-['Manrope']">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{lang.title}</h1>
        <p className="text-slate-500 font-medium">{lang.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang.total}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.total}</h3>
            <p className="text-xs text-slate-400 font-bold">{lang.unique}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang.returning}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">{stats.returning}</h3>
            <p className="text-xs text-slate-400 font-bold">{lang.repeat}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-[#1A1A1A] text-white rounded-2xl text-sm font-black hover:bg-black transition-all shadow-xl shrink-0"
          >
            <i className="fa-solid fa-plus text-[#EDFF8C]"></i>
            {lang.add}
          </button>
          
          <div className="relative group flex-1 md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"></i>
            <input 
              type="text" 
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="text-right shrink-0 hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang.showing}</p>
          <p className="text-sm font-black text-slate-900">{filteredCustomers.length} profiles</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
        {filteredCustomers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-slash text-slate-300 text-2xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900">{lang.notFound}</h3>
            <p className="text-slate-500 mt-1 font-medium">{lang.notFoundDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.customer}</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.contact}</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.activity}</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.spent}</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.last}</th>
                  <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.cols.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => onSelectCustomer(customer)}
                    className="group hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-black text-slate-300 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {customer.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[#1A1A1A] text-base group-hover:underline underline-offset-4 decoration-black/20">
                            {customer.name}
                          </span>
                          {customer.source === 'manual' && (
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{lang.manual}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                           {customer.channel === 'phone' ? (
                             <i className="fa-solid fa-phone text-slate-400 text-xs"></i>
                           ) : (
                             <i className={`fa-brands ${customer.channel === 'instagram' ? 'fa-instagram text-pink-600' : 'fa-facebook text-blue-600'} text-sm`}></i>
                           )}
                           <span className="text-xs font-bold text-slate-600">{customer.phoneNumber || 'No phone'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-black text-[#1A1A1A]">{customer.ordersCount} Orders</div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-black text-[#1A1A1A] tracking-tighter text-lg">
                        {customer.totalSpent.toLocaleString()}₮
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(customer.lastInteraction).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        customer.status === 'returning' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCustomerModal 
          onClose={() => setShowAddModal(false)}
          onAdd={onAddCustomer}
        />
      )}
    </div>
  );
};

export default CustomersView;