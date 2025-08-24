import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
}

export function SimpleBarChart({ data, title, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" style={{ height }}>
          {data.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ${item.value.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color || '#3b82f6'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface PieChartProps {
  data: ChartData[];
  title: string;
}

export function SimplePieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">${item.value.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
