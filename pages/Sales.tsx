
import React, { useState } from 'react';
import { ShoppingCart, Plus, Calendar, DollarSign, User, CreditCard, Package } from 'lucide-react';
import { Product, Sale, PaymentMethod, Customer } from '../types';

interface SalesProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  customers: Customer[];
}

const Sales: React.FC<SalesProps> = ({ products, setProducts, sales, setSales, customers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleNewSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const productId = formData.get('productId') as string;
    const quantity = Number(formData.get('quantity'));
    const paymentMethod = formData.get('paymentMethod') as PaymentMethod;
    const customerId = formData.get('customerId') as string;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < quantity) {
      setError(`Estoque insuficiente! Apenas ${product.stock} disponíveis.`);
      return;
    }

    const totalValue = product.salePrice * quantity;
    const profit = (product.salePrice - product.purchasePrice) * quantity;

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      quantity,
      totalValue,
      profit,
      date: new Date().toISOString(),
      paymentMethod,
      customerId: customerId || undefined
    };

    // Update Sales list
    setSales(prev => [newSale, ...prev]);

    // Update Product Stock
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));

    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Vendas</h1>
          <p className="text-gray-500">Acompanhe as vendas e registre novas transações</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
        >
          <ShoppingCart size={20} />
          <span>Registrar Venda</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sales.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300 text-gray-500">
            Nenhuma venda registrada ainda. Clique em "Registrar Venda" para começar.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Qtd</th>
                    <th className="px-6 py-4">Valor Total</th>
                    <th className="px-6 py-4">Lucro</th>
                    <th className="px-6 py-4">Pagamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.map(sale => {
                    const product = products.find(p => p.id === sale.productId);
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{product?.name || 'Produto Removido'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{sale.quantity}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">R$ {sale.totalValue.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">R$ {sale.profit.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600 font-medium">{sale.paymentMethod}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Modal Registrar Venda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Plus size={20} />
                <h3 className="text-xl font-bold text-gray-900">Nova Venda</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleNewSale} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Package size={14} className="mr-1" /> Selecionar Produto
                </label>
                <select required name="productId" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Selecione um produto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name} (Estoque: {p.stock} un - R$ {p.salePrice.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Quantidade</label>
                  <input required type="number" name="quantity" min="1" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <CreditCard size={14} className="mr-1" /> Pagamento
                  </label>
                  <select required name="paymentMethod" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                    {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <User size={14} className="mr-1" /> Cliente (Opcional)
                </label>
                <select name="customerId" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Consumidor Final</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pt-4 flex flex-col space-y-3">
                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={18} />
                  <span>Finalizar Venda</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export default Sales;
