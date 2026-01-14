
import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.purchasePrice), 0);
    const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
    
    const salesToday = sales.filter(s => s.date.startsWith(today));
    const revenueToday = salesToday.reduce((acc, s) => acc + s.totalValue, 0);
    const profitToday = salesToday.reduce((acc, s) => acc + s.profit, 0);
    
    const lowStockAlerts = products.filter(p => p.stock <= 5 && p.stock > 0).length;
    const outOfStockAlerts = products.filter(p => p.stock === 0).length;

    return {
      totalInventoryValue,
      totalStockCount,
      revenueToday,
      profitToday,
      lowStockAlerts,
      outOfStockAlerts
    };
  }, [products, sales]);

  const salesData = useMemo(() => {
    // Group sales by last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(day => {
      const daySales = sales.filter(s => s.date.startsWith(day));
      return {
        name: day.split('-').slice(1).join('/'),
        vendas: daySales.reduce((acc, s) => acc + s.totalValue, 0),
        lucro: daySales.reduce((acc, s) => acc + s.profit, 0)
      };
    });
  }, [sales]);

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Valor em Estoque" 
          value={`R$ ${stats.totalInventoryValue.toLocaleString('pt-BR')}`}
          icon={Package}
          color="bg-indigo-600"
          subtext={`${stats.totalStockCount} itens totais`}
        />
        <StatCard 
          title="Vendas do Dia" 
          value={`R$ ${stats.revenueToday.toLocaleString('pt-BR')}`}
          icon={TrendingUp}
          color="bg-emerald-500"
          subtext="Baseado em dados de hoje"
        />
        <StatCard 
          title="Lucro do Dia" 
          value={`R$ ${stats.profitToday.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          color="bg-amber-500"
          subtext="Receita - Custo"
        />
        <StatCard 
          title="Alertas de Estoque" 
          value={stats.lowStockAlerts + stats.outOfStockAlerts}
          icon={AlertCircle}
          color="bg-rose-500"
          subtext={`${stats.outOfStockAlerts} esgotados, ${stats.lowStockAlerts} baixos`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Desempenho Semanal</h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center"><span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>Vendas</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>Lucro</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="vendas" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="lucro" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atenção ao Estoque</h3>
          <div className="space-y-4">
            {products.filter(p => p.stock <= 5).length === 0 ? (
              <p className="text-gray-500 text-sm italic">Tudo sob controle!</p>
            ) : (
              products
                .filter(p => p.stock <= 5)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 5)
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                      {product.stock} un
                    </div>
                  </div>
                ))
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100">
            Ver Estoque Completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
