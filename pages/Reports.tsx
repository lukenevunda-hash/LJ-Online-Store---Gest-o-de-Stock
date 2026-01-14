
import React, { useMemo } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { Product, Sale, Purchase } from '../types';

interface ReportsProps {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
}

const Reports: React.FC<ReportsProps> = ({ products, sales, purchases }) => {
  const reportData = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalValue, 0);
    const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
    const totalInvestment = purchases.reduce((acc, p) => acc + p.totalCost, 0);
    
    // Top Selling Products
    const productSales: Record<string, number> = {};
    sales.forEach(s => {
      productSales[s.productId] = (productSales[s.productId] || 0) + s.quantity;
    });

    const topSelling = Object.entries(productSales)
      .map(([id, qty]) => ({
        product: products.find(p => p.id === id)?.name || 'Desconhecido',
        qty
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalRevenue,
      totalProfit,
      totalInvestment,
      topSelling,
      margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    };
  }, [products, sales, purchases]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Data', 'Produto', 'Quantidade', 'Valor Total', 'Lucro'];
    const csvContent = [
      headers.join(','),
      ...sales.map(s => {
        const p = products.find(prod => prod.id === s.productId);
        return [s.id, s.date, `"${p?.name || '---'}"`, s.quantity, s.totalValue, s.profit].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_vendas_lj_store.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Analíticos</h1>
          <p className="text-gray-500">Informações detalhadas sobre a saúde do seu negócio</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
        >
          <Download size={18} />
          <span>Exportar Dados (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100 uppercase text-xs font-bold tracking-widest">Receita Bruta Total</span>
            <TrendingUp size={20} className="text-emerald-200" />
          </div>
          <h2 className="text-3xl font-bold">R$ {reportData.totalRevenue.toLocaleString('pt-BR')}</h2>
          <p className="text-sm text-emerald-100 mt-2">Valor acumulado de todas as vendas</p>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-100 uppercase text-xs font-bold tracking-widest">Lucro Líquido Total</span>
            <PieChartIcon size={20} className="text-indigo-200" />
          </div>
          <h2 className="text-3xl font-bold">R$ {reportData.totalProfit.toLocaleString('pt-BR')}</h2>
          <p className="text-sm text-indigo-100 mt-2">Margem Média: {reportData.margin.toFixed(1)}%</p>
        </div>

        <div className="bg-rose-600 p-6 rounded-2xl text-white shadow-lg shadow-rose-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-100 uppercase text-xs font-bold tracking-widest">Investimento em Estoque</span>
            <TrendingDown size={20} className="text-rose-200" />
          </div>
          <h2 className="text-3xl font-bold">R$ {reportData.totalInvestment.toLocaleString('pt-BR')}</h2>
          <p className="text-sm text-rose-100 mt-2">Custo total das compras realizadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <BarChartIcon size={20} className="mr-2 text-indigo-500" /> Top 5 Produtos Mais Vendidos
          </h3>
          <div className="space-y-6">
            {reportData.topSelling.map((item, index) => (
              <div key={item.product} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-700">{index + 1}. {item.product}</span>
                  <span className="text-gray-900">{item.qty} un</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${(item.qty / reportData.topSelling[0].qty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {reportData.topSelling.length === 0 && (
              <p className="text-gray-500 text-center italic">Ainda não há dados suficientes para gerar este ranking.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText size={20} className="mr-2 text-indigo-500" /> Observações do Gestor
          </h3>
          <div className="prose prose-sm text-gray-600">
            <p>Com base nos dados atuais da <strong>LJ Online Store</strong>:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>A saúde financeira do estoque é considerada estável.</li>
              <li>A margem de lucro média de {reportData.margin.toFixed(1)}% está dentro dos padrões do setor.</li>
              <li>Recomenda-se focar na reposição dos produtos líderes de venda para evitar ruptura de estoque.</li>
              <li>O valor investido em estoque imobilizado é de R$ {reportData.totalInvestment.toLocaleString('pt-BR')}.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
