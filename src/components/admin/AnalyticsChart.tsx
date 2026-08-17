'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  unlocks: number;
  copies: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3.5 rounded-2xl border border-white/20 shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-white/90">{label}</p>
        <p className="text-emerald-400 font-medium">
          Views: {payload[0]?.value?.toLocaleString()}
        </p>
        <p className="text-cyan-400 font-medium">
          Unlocks: {payload[1]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const AnalyticsChart: React.FC<{ data: AnalyticsDataPoint[] }> = ({
  data,
}) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="unlocksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255, 255, 255, 0.3)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.3)"
            fontSize={11}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#viewsGradient)"
          />
          <Area
            type="monotone"
            dataKey="unlocks"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#unlocksGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
