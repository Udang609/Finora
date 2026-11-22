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
import { useChartColors } from '../../hooks/useChartColors';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const { tooltipBg, tooltipBorder, tooltipColor, incomeFill, expenseFill } = useChartColors();
  
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: tooltipBg,
        border: `1px solid ${tooltipBorder}`,
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        fontSize: '12px',
        color: tooltipColor,
      }}>
        <p style={{ fontWeight: 600, marginBottom: '8px', color: tooltipColor }}>{label} 2026</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', margin: 0, color: incomeFill, fontWeight: 500 }}>
            <span>Pemasukan:</span>
            <span>{formatIDR(payload[0]?.value || 0)}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', margin: 0, color: expenseFill, fontWeight: 500 }}>
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
  const { gridStroke, axisTickFill, incomeFill, expenseFill, legendColor } = useChartColors();

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

  const hasAnyData = useMemo(() => {
    return data.some((m) => m.Pemasukan > 0 || m.Pengeluaran > 0);
  }, [data]);

  return (
    <div className="card card-hover p-5 flex flex-col justify-between">
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
        <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-finora-bgTeritary/60 rounded-xl border border-dashed border-finora-border">
          <div className="w-12 h-12 rounded-full bg-finora-lightBlue text-finora-primary flex items-center justify-center mb-3 dark:bg-finora-light-blue">
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisTickFill, fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisTickFill, fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000000} jt`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', color: legendColor }}
              />
              <Bar dataKey="Pemasukan" fill={incomeFill} radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Pengeluaran" fill={expenseFill} radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};