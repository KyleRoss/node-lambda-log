import { navigate } from 'gatsby';

const DocsPage = () => {
  if(typeof window !== 'undefined') {
    navigate('/docs/getting-started/');
  }

  return null;
};

export default DocsPage;
