import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Calendar, 
  PieChart as PieIcon,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIDR } from '../../utils/formatters';
import type { Transaction } from '../../types';
import { useChartColors } from '../../hooks/useChartColors';

type ReportPeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

const DAY_MS = 86400000;

const parseISODate = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

interface ChartBucket {
  name: string;
  Pemasukan: number;
  Pengeluaran: number;
}

const buildBarChartData = (
  transactions: Transaction[],
  period: ReportPeriod,
  customStartDate: string,
  customEndDate: string
): ChartBucket[] => {
  let buckets: ChartBucket[] = [];

  if (period === 'today') {
    buckets = [{ name: 'Hari Ini', Pemasukan: 0, Pengeluaran: 0 }];
    transactions.forEach((tx) => {
      if (tx.type === 'income') buckets[0].Pemasukan += tx.amount;
      else buckets[0].Pengeluaran += tx.amount;
    });
    return buckets;
  }

  if (period === 'week') {
    const start = parseISODate('2026-11-15');
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    buckets = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start.getTime() + i * DAY_MS);
      return { name: dayNames[date.getUTCDay()], Pemasukan: 0, Pengeluaran: 0 };
    });
    transactions.forEach((tx) => {
      const offset = Math.floor((parseISODate(tx.date).getTime() - start.getTime()) / DAY_MS);
      if (offset >= 0 && offset < 7) {
        if (tx.type === 'income') buckets[offset].Pemasukan += tx.amount;
        else buckets[offset].Pengeluaran += tx.amount;
      }
    });
    return buckets;
  }

  if (period === 'month') {
    buckets = Array.from({ length: 5 }, (_, i) => ({
      name: `Minggu ${i + 1}`,
      Pemasukan: 0,
      Pengeluaran: 0,
    }));
    transactions.forEach((tx) => {
      const day = Number(tx.date.substring(8, 10));
      const index = Math.min(4, Math.floor((day - 1) / 7));
      if (tx.type === 'income') buckets[index].Pemasukan += tx.amount;
      else buckets[index].Pengeluaran += tx.amount;
    });
    return buckets;
  }

  if (period === 'year') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    buckets = monthNames.map((name) => ({ name, Pemasukan: 0, Pengeluaran: 0 }));
    transactions.forEach((tx) => {
      const index = Number(tx.date.substring(5, 7)) - 1;
      if (index >= 0 && index < 12) {
        if (tx.type === 'income') buckets[index].Pemasukan += tx.amount;
        else buckets[index].Pengeluaran += tx.amount;
      }
    });
    return buckets;
  }

  // Custom range: bagi menjadi kelompok 7 hari
  const start = parseISODate(customStartDate);
  const end = parseISODate(customEndDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return [];
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
  const groupCount = Math.max(1, Math.ceil(totalDays / 7));
  buckets = Array.from({ length: groupCount }, (_, i) => {
    const offsetStart = i * 7;
    const offsetEnd = Math.min(offsetStart + 6, totalDays - 1);
    const d1 = new Date(start.getTime() + offsetStart * DAY_MS);
    const d2 = new Date(start.getTime() + offsetEnd * DAY_MS);
    const label = (date: Date) =>
      `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    return {
      name: `${label(d1)} - ${label(d2)}`,
      Pemasukan: 0,
      Pengeluaran: 0,
    };
  });
  transactions.forEach((tx) => {
    const offset = Math.floor((parseISODate(tx.date).getTime() - start.getTime()) / DAY_MS);
    const index = Math.floor(offset / 7);
    if (index >= 0 && index < buckets.length) {
      if (tx.type === 'income') buckets[index].Pemasukan += tx.amount;
      else buckets[index].Pengeluaran += tx.amount;
    }
  });
  return buckets;
};

export const ReportsPage: React.FC = () => {
  const { transactions } = useFinance();

  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [customStartDate, setCustomStartDate] = useState('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState('2026-11-30');

  // Filter transactions according to selected period
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (period === 'today') {
        return tx.date === '2026-11-19';
      }
      if (period === 'week') {
        // Between Nov 15 and Nov 21 2026
        return tx.date >= '2026-11-15' && tx.date <= '2026-11-21';
      }
      if (period === 'month') {
        return tx.date.startsWith('2026-11');
      }
      if (period === 'year') {
        return tx.date.startsWith('2026');
      }
      if (period === 'custom') {
        return tx.date >= customStartDate && tx.date <= customEndDate;
      }
      return true;
    });
  }, [transactions, period, customStartDate, customEndDate]);

  // Aggregations
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // Expense distribution by category
  const expenseByCategory = useMemo(() => {
    const map: { [cat: string]: number } = {};
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Income distribution by category
  const incomeByCategory = useMemo(() => {
    const map: { [cat: string]: number } = {};
    filteredTransactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Top categories
  const topExpenseCategory = expenseByCategory[0] || null;
  const topIncomeCategory = incomeByCategory[0] || null;

  // Chart data: dihitung dari transaksi nyata sesuai periode terpilih
  const barChartData = buildBarChartData(
    filteredTransactions,
    period,
    customStartDate,
    customEndDate
  );

  const hasBarChartData = barChartData.some(
    (bucket) => bucket.Pemasukan > 0 || bucket.Pengeluaran > 0
  );

  const { 
    gridStroke, 
    axisTickFill, 
    tooltipBg, 
    tooltipBorder, 
    tooltipColor, 
    legendColor, 
    incomeFill, 
    expenseFill,
    pieColors 
  } = useChartColors();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-finora-textPrimary">
            Laporan Keuangan
          </h2>
          <p className="text-xs sm:text-sm text-finora-textSecondary mt-1">
            Analisis arus kas, distribusi kategori, dan perbandingan kondisi keuangan
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 bg-finora-bgSecondary border border-finora-border rounded-xl shadow-soft">
          {(['today', 'week', 'month', 'year', 'custom'] as ReportPeriod[]).map((p) => {
            const labels: { [k in ReportPeriod]: string } = {
              today: 'Hari Ini',
              week: 'Minggu Ini',
              month: 'Bulan Ini',
              year: 'Tahun Ini',
              custom: 'Custom',
            };
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p
                    ? 'bg-finora-primary text-white shadow-sm'
                    : 'text-finora-textSecondary hover:text-finora-textPrimary'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date Picker inputs if Custom selected */}
      {period === 'custom' && (
        <div className="card card-hover p-4 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-finora-primary" />
          <span className="text-xs font-semibold text-finora-textPrimary">Rentang Tanggal:</span>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="input-field text-xs w-auto"
          />
          <span className="text-xs text-finora-textMuted">sampai</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="input-field text-xs w-auto"
          />
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card card-hover p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Pemasukan
            </span>
            <div className="w-8 h-8 rounded-lg bg-finora-greenLight text-finora-green flex items-center justify-center dark:bg-finora-green-light">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-green">
            {formatIDR(totalIncome)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-finora-green" />
            <span>Pemasukan aktif periode ini</span>
          </p>
        </div>

        <div className="card card-hover p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-lg bg-finora-redLight text-finora-red flex items-center justify-center dark:bg-finora-red-light">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-finora-red">
            {formatIDR(totalExpense)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-finora-red" />
            <span>Total dana keluar</span>
          </p>
        </div>

        <div className="card card-hover p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-finora-textSecondary tracking-wider">
              Arus Kas Bersih
            </span>
            <div className="w-8 h-8 rounded-lg bg-finora-lightBlue text-finora-primary flex items-center justify-center dark:bg-finora-light-blue">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <h3
            className={`text-xl sm:text-2xl font-bold ${
              netCashFlow >= 0 ? 'text-finora-primary' : 'text-finora-red'
            }`}
          >
            {formatIDR(netCashFlow)}
          </h3>
          <p className="text-xs text-finora-textSecondary mt-1">
            {netCashFlow >= 0 ? 'Surplus anggaran tercatat' : 'Defisit (pengeluaran > pemasukan)'}
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Comparison Chart */}
        <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-finora-primary" />
              Grafik Pemasukan vs Pengeluaran
            </h3>
            <p className="text-xs text-finora-textSecondary mt-0.5">
              Rincian komparasi arus kas berkala
            </p>
          </div>

          {!hasBarChartData ? (
            <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-finora-bgTeritary/60 rounded-xl border border-dashed border-finora-border">
              <div className="w-12 h-12 rounded-full bg-finora-lightBlue text-finora-primary flex items-center justify-center mb-3 dark:bg-finora-light-blue">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-finora-textPrimary">
                Belum Ada Data Arus Kas
              </h4>
              <p className="text-xs text-finora-textSecondary mt-1 max-w-xs leading-relaxed">
                Grafik akan terisi otomatis setelah ada transaksi pemasukan atau pengeluaran pada periode ini.
              </p>
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisTickFill, fontSize: 11 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisTickFill, fontSize: 11 }}
                    tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000000} jt`)}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatIDR(Number(value)), '']}
                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: `1px solid ${tooltipBorder}`, fontSize: '12px', color: tooltipColor }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px', color: legendColor }} />
                  <Bar dataKey="Pemasukan" fill={incomeFill} radius={[6, 6, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Pengeluaran" fill={expenseFill} radius={[6, 6, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expense by Category Pie / Donut Chart */}
        <div className="bg-white rounded-card p-5 border border-finora-border shadow-soft flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-finora-purple" />
              Pengeluaran Berdasarkan Kategori
            </h3>
            <p className="text-xs text-finora-textSecondary mt-0.5">
              Distribusi porsi biaya yang dikeluarkan
            </p>
          </div>

          {expenseByCategory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-finora-textMuted">
              Tidak ada data pengeluaran pada periode ini
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatIDR(Number(val)), 'Nominal']}
                    contentStyle={{ backgroundColor: tooltipBg, borderRadius: '12px', border: `1px solid ${tooltipBorder}`, fontSize: '12px', color: tooltipColor }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: legendColor }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Financial Insights & Analysis Box (Bab 4.5 Analisis Keuangan) */}
      <div className="card card-hover p-5 sm:p-6">
        <h3 className="text-base font-semibold text-finora-textPrimary flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Analisis Keuangan Finora
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Insight 1: Kategori Terbesar */}
          <div className="p-4 bg-finora-bgTeritary rounded-xl border border-finora-border">
            <span className="text-[11px] font-semibold uppercase text-finora-textMuted block mb-1">
              Pengeluaran Terbesar
            </span>
            {topExpenseCategory ? (
              <>
                <p className="text-sm font-bold text-finora-textPrimary">
                  {topExpenseCategory.name}
                </p>
                <p className="text-xs text-finora-red font-semibold mt-0.5">
                  {formatIDR(topExpenseCategory.value)}
                  <span className="text-finora-textSecondary font-normal ml-1">
                    ({totalExpense > 0 ? Math.round((topExpenseCategory.value / totalExpense) * 100) : 0}%)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-xs text-finora-textMuted">Belum ada pengeluaran</p>
            )}
          </div>

          {/* Insight 2: Pemasukan Utama */}
          <div className="p-4 bg-finora-bgTeritary rounded-xl border border-finora-border">
            <span className="text-[11px] font-semibold uppercase text-finora-textMuted block mb-1">
              Sumber Pemasukan Terbesar
            </span>
            {topIncomeCategory ? (
              <>
                <p className="text-sm font-bold text-finora-textPrimary">
                  {topIncomeCategory.name}
                </p>
                <p className="text-xs text-finora-green font-semibold mt-0.5">
                  {formatIDR(topIncomeCategory.value)}
                  <span className="text-finora-textSecondary font-normal ml-1">
                    ({totalIncome > 0 ? Math.round((topIncomeCategory.value / totalIncome) * 100) : 0}%)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-xs text-finora-textMuted">Belum ada pemasukan</p>
            )}
          </div>

          {/* Insight 3: Rasio Tabungan */}
          <div className="p-4 bg-finora-bgTeritary rounded-xl border border-finora-border">
            <span className="text-[11px] font-semibold uppercase text-finora-textMuted block mb-1">
              Tingkat Simpanan (Saving Ratio)
            </span>
            <p className="text-sm font-bold text-finora-primary">
              {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
            </p>
            <p className="text-xs text-finora-textSecondary mt-0.5">
              {netCashFlow >= 0 ? 'Kondisi finansial berada dalam tingkat aman.' : 'Waspada: pengeluaran lebih tinggi dari pemasukan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
