
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Customers from './pages/Customers';
import Reports from './pages/Reports';

import { Product, Sale, Purchase, Customer, Category } from './types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', sku: 'ELET-001', name: 'Smartphone Pro Max', category: Category.ELECTRONICS, purchasePrice: 3500, salePrice: 5000, stock: 12, supplier: 'Tech Solutions', entryDate: '2023-10-01' },
  { id: '2', sku: 'HOME-005', name: 'Luminária LED', category: Category.HOME, purchasePrice: 45, salePrice: 99, stock: 5, supplier: 'Decor Ltda', entryDate: '2023-11-15' },
];

// Using React.FC allows the component to correctly handle intrinsic props like 'key'
const SidebarItem: React.FC<{ icon: any, label: string, path: string, active: boolean }> = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lj_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('lj_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('lj_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('lj_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lj_products', JSON.stringify(products));
    localStorage.setItem('lj_sales', JSON.stringify(sales));
    localStorage.setItem('lj_purchases', JSON.stringify(purchases));
    localStorage.setItem('lj_customers', JSON.stringify(customers));
  }, [products, sales, purchases, customers]);

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-gray-50 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30
          w-64 bg-white border-r border-gray-200 flex flex-col
        `}>
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">LJ Store</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <SidebarNavigation />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center space-x-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">Painel de Controle</h2>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500">LJ Online Store</p>
              </div>
              <img 
                src="https://picsum.photos/seed/user/40/40" 
                className="w-10 h-10 rounded-full border border-gray-200" 
                alt="Profile"
              />
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard products={products} sales={sales} />} />
              <Route path="/inventario" element={<Inventory products={products} setProducts={setProducts} />} />
              <Route path="/vendas" element={<Sales products={products} setProducts={setProducts} sales={sales} setSales={setSales} customers={customers} />} />
              <Route path="/compras" element={<Purchases products={products} setProducts={setProducts} purchases={purchases} setPurchases={setPurchases} />} />
              <Route path="/clientes" element={<Customers customers={customers} setCustomers={setCustomers} />} />
              <Route path="/relatorios" element={<Reports products={products} sales={sales} purchases={purchases} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const SidebarNavigation = () => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Estoque', path: '/inventario' },
    { icon: ArrowUpCircle, label: 'Vendas', path: '/vendas' },
    { icon: ArrowDownCircle, label: 'Compras', path: '/compras' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: FileText, label: 'Relatórios', path: '/relatorios' },
  ];

  return (
    <>
      {navItems.map((item) => (
        <SidebarItem 
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          active={location.pathname === item.path}
        />
      ))}
    </>
  );
};

export default App;
