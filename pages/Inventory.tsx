
import React, { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Package, X } from 'lucide-react';
import { Product, Category } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      sku: formData.get('sku') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as Category,
      purchasePrice: Number(formData.get('purchasePrice')),
      salePrice: Number(formData.get('salePrice')),
      stock: Number(formData.get('stock')),
      supplier: formData.get('supplier') as string,
      entryDate: formData.get('entryDate') as string || new Date().toISOString().split('T')[0],
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      setProducts(prev => [...prev, { ...productData, id: Date.now().toString() }]);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-500">Visualize e gerencie seu inventário de produtos</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, SKU ou fornecedor..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Preço (C/V)</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 uppercase">SKU: {product.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="text-gray-400">C: R$ {product.purchasePrice.toFixed(2)}</p>
                      <p className="text-gray-900 font-medium">V: R$ {product.salePrice.toFixed(2)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-bold ${product.stock <= 5 ? 'text-rose-600' : 'text-gray-900'}`}>
                      {product.stock} un
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-700">Sem estoque</span>
                    ) : product.stock <= 5 ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-amber-100 text-amber-700">Baixo</span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nome do Produto</label>
                  <input required name="name" defaultValue={editingProduct?.name} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">SKU / Código</label>
                  <input required name="sku" defaultValue={editingProduct?.sku} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Categoria</label>
                  <select name="category" defaultValue={editingProduct?.category} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Fornecedor</label>
                  <input required name="supplier" defaultValue={editingProduct?.supplier} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Preço de Compra (R$)</label>
                  <input required type="number" step="0.01" name="purchasePrice" defaultValue={editingProduct?.purchasePrice} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Preço de Venda (R$)</label>
                  <input required type="number" step="0.01" name="salePrice" defaultValue={editingProduct?.salePrice} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Estoque Inicial</label>
                  <input required type="number" name="stock" defaultValue={editingProduct?.stock || 0} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Data de Entrada</label>
                  <input type="date" name="entryDate" defaultValue={editingProduct?.entryDate || new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
