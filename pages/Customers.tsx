
import React, { useState } from 'react';
import { Users, Plus, UserPlus, Mail, Phone, MoreVertical } from 'lucide-react';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carteira de Clientes</h1>
          <p className="text-gray-500">Gerencie o relacionamento e histórico de seus clientes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <UserPlus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <button className="absolute top-4 right-4 text-gray-300 group-hover:text-gray-500">
              <MoreVertical size={20} />
            </button>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{customer.name}</h3>
                <p className="text-xs text-gray-500 italic">Cliente desde 2023</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2 text-gray-400" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-2 text-gray-400" />
                {customer.phone}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50">
              <button className="text-xs font-semibold text-indigo-600 hover:underline">Ver Histórico de Pedidos</button>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">
            Nenhum cliente cadastrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold">X</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                <input required name="name" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">E-mail</label>
                <input required type="email" name="email" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Telefone / WhatsApp</label>
                <input required name="phone" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 mt-4 transition-all">
                Cadastrar Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
