'use client';

// import * as React from 'react';
// import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const desktopData = [
  { month: 'january', desktop: 186, fill: 'var(--color-january)' },
  { month: 'february', desktop: 305, fill: 'var(--color-february)' },
  { month: 'march', desktop: 237, fill: 'var(--color-march)' },
  { month: 'april', desktop: 173, fill: 'var(--color-april)' },
  { month: 'may', desktop: 209, fill: 'var(--color-may)' },
];

const mobileData = [
  { month: 'january', mobile: 80, fill: 'var(--color-january)' },
  { month: 'february', mobile: 200, fill: 'var(--color-february)' },
  { month: 'march', mobile: 120, fill: 'var(--color-march)' },
  { month: 'april', mobile: 190, fill: 'var(--color-april)' },
  { month: 'may', mobile: 130, fill: 'var(--color-may)' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
  },
  mobile: {
    label: 'Mobile',
  },
  january: {
    label: 'January',
    color: 'var(--chart-1)',
  },
  february: {
    label: 'February',
    color: 'var(--chart-2)',
  },
  march: {
    label: 'March',
    color: 'var(--chart-3)',
  },
  april: {
    label: 'April',
    color: 'var(--chart-4)',
  },
  may: {
    label: 'May',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function SmallChartThree() {
  return (
    <Card className='flex flex-col h-[320px]'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Gráfico 3</CardTitle>
        <CardDescription>Janeiro - Maio 2025</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey='visitors'
                  nameKey='month'
                  indicator='line'
                  labelFormatter={(_, payload) => {
                    return chartConfig[
                      payload?.[0].dataKey as keyof typeof chartConfig
                    ].label;
                  }}
                />
              }
            />
            <Pie data={desktopData} dataKey='desktop' outerRadius={60} />
            <Pie
              data={mobileData}
              dataKey='mobile'
              innerRadius={70}
              outerRadius={90}
            />
          </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
