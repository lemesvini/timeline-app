'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: 'Janeiro', desktop: 186, mobile: 80 },
  { month: 'Fevereiro', desktop: 305, mobile: 200 },
  { month: 'Março', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Maio', desktop: 209, mobile: 130 },
  { month: 'Junho', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function SmallChartTwo() {
  return (
    <Card className='h-[320px]'>
      <CardHeader>
        <CardTitle>Gráfico 2</CardTitle>
        <CardDescription>Janeiro - Maio 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dashed' />}
              />
              <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
              <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm hidden sm:flex'>
        <div className='flex gap-2 font-medium leading-none'>
          Aumento de 5.2% no mês atual <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Mostrando total de visitantes nos últimos meses
        </div>
      </CardFooter>
    </Card>
  );
}
