import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calendar, PieChart } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const FinancePanel: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useData();
  
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    try {
      await addTransaction({
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        date: form.date,
        category: form.category || 'Geral'
      });
      setIsAdding(false);
      setForm({
        description: '',
        amount: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        category: ''
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar transação. Verifique se a tabela foi criada no Supabase.');
    }
  };

  const metrics = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Group transactions by month-year
    const grouped = transactions.reduce((acc: any, t) => {
      const date = new Date(t.date);
      // Ensure month is 2 digits
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthStr]) {
        acc[monthStr] = { name: monthStr, receitas: 0, despesas: 0 };
      }
      if (t.type === 'income') acc[monthStr].receitas += t.amount;
      else acc[monthStr].despesas += t.amount;
      return acc;
    }, {});

    // Convert to array and sort chronologically
    return Object.values(grouped).sort((a: any, b: any) => a.name.localeCompare(b.name)).slice(-6); // Last 6 months
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-1 text-gold">Controle Financeiro</h1>
          <p className="text-gold/40 text-sm">Acompanhe suas receitas, despesas e lucro líquido.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="gold-bg-gradient text-navy px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-all"
        >
          {isAdding ? 'Cancelar' : <><Plus size={20} /> Nova Transação</>}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-light rounded-3xl border border-gold/10 p-6 flex items-center gap-4 shadow-xl">
          <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-gold/40 text-xs font-bold uppercase tracking-widest mb-1">Entradas</div>
            <div className="text-2xl font-serif font-bold text-green-500">
              R$ {metrics.income.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-navy-light rounded-3xl border border-gold/10 p-6 flex items-center gap-4 shadow-xl">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <TrendingDown size={28} />
          </div>
          <div>
            <div className="text-gold/40 text-xs font-bold uppercase tracking-widest mb-1">Saídas</div>
            <div className="text-2xl font-serif font-bold text-red-500">
              R$ {metrics.expense.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-navy-light rounded-3xl border border-gold/10 p-6 flex items-center gap-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
          <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center text-gold relative z-10">
            <DollarSign size={28} />
          </div>
          <div className="relative z-10">
            <div className="text-gold/40 text-xs font-bold uppercase tracking-widest mb-1">Saldo Atual</div>
            <div className={`text-2xl font-serif font-bold ${metrics.balance >= 0 ? 'text-gold' : 'text-red-500'}`}>
              R$ {metrics.balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-navy-light rounded-3xl border border-gold/10 p-6 shadow-xl flex flex-col">
          <h2 className="text-gold font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-gold/60" /> 
            Fluxo de Caixa (Últimos Meses)
          </h2>
          <div className="flex-grow min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#050B18" opacity={0.05} vertical={false} />
                  <XAxis dataKey="name" stroke="#050B18" opacity={0.3} tick={{ fill: '#050B18', opacity: 0.6, fontSize: 12 }} />
                  <YAxis stroke="#050B18" opacity={0.3} tick={{ fill: '#050B18', opacity: 0.6, fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#050B18', opacity: 0.03 }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D4AF3730', borderRadius: '12px', color: '#050B18' }}
                    itemStyle={{ color: '#050B18' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#050B18', opacity: 0.7 }} />
                  <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gold/20 flex-col gap-3">
                <PieChart size={48} strokeWidth={1} />
                <span>Nenhum dado suficiente para o gráfico.</span>
              </div>
            )}
          </div>
        </div>

        {/* Transactions List or Form */}
        <div className="bg-navy-light rounded-3xl border border-gold/10 p-6 shadow-xl flex flex-col">
          {isAdding ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-4 flex-grow flex flex-col"
            >
              <h2 className="text-gold font-serif font-bold text-lg mb-2">Nova Transação</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <label className={`p-3 rounded-full border flex flex-col items-center gap-1 cursor-pointer transition-all ${form.type === 'income' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gold/10 text-gold/40 hover:border-gold/30'}`}>
                  <input type="radio" name="type" value="income" className="hidden" checked={form.type === 'income'} onChange={() => setForm({...form, type: 'income'})} />
                  <TrendingUp size={20} />
                  <span className="text-xs font-bold uppercase">Receita</span>
                </label>
                <label className={`p-3 rounded-full border flex flex-col items-center gap-1 cursor-pointer transition-all ${form.type === 'expense' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gold/10 text-gold/40 hover:border-gold/30'}`}>
                  <input type="radio" name="type" value="expense" className="hidden" checked={form.type === 'expense'} onChange={() => setForm({...form, type: 'expense'})} />
                  <TrendingDown size={20} />
                  <span className="text-xs font-bold uppercase">Despesa</span>
                </label>
              </div>

              <div className="space-y-1 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold/40">Descrição</label>
                <input 
                  type="text" required
                  placeholder="Ex: Venda Terço Cristal"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold/40">Valor (R$)</label>
                  <input 
                    type="number" step="0.01" required
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold/40">Data</label>
                  <input 
                    type="date" required
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`w-full py-4 rounded-full font-bold uppercase text-xs tracking-widest mt-auto shadow-lg transition-all ${form.type === 'income' ? 'bg-green-500 text-navy hover:bg-green-400' : 'bg-red-500 text-white hover:bg-red-400'}`}
              >
                Salvar Transação
              </button>
            </motion.form>
          ) : (
            <div className="flex flex-col flex-grow">
              <h2 className="text-gold font-serif font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-gold/60" /> 
                Histórico Recente
              </h2>
              
              <div className="flex-grow overflow-y-auto pr-2 no-scrollbar space-y-3">
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((t) => (
                    <div key={t.id} className="bg-navy rounded-xl border border-gold/5 p-3 flex justify-between items-center group hover:border-gold/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div>
                          <div className="text-gold font-bold text-sm truncate max-w-[120px] sm:max-w-[150px]">{t.description}</div>
                          <div className="text-[10px] text-gold/40">{new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm('Deseja realmente excluir esta transação?')) {
                              deleteTransaction(t.id);
                            }
                          }}
                          className="text-red-500/0 group-hover:text-red-500/60 hover:!text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gold/40 py-10 flex flex-col items-center gap-2">
                    <DollarSign size={32} className="opacity-20" />
                    <p className="text-sm">Nenhuma transação registrada.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
