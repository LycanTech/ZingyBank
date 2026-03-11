import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const generateMockData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseBalance = 12400;
  return days.map((day, i) => ({
    day,
    balance: baseBalance + Math.round((Math.sin(i * 0.8) + 1) * 800 + Math.random() * 400),
  }));
};

const mockData = generateMockData();

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const SpendingChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm">
      <div className="px-5 py-4 border-b border-bank-border">
        <h3 className="text-lg font-semibold text-bank-text">Balance Trend</h3>
        <p className="text-xs text-bank-muted mt-0.5">Last 7 days</p>
      </div>
      <div className="px-2 py-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fecaca" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#fecaca" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={currencyFormatter}
              width={70}
            />
            <Tooltip
              formatter={(value: number | undefined) => [currencyFormatter(value ?? 0), 'Balance']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#dc2626"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
