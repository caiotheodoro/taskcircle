'use client';

import React from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinanceChartProps {
  readonly data: Array<{
    month: string;
    earnings: number;
    spendings: number;
    balance: number;
  }>;
}

export default function FinanceChart({ data }: FinanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available. Register earnings and spendings to see the chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              iconType="rect"
              iconSize={12}
            />
            <Bar
              dataKey="earnings"
              fill="hsl(142, 76%, 36%)"
              name="Earnings"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="spendings"
              fill="hsl(0, 84%, 60%)"
              name="Spendings"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="balance"
              fill="hsl(221, 83%, 53%)"
              name="Balance"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
