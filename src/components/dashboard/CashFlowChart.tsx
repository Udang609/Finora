import React from 'react';
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
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';

export const CashFlowChart: React.FC = () => {
  const { setActivePage } = useFinance();

  // Monthly summary data
  const data = [
    { name: 'Jul', Pemasukan: 11000000, Pengeluaran: 4200000 },
    { name: 'Agu', Pemasukan: 9500000, Pengeluaran: 3800000 },
    { name: 'Sep', Pemasukan: 10500000, Pengeluaran: 4100000 },
    { name: 'Okt', Pemasukan: 11200000, Pengeluaran: 3900000 },
    { name: 'Nov', Pemasukan: 12500000, Pengeluaran: 3750000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
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

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(val) => `${val / 1000000} jt`}
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
    </div>
  );
};
