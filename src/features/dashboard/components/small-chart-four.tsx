'use client';

// import { TrendingUp } from "lucide-react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  //   CardDescription,
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
import { TrendingUp } from 'lucide-react';
const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 285 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 264 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function SmallChartFour() {
  return (
    <Card className='h-[320px]'>
      <CardHeader className='items-center pb-4'>
        <CardTitle>Gráfico 4</CardTitle>
        <CardDescription>
          Mostrando visitantes totais dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid
                className='fill-[--color-desktop] opacity-20'
                gridType='circle'
              />
              <PolarAngleAxis dataKey='month' />
              <Radar
                dataKey='desktop'
                fill='var(--color-desktop)'
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Aumento de 5.2% no mês atual <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
