import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { ApiProvider } from '../lib/api-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApiProvider>
  );
} 