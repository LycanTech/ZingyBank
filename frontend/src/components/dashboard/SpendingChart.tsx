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
    <div className="bg-bank-card rounded-xl border border-bank-border">
      <div className="px-5 py-4 border-b border-bank-border">
        <h3 className="text-base font-semibold text-bank-text">Balance Trend</h3>
        <p className="text-xs text-bank-muted mt-0.5">Last 7 days</p>
      </div>
      <div className="px-2 py-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2440" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={currencyFormatter}
              width={70}
            />
            <Tooltip
              formatter={(value: number | undefined) => [currencyFormatter(value ?? 0), 'Balance']}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #1e2440',
                background: '#141625',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                fontSize: '13px',
                color: '#e2e8f0',
              }}
              labelStyle={{ color: '#64748b', marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
