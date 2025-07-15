'use client';

import * as React from 'react';
// import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 190, fill: 'var(--chart-5)' },
];

const chartConfig = {
  visitors: {
    label: 'Novos',
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function SmallChartOne() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className='flex flex-col w-full h-[320px]'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='text-sm'>Gráfico 1</CardTitle>
        <CardDescription className='text-xs'>Janeiro - Maio 2025</CardDescription>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey='visitors'
                nameKey='browser'
                innerRadius={40}
                outerRadius={80}
                strokeWidth={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-2xl font-bold'
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className='fill-muted-foreground text-xs'
                          >
                            Novos
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-1 text-xs pt-2">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% <TrendingUp className="h-3 w-3" />
        </div>
      </CardFooter> */}
    </Card>
  );
}
