import { Helmet, HelmetData } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title} | Projeto Base` : undefined}
      defaultTitle='Projeto Base'
    >
      <meta name='description' content={description} />
    </Helmet>
  );
};
