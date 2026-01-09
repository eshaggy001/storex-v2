
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  store: {
    name: "Storex Apparel",
    category: "Apparel",
    city: "Ulaanbaatar",
    phone: "99110000",
    logo: "https://images.unsplash.com/photo-1541535650810-10d26f5c2abb?auto=format&fit=crop&q=80&w=200",
    onboardingStep: 5,
    isLive: true,
    connectedChannels: {
      facebook: true,
      instagram: true
    },
    aiConfig: {
      tone: 'professional',
      responseDetail: 'balanced'
    },
    fulfillment: {
      deliveryTypes: ['courier', 'pickup'],
      paymentMethods: ['qpay', 'afterpay'],
      afterpayProviders: ['storepay'],
      bankDetails: {
        bankName: "Khan Bank",
        accountNumber: "5000123456",
        accountHolder: "Storex Demo LLC",
        paymentNote: "Гүйлгээний утгад захиалгын дугаараа бичнэ үү"
      }
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      paymentPending: false
    },
    tokenUsage: {
      balance: 4200,
      limit: 5000,
      usedToday: 150,
      estimatedDaysLeft: 28
    }
  },
  user: {
    fullName: "Admin User",
    email: "admin@storex.mn",
    avatar: "https://picsum.photos/seed/admin/200/200",
    role: "Owner",
    lastLogin: new Date().toISOString(),
    language: 'mn',
    notifications: {
      personalOrders: true,
      personalPayments: true,
      systemAlerts: false
    }
  },
  products: [
    {
      id: "P-1001",
      name: "Classic Black Hoodie",
      category: "Apparel",
      price: 89000,
      discount: { type: 'percentage', value: 10 },
      description: "Premium cotton-fleece blend. Perfect for daily wear.",
      stock: 14,
      images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'ready',
      deliveryOptions: ['courier', 'pickup'],
      options: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Black", "Gray"] }
      ]
    },
    {
      id: "P-1002",
      name: "Oversized White T-Shirt",
      category: "Apparel",
      price: 39000,
      description: "Breathable 100% cotton basic tee.",
      stock: 25,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'ready',
      deliveryOptions: ['courier', 'pickup']
    },
    {
      id: "P-1003",
      name: "Denim Jacket (Pre-order)",
      category: "Apparel",
      price: 159000,
      description: "Classic blue denim, made to your specific size.",
      stock: 0,
      images: ["https://images.unsplash.com/photo-1544441893-675973e31d85?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'made_to_order',
      deliveryDays: 7,
      deliveryOptions: ['courier']
    },
    {
      id: "P-1004",
      name: "Baseball Cap",
      category: "Apparel",
      price: 34000,
      description: "Minimalist cap for outdoor styles.",
      stock: 32,
      images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'ready',
      deliveryOptions: ['courier', 'pickup']
    },
    {
      id: "P-1005",
      name: "Winter Parka",
      category: "Apparel",
      price: 249000,
      discount: { type: 'sale_price', value: 219000 },
      description: "Extreme cold weather protection with synthetic down.",
      stock: 6,
      images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'ready',
      deliveryOptions: ['courier']
    },
    {
      id: "P-1006",
      name: "Socks 3-Pack",
      category: "Apparel",
      price: 18000,
      description: "Comfortable athletic socks. 3 pairs included.",
      stock: 48,
      images: ["https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800"],
      status: 'active',
      availabilityType: 'ready',
      deliveryOptions: ['courier', 'pickup']
    }
  ],
  orders: [
    {
      id: "O-6011",
      customerName: "Саруул",
      phoneNumber: "99112233",
      channel: "instagram",
      items: [{ productId: "P-1001", quantity: 1 }, { productId: "P-1006", quantity: 1 }],
      total: 98100,
      status: "paid",
      createdAt: "2026-01-08T15:50:00Z",
      isAiGenerated: true,
      paymentStatus: "paid",
      paymentMethod: "qpay",
      deliveryMethod: "courier",
      deliveryAddress: "СБД, 1-р хороо, Энхтайвны өргөн чөлөө 12",
      aiSummary: "Hoodie(L) + Socks нэмсэн. Online төлбөр хийгдсэн."
    },
    {
      id: "O-6013",
      customerName: "Болд",
      phoneNumber: "99001122",
      channel: "facebook",
      items: [{ productId: "P-1001", quantity: 1 }, { productId: "P-1004", quantity: 1 }],
      total: 114100,
      status: "pending",
      createdAt: "2026-01-08T15:35:00Z",
      isAiGenerated: true,
      paymentStatus: "unpaid",
      paymentMethod: "qpay",
      deliveryMethod: "courier",
      deliveryAddress: "БГД, 6-р хороо, Нарны зам 45",
      aiSummary: "Hoodie + Cap санал болгосон. Төлбөр хүлээгдэж байна."
    },
    {
      id: "O-6014",
      customerName: "Энхмаа",
      phoneNumber: "99887711",
      channel: "instagram",
      items: [{ productId: "P-1003", quantity: 1 }],
      total: 159000,
      status: "confirmed",
      createdAt: "2026-01-08T15:15:00Z",
      isAiGenerated: true,
      paymentStatus: "pending",
      paymentMethod: "afterpay",
      deliveryMethod: "courier",
      deliveryAddress: "БЗД, 26-р хороо, Олимп хотхон 3",
      aiSummary: "Pre-order (7 days). Afterpay approved."
    }
  ],
  customers: [
    {
      id: "C-2001",
      name: "Саруул",
      phoneNumber: "99112233",
      channel: "instagram",
      ordersCount: 2,
      totalSpent: 262200,
      firstInteraction: "2025-12-01T10:00:00Z",
      lastInteraction: "2026-01-08T15:55:00Z",
      status: "returning",
      aiInsight: "Prefers high-end wool and hoodies. Quick decision maker."
    },
    {
      id: "C-2002",
      name: "Болд",
      phoneNumber: "99001122",
      channel: "facebook",
      ordersCount: 1,
      totalSpent: 0,
      firstInteraction: "2026-01-08T15:00:00Z",
      lastInteraction: "2026-01-08T15:40:00Z",
      status: "new",
      aiInsight: "First time buyer. Interested in matching sets."
    }
  ],
  conversations: [
    {
      id: "M-4001",
      customerName: "Саруул",
      customerAvatar: "https://i.pravatar.cc/150?u=saruul",
      channel: "instagram",
      lastMessage: "Баярлалаа, хүлээж байя.",
      timestamp: "03:55 PM",
      status: "ai_handling",
      unread: false,
      messages: [
        { id: "s1", sender: "customer", content: "Сайн байна уу? Хар худи хэд вэ? Размер байгаа юу?", timestamp: "03:45 PM" },
        { id: "s2", sender: "assistant", content: "Сайн байна уу, Саруул! 'Classic Black Hoodie' одоогоор 10% хямдралтай 80,100₮ болсон байна. S-XL хүртэл бүх размер бэлэн байгаа.", timestamp: "03:46 PM" },
        { id: "s3", sender: "customer", content: "L размер авъя. Бас оймс байгаа юу?", timestamp: "03:48 PM" },
        { id: "s4", sender: "assistant", content: "Тийм ээ, 'Socks 3-Pack' бэлэн байгаа. Танд зориулж Hoodie (L) болон оймс багтсан захиалга үүсгэлээ. QPay-ээр төлөх үү?", timestamp: "03:50 PM" },
        { id: "s5", sender: "customer", content: "Тийм ээ, төлчихлөө.", timestamp: "03:54 PM" },
        { id: "s6", sender: "assistant", content: "Төлбөр баталгаажлаа. Захиалга #O-6011 үүслээ. Хүргэлт 1-2 хоногт очно. Баярлалаа!", timestamp: "03:55 PM" }
      ]
    },
    {
      id: "M-4002",
      customerName: "Болд",
      customerAvatar: "https://i.pravatar.cc/150?u=bold",
      channel: "facebook",
      lastMessage: "Afterpay-ээр авъя.",
      timestamp: "03:40 PM",
      status: "ai_handling",
      unread: true,
      messages: [
        { id: "b1", sender: "customer", content: "Сайн байна уу, худи сонирхож байна.", timestamp: "03:30 PM" },
        { id: "b2", sender: "assistant", content: "Сайн байна уу, Болд! Манай хамгийн эрэлттэй 'Classic Black Hoodie' -г санал болгож байна. Мөн энэ худи дээр манай Baseball Cap маш гоё зохидог шүү. Үзэх үү?", timestamp: "03:32 PM" },
        { id: "b3", sender: "customer", content: "Үзье, хоёуланг нь авбал хэд болох вэ?", timestamp: "03:35 PM" },
        { id: "b4", sender: "assistant", content: "Нийт 114,100₮ болно. QPay эсвэл Afterpay ашиглах боломжтой.", timestamp: "03:38 PM" },
        { id: "b5", sender: "customer", content: "Afterpay-ээр авъя.", timestamp: "03:40 PM" }
      ]
    },
    {
      id: "M-4003",
      customerName: "Энхмаа",
      customerAvatar: "https://i.pravatar.cc/150?u=enkhmaa",
      channel: "instagram",
      lastMessage: "Дансаа явуулаарай.",
      timestamp: "03:20 PM",
      status: "ai_handling",
      unread: false,
      messages: [
        { id: "e1", sender: "customer", content: "Дээл байгаа юу? Denim jacket бас сонирхож байна.", timestamp: "03:10 PM" },
        { id: "e2", sender: "assistant", content: "Сайн байна уу! Манай Denim Jacket одоогоор захиалгаар (7 хоног) хийгдэж байгаа. Та размер болон өнгөө сонгоод захиалж болно.", timestamp: "03:12 PM" },
        { id: "e3", sender: "customer", content: "За Denim Jacket захиалъя. M размер. QPay QR явуулаарай.", timestamp: "03:20 PM" }
      ]
    },
    {
      id: "M-4005",
      customerName: "Номин",
      customerAvatar: "https://i.pravatar.cc/150?u=nomin",
      channel: "instagram",
      lastMessage: "Парка хэд вэ?",
      timestamp: "02:10 PM",
      status: "ai_handling",
      unread: false,
      messages: [
        { id: "n1", sender: "customer", content: "Сайн байна уу, гадуур хувцас юу байна?", timestamp: "02:05 PM" },
        { id: "n2", sender: "assistant", content: "Сайн байна уу! Манай 'Winter Parka' одоогоор хямдралтай (219,000₮) байгаа. Маш дулаахан, чанартай загвар байгаа шүү.", timestamp: "02:08 PM" },
        { id: "n3", sender: "customer", content: "Парка хэд вэ?", timestamp: "02:10 PM" }
      ]
    }
  ]
};
