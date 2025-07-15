// import { useUser } from '@/lib/auth';
import { ContentLayout } from '@/components/layouts';
import { BigChart } from '@/features/dashboard/components/big-chart';
import { SmallChartFour } from '@/features/dashboard/components/small-chart-four';
import { SmallChartOne } from '@/features/dashboard/components/small-chart-one';
import { SmallChartThree } from '@/features/dashboard/components/small-chart-three';
import { SmallChartTwo } from '@/features/dashboard/components/small-chart-two';

const DashboardRoute = () => {
  return (
    <ContentLayout title='Dashboard' hideTitle>
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4'>
          <div>
            <SmallChartOne />
          </div>
          <div>
            <SmallChartTwo />
          </div>
          <div>
            <SmallChartThree />
          </div>
          <div>
            <SmallChartFour />
          </div>
        </div>
        <BigChart />
      </div>
    </ContentLayout>
  );
};

export default DashboardRoute;
