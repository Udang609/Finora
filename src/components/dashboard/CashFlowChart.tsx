import React, { useMemo } from 'react';
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
import { TrendingUp, ArrowUpRight, BarChart2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3.5 rounded-xl border border-finora-border shadow-soft-lg text-xs">
        <p className="font-semibold text-finora-textPrimary mb-2">{label} 2026</p>
        <div className="space-y-1.5">
          <p className="flex items-center justify-between gap-4 text-emerald-600 font-medium">
            <span>Pemasukan:</span>
            <span>{formatIDR(payload[0]?.value || 0)}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-red-600 font-medium">
            <span>Pengeluaran:</span>
            <span>{formatIDR(payload[1]?.value || 0)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const MONTHS_CONFIG = [
  { key: '2026-07', name: 'Jul' },
  { key: '2026-08', name: 'Agu' },
  { key: '2026-09', name: 'Sep' },
  { key: '2026-10', name: 'Okt' },
  { key: '2026-11', name: 'Nov' },
];

export const CashFlowChart: React.FC = () => {
  const { transactions, setActivePage } = useFinance();

  // Hitung data aktual berdasarkan transaksi pengguna
  const data = useMemo(() => {
    return MONTHS_CONFIG.map(({ key, name }) => {
      const monthlyIncome = transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(key))
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpense = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(key))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name,
        Pemasukan: monthlyIncome,
        Pengeluaran: monthlyExpense,
      };
    });
  }, [transactions]);

  // Cek apakah ada transaksi pemasukan atau pengeluaran riil
  const hasAnyData = useMemo(() => {
    return data.some((m) => m.Pemasukan > 0 || m.Pengeluaran > 0);
  }, [data]);

  return (
    <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-finora-primary" />
            Grafik Pemasukan vs Pengeluaran
          </h3>
          <p className="text-xs text-finora-textSecondary mt-0.5">
            Perbandingan tren arus kas 5 bulan terakhir
          </p>
        </div>
        <button
          onClick={() => setActivePage('reports')}
          className="text-xs font-medium text-finora-primary hover:text-finora-primaryDark flex items-center gap-1 hover:underline"
        >
          Lihat Detail
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {!hasAnyData ? (
        <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-finora-primary flex items-center justify-center mb-3">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-finora-textPrimary">
            Belum Ada Data Arus Kas
          </h4>
          <p className="text-xs text-finora-textSecondary mt-1 max-w-xs leading-relaxed">
            Grafik perbandingan pemasukan dan pengeluaran akan otomatis terisi saat Anda mulai mencatat transaksi.
          </p>
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000000} jt`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="Pemasukan" fill="#16A34A" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Pengeluaran" fill="#DC2626" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
