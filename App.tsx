import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardOverview from './components/DashboardOverview';
import AIAssistant from './components/AIAssistant';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import MessagesView from './components/MessagesView';
import OrdersView from './components/OrdersView';
import OrderDetail from './components/OrderDetail';
import CustomersView from './components/CustomersView';
import CustomerDetailView from './components/CustomerDetailView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import OnboardingFlow from './components/OnboardingFlow';
import ProductCreationWizard from './components/ProductCreationWizard';
import StorefrontView from './components/StorefrontView';
import WalletView from './components/WalletView';
import { INITIAL_STATE } from './constants';
import { fetchInitialState } from './services/api';
import { AppState, Product, StoreInfo, Order, Customer, UserProfile, ProductOption } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [aiProductContext, setAiProductContext] = useState<{ image: string, suggestions: { name: string, category: string, options?: ProductOption[] } } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchInitialState();
      setState(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateStore = (updates: Partial<StoreInfo>) => {
    setState(prev => ({ ...prev, store: { ...prev.store, ...updates } }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const addProduct = (product: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name || 'Untitled Product',
      price: product.price || 0,
      description: product.description || '',
      stock: product.stock === undefined ? 0 : product.stock,
      category: (product.category as any) || 'Other',
      status: 'active',
      availabilityType: product.availabilityType || 'ready',
      deliveryDays: product.deliveryDays,
      images: product.images && product.images.length > 0
        ? product.images
        : [`https://picsum.photos/seed/${product.name}/400/400`],
      deliveryOptions: product.deliveryOptions || ['courier'],
      options: product.options
    };
    setState(prev => ({ ...prev, products: [newProduct, ...prev.products] }));
    setActiveView('products');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setState(prev => {
      const updatedProducts = prev.products.map(p => p.id === id ? { ...p, ...updates } : p);
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct({ ...selectedProduct, ...updates } as Product);
      }
      return { ...prev, products: updatedProducts };
    });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setState(prev => {
      const updatedOrders = prev.orders.map(o => o.id === id ? { ...o, ...updates } : o);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, ...updates } as Order);
      }
      return { ...prev, orders: updatedOrders };
    });
  };

  const handleCreateOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `O-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName || 'Anonymous',
      phoneNumber: orderData.phoneNumber,
      channel: orderData.channel || 'web',
      items: orderData.items || [],
      total: orderData.total || 0,
      status: orderData.status || 'pending',
      createdAt: orderData.createdAt || new Date().toISOString(),
      isAiGenerated: orderData.isAiGenerated ?? false,
      paymentStatus: orderData.paymentStatus || 'unpaid',
      paymentMethod: orderData.paymentMethod || 'bank_transfer',
      deliveryMethod: orderData.deliveryMethod || 'pickup',
      deliveryAddress: orderData.deliveryAddress,
      aiSummary: orderData.aiSummary || 'This order was created manually by the merchant.',
    };

    setState(prev => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    return newOrder;
  };

  const handleAddCustomer = (customerData: Partial<Customer>) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      id: `C-${Math.random().toString(36).substr(2, 6)}`,
      name: customerData.name || 'Unknown',
      phoneNumber: customerData.phoneNumber,
      channel: customerData.channel || 'web',
      ordersCount: 0,
      totalSpent: 0,
      firstInteraction: now,
      lastInteraction: now,
      status: 'new',
      source: 'manual',
      note: customerData.note,
      aiInsight: 'Manually added customer profile.'
    };

    setState(prev => ({ ...prev, customers: [newCustomer, ...prev.customers] }));
  };

  const startAiFlow = (image: string, suggestions: { name: string, category: string, options?: ProductOption[] }) => {
    setAiProductContext({ image, suggestions });
    setIsAssistantOpen(true);
  };

  const completeOnboarding = () => {
    updateStore({ onboardingStep: 5, isLive: true });
    setActiveView('dashboard');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product_detail');
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveView('order_detail');
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveView('customer_detail');
  };

  const navigateToProducts = () => {
    setSelectedProduct(null);
    setActiveView('products');
  };

  const navigateToOrders = () => {
    setSelectedOrder(null);
    setActiveView('orders');
  };

  const navigateToCustomers = () => {
    setSelectedCustomer(null);
    setActiveView('customers');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  if (!state.store.isLive || state.store.onboardingStep < 5) {
    return (
      <OnboardingFlow
        store={state.store}
        updateStore={updateStore}
        addProduct={(p) => addProduct(p)}
        onComplete={completeOnboarding}
        language={state.user.language}
      />
    );
  }

  // Handle Full-Screen Storefront Mode
  if (activeView === 'storefront') {
    return (
      <StorefrontView
        store={state.store}
        products={state.products}
        onExit={() => setActiveView('dashboard')}
      />
    );
  }

  const renderView = () => {
    const commonProps = { userLanguage: state.user.language };

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardOverview
            store={state.store}
            orders={state.orders}
            conversations={state.conversations}
            products={state.products}
            customers={state.customers}
            onNavigate={setActiveView}
            onSelectOrder={handleSelectOrder}
            {...commonProps}
          />
        );
      case 'products':
        return <ProductList products={state.products} onAddProduct={() => setIsWizardOpen(true)} onSelectProduct={handleSelectProduct} {...commonProps} />;
      case 'product_detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={navigateToProducts}
            onUpdate={(updates) => updateProduct(selectedProduct.id, updates)}
            onEditWithAi={() => setIsAssistantOpen(true)}
            {...commonProps}
          />
        ) : <DashboardOverview store={state.store} orders={state.orders} conversations={state.conversations} products={state.products} customers={state.customers} onNavigate={setActiveView} onSelectOrder={handleSelectOrder} {...commonProps} />;
      case 'order_detail':
        return selectedOrder ? (
          <OrderDetail
            order={selectedOrder}
            products={state.products}
            onBack={navigateToOrders}
            onUpdate={(updates) => updateOrder(selectedOrder.id, updates)}
            {...commonProps}
          />
        ) : <DashboardOverview store={state.store} orders={state.orders} conversations={state.conversations} products={state.products} customers={state.customers} onNavigate={setActiveView} onSelectOrder={handleSelectOrder} {...commonProps} />;
      case 'messages':
        return (
          <MessagesView
            conversations={state.conversations}
            products={state.products}
            orders={state.orders}
            store={state.store}
            onCreateOrder={handleCreateOrder}
            onUpdateOrder={updateOrder}
            {...commonProps}
          />
        );
      case 'orders':
        return <OrdersView orders={state.orders} products={state.products} store={state.store} onSelectOrder={handleSelectOrder} onCreateOrder={handleCreateOrder} {...commonProps} />;
      case 'customers':
        return <CustomersView customers={state.customers} onSelectCustomer={handleSelectCustomer} onAddCustomer={handleAddCustomer} {...commonProps} />;
      case 'customer_detail':
        return selectedCustomer ? (
          <CustomerDetailView
            customer={selectedCustomer}
            orders={state.orders}
            onBack={navigateToCustomers}
            onSelectOrder={handleSelectOrder}
            {...commonProps}
          />
        ) : <DashboardOverview store={state.store} orders={state.orders} conversations={state.conversations} products={state.products} customers={state.customers} onNavigate={setActiveView} onSelectOrder={handleSelectOrder} {...commonProps} />;
      case 'wallet':
        return <WalletView store={state.store} orders={state.orders} onUpdateStore={updateStore} {...commonProps} />;
      case 'settings':
        return <SettingsView store={state.store} onViewStore={() => setActiveView('storefront')} {...commonProps} />;
      case 'profile':
        return <ProfileView user={state.user} onUpdate={updateUser} {...commonProps} />;
      default:
        return <DashboardOverview store={state.store} orders={state.orders} conversations={state.conversations} products={state.products} customers={state.customers} onNavigate={setActiveView} onSelectOrder={handleSelectOrder} {...commonProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] overflow-hidden relative">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isAssistantOpen={isAssistantOpen}
        toggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        language={state.user.language}
      />
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ${isAssistantOpen ? 'mr-[400px]' : 'mr-0'}`}>
        <TopBar
          store={state.store}
          user={state.user}
          onProfileClick={() => setActiveView('profile')}
          onViewStore={() => setActiveView('storefront')}
          language={state.user.language}
          onToggleLanguage={(lang) => updateUser({ language: lang })}
        />
        <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
          <div className="max-w-[1600px] mx-auto pt-6">
            {renderView()}
          </div>
        </div>
      </div>
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#1A1A1A] z-50 transition-transform duration-500 shadow-[-20px_0_50px_rgba(0,0,0,0.3)] ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <AIAssistant state={state} updateState={updateState} onClose={() => setIsAssistantOpen(false)} initialContext={aiProductContext} clearContext={() => setAiProductContext(null)} />
      </div>
      {isWizardOpen && (
        <ProductCreationWizard onClose={() => setIsWizardOpen(false)} onManualCreate={addProduct} onAiStart={startAiFlow} />
      )}
      {!isAssistantOpen && (
        <button onClick={() => setIsAssistantOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-[#EDFF8C] text-black rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group z-40 border-4 border-white animate-fade-in">
          <i className="fa-solid fa-wand-magic-sparkles text-2xl group-hover:rotate-12 transition-transform"></i>
        </button>
      )}
    </div>
  );
};

export default App;
