import React, { Fragment } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Selma Anwaltskanzlei - Finanzverwaltung</title>
        <meta name="description" content="Finanzmanagement-System für die Selma Anwaltskanzlei" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp; 