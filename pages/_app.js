import Head from 'next/head'
import GlobalContextProvider from '../context/GlobalContextProvider'
import dynamic from 'next/dynamic';
import '../styles/globals.css'
import "nprogress/nprogress.css";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
          <title>amstore.id e-commerce</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="amstore.id e-commerce for buy your products favor"/>
          <meta name="author" content="Aam Hermansyah" />
          <meta name="keywords" content="E-Commerce, Buy, Sell, Products, Favor, Online" />
      </Head>
      <GlobalContextProvider>
        <TopProgressBar />
        <Component {...pageProps} />
      </GlobalContextProvider>
    </>
  )
}

export default MyApp
