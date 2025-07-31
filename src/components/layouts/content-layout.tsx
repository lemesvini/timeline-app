import * as React from 'react';

import { Head } from '../seo';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
  hideTitle?: boolean;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className=''>
        <div className='mx-auto max-w-7xl'>
          {children}
        </div>
      </div>
    </>
  );
};
