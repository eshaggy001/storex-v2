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
import WalletView from './components/WalletView';
import PaymentSetupModal from './components/PaymentSetupModal';
import DeliverySetupModal from './components/DeliverySetupModal';
import SocialChannelModal from './components/SocialChannelModal';
import { INITIAL_STATE } from './constants';
import { fetchInitialState } from './services/api';
import { AppState, Product, StoreInfo, Order, Customer, UserProfile, ProductOption } from './types';
import { StateGates, updateReadinessFlags } from './stateTransitions';
import { ActionTask } from './types';
import GuidanceDrawer from './components/dashboard/GuidanceSystem/GuidanceDrawer';
import { deriveActionGuidance } from './services/guidanceEngine';
import StorefrontView from './components/StorefrontView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [aiProductContext, setAiProductContext] = useState<{ image: string, suggestions: { name: string, category: string, options?: ProductOption[] } } | null>(null);
  const [selectedGuidanceTask, setSelectedGuidanceTask] = useState<ActionTask | null>(null);
  const [isGuidanceDrawerOpen, setIsGuidanceDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchInitialState();
      setState(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Synchronize readiness flags whenever critical state changes
  useEffect(() => {
    if (isLoading) return;

    const newReadiness = updateReadinessFlags({
      ...state.store,
      products: state.products
    });

    const hasChanged = JSON.stringify(newReadiness) !== JSON.stringify(state.store.readiness);

    if (hasChanged) {
      setState(prev => ({
        ...prev,
        store: {
          ...prev.store,
          readiness: newReadiness
        }
      }));
    }
  }, [state.products, state.store.fulfillment, state.store.status, state.store.tokenUsage, isLoading]);

  // Synchronize Action Guidance System
  useEffect(() => {
    if (isLoading) return;

    const newGuidance = deriveActionGuidance(state);

    if (JSON.stringify(newGuidance) !== JSON.stringify(state.actionGuidance)) {
      setState(prev => ({
        ...prev,
        actionGuidance: newGuidance
      }));
    }
  }, [
    state.products,
    state.orders,
    state.conversations,
    state.store.readiness,
    state.store.fulfillment,
    state.actionGuidance.streaks,
    state.actionGuidance.taskHistory,
    isLoading
  ]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateStore = (updates: Partial<StoreInfo>) => {
    setState(prev => ({ ...prev, store: { ...prev.store, ...updates } }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const addProduct = (product: Partial<Product>, stayOnCurrentView: boolean = false) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: state.store.id,
      name: product.name || 'Untitled Product',
      price: product.price || 0,
      description: product.description || '',
      stock: product.stock === undefined ? 0 : product.stock,
      category: (product.category as any) || 'Other',
      status: 'ACTIVE',
      created_by: 'MANUAL',
      created_at: now,
      updated_at: now,
      availabilityType: product.availabilityType || 'ready',
      deliveryDays: product.deliveryDays,
      images: product.images && product.images.length > 0
        ? product.images
        : [`https://picsum.photos/seed/${product.name}/400/400`],
      deliveryOptions: product.deliveryOptions || ['courier'],
      options: product.options
    };
    setState(prev => ({ ...prev, products: [newProduct, ...prev.products] }));
    if (!stayOnCurrentView) {
      setActiveView('products');
    }
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
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `O-${Math.floor(1000 + Math.random() * 9000)}`,
      business_id: state.store.id,
      customer_id: orderData.customer_id || `C-${Math.random().toString(36).substr(2, 6)}`,
      customerName: orderData.customerName || 'Anonymous',
      phoneNumber: orderData.phoneNumber,
      channel: orderData.channel || 'web',
      items: orderData.items || [],
      total: orderData.total || 0,
      total_amount: orderData.total || 0,
      status: orderData.status || 'pending',
      order_status: 'NEW',
      payment_status: 'UNPAID',
      delivery_status: 'PENDING',
      source: 'OFFLINE',
      created_by: 'MANUAL',
      created_at: now,
      isAiGenerated: orderData.isAiGenerated ?? false,
      paymentMethod: orderData.paymentMethod || 'bank_transfer',
      deliveryMethod: orderData.deliveryMethod || 'pickup',
      deliveryAddress: orderData.deliveryAddress,
      paymentStatus: 'unpaid',
      aiSummary: orderData.aiSummary || 'This order was created manually by the merchant.',
    };


    setState(prev => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    return newOrder;
  };

  const handleAddCustomer = (customerData: Partial<Customer>) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      id: `C-${Math.random().toString(36).substr(2, 6)}`,
      business_id: state.store.id,
      name: customerData.name || 'Unknown',
      phone: customerData.phone,
      channel: customerData.channel || 'web',
      total_orders: 0,
      total_spend: 0,
      ordersCount: 0,
      totalSpent: 0,
      firstInteraction: now,
      lastInteraction: now,
      created_at: now,
      status: 'NEW',
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
    // STATE-DRIVEN: Ensure business status is ACTIVE when onboarding completes
    updateStore({
      onboardingStep: 5,
      isLive: true,
      status: state.store.status === 'ACCESS_REQUESTED' ? 'ACCESS_REQUESTED' : 'ACTIVE'
    });
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

  const handleTaskClick = (task: ActionTask) => {
    setSelectedGuidanceTask(task);
    setIsGuidanceDrawerOpen(true);
  };

  const handleGuidanceAction = (task: ActionTask) => {
    const action = task.ctaAction;

    if (action.startsWith('navigate:')) {
      const view = action.split(':')[1];
      setActiveView(view);
    } else if (action === 'action:add_product') {
      setIsWizardOpen(true);
    } else if (action === 'view:analytics') {
      // In a real app, scroll to analytics or open modal
      alert('Opening Insights...');
    } else if (action === 'view:progress') {
      alert('Viewing Streak Progress...');
    }

    // Mark task as "visited/interacted" if needed
    if (task.tags.includes('INSIGHT') && !state.actionGuidance.taskHistory.includes(`view_${task.id}`)) {
      setState(prev => ({
        ...prev,
        actionGuidance: {
          ...prev.actionGuidance,
          taskHistory: [...prev.actionGuidance.taskHistory, `view_${task.id}`]
        }
      }));
    }
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
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-dark/10"></div>
          <div className="absolute inset-0 animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 bg-lime rounded-full shadow-[0_0_10px_#EDFF8C]"></div>
          </div>
        </div>
      </div>
    );
  }

  // STATE-DRIVEN: Show onboarding if business is not ACTIVE
  // This replaces the legacy isLive/onboardingStep check
  const canAccessMainApp = StateGates.canAccessMainApp(state.store.status);

  if (!canAccessMainApp) {
    return (
      <OnboardingFlow
        store={state.store}
        updateStore={updateStore}
        addProduct={(p) => addProduct(p)}
        onComplete={completeOnboarding}
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
            onAddProduct={() => setIsWizardOpen(true)}
            onConnectPayment={() => setIsPaymentModalOpen(true)}
            onSetupDelivery={() => setIsDeliveryModalOpen(true)}
            onConnectSocial={() => setIsSocialModalOpen(true)}
            actionGuidance={state.actionGuidance}
            onGuidanceAction={handleGuidanceAction}
            onTaskClick={handleTaskClick}
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
        return <SettingsView store={state.store} onUpdate={updateStore} {...commonProps} />;
      case 'profile':
        return <ProfileView user={state.user} onUpdate={updateUser} {...commonProps} />;
      case 'storefront':
        return <StorefrontView store={state.store} products={state.products} onExit={() => setActiveView('dashboard')} />;
      default:
        return <DashboardOverview store={state.store} orders={state.orders} conversations={state.conversations} products={state.products} customers={state.customers} onNavigate={setActiveView} onSelectOrder={handleSelectOrder} {...commonProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg overflow-hidden relative font-sans">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isAssistantOpen={isAssistantOpen}
        toggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        language={state.user.language}
      />
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-700 ease-in-out ${isAssistantOpen ? 'mr-[400px]' : 'mr-0'} ${isGuidanceDrawerOpen ? 'blur-[6px] pointer-events-none' : ''}`}>
        <TopBar
          store={state.store}
          user={state.user}
          onProfileClick={() => setActiveView('profile')}
          onViewStore={() => setActiveView('storefront')}
          language={state.user.language}
          onToggleLanguage={(lang) => updateUser({ language: lang })}
        />
        <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
          <div className="max-w-[1600px] mx-auto pt-8">
            {renderView()}
          </div>
        </div>
      </div>
      {/* AI Assistant Panel - Always present, collapsible */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-dark z-50 transition-transform duration-700 ease-in-out shadow-[-20px_0_50px_rgba(0,0,0,0.3)] border-l border-white/5 ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <AIAssistant
          state={state}
          updateState={updateState}
          onClose={() => setIsAssistantOpen(false)}
          initialContext={aiProductContext}
          clearContext={() => setAiProductContext(null)}
          currentView={activeView}
          contextData={
            activeView === 'product_detail' ? selectedProduct :
              activeView === 'order_detail' ? selectedOrder :
                activeView === 'customer_detail' ? selectedCustomer :
                  null
          }
        />
      </div>
      {isWizardOpen && (
        <ProductCreationWizard
          onClose={() => setIsWizardOpen(false)}
          onManualCreate={(p) => addProduct(p, activeView === 'dashboard')}
          onAiStart={startAiFlow}
        />
      )}
      <PaymentSetupModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        store={state.store}
        onUpdateStore={updateStore}
      />
      <DeliverySetupModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        store={state.store}
        onUpdateStore={updateStore}
      />
      <SocialChannelModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        store={state.store}
        onUpdateStore={updateStore}
      />
      {!isAssistantOpen && (
        <button onClick={() => setIsAssistantOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-lime text-dark rounded-super shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-40 border-4 border-white animate-fade-in pulse-subtle">
          <i className="fa-solid fa-wand-magic-sparkles text-2xl group-hover:rotate-12 transition-transform"></i>
        </button>
      )}

      {/* GLOBAL GUIDANCE DRAWER */}
      <GuidanceDrawer
        task={selectedGuidanceTask}
        isOpen={isGuidanceDrawerOpen}
        onClose={() => setIsGuidanceDrawerOpen(false)}
        onAction={handleGuidanceAction}
      />
    </div>
  );
};

export default App;
