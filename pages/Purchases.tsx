
import React, { useState } from 'react';
import { ArrowDownCircle, Plus, Package, Truck, Calendar } from 'lucide-react';
import { Product, Purchase } from '../types';

interface PurchasesProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
}

const Purchases: React.FC<PurchasesProps> = ({ products, setProducts, purchases, setPurchases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productId = formData.get('productId') as string;
    const quantity = Number(formData.get('quantity'));
    const unitCost = Number(formData.get('unitCost'));
    const supplier = formData.get('supplier') as string;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      productId,
      quantity,
      unitCost,
      totalCost: unitCost * quantity,
      date: new Date().toISOString(),
      supplier
    };

    setPurchases(prev => [newPurchase, ...prev]);
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, stock: p.stock + quantity, purchasePrice: unitCost, supplier } 
        : p
    ));

    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entrada de Mercadorias</h1>
          <p className="text-gray-500">Registre novas compras e atualize o estoque automaticamente</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          <span>Registrar Compra</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {purchases.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nenhuma compra registrada ainda.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4 text-right">Custo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map(purchase => {
                const product = products.find(p => p.id === purchase.productId);
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{product?.name || '---'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{purchase.supplier}</td>
                    <td className="px-6 py-4 text-sm font-medium">{purchase.quantity} un</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">R$ {purchase.totalCost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Nova Compra</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">X</button>
            </div>
            <form onSubmit={handleNewPurchase} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Produto</label>
                <select required name="productId" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Selecione...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Quantidade</label>
                  <input required type="number" min="1" name="quantity" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Custo Unitário (R$)</label>
                  <input required type="number" step="0.01" name="unitCost" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Fornecedor</label>
                <input required name="supplier" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 mt-4 transition-all shadow-lg shadow-indigo-100">
                Confirmar Recebimento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
