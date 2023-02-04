import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect, useState } from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Proxima+Nova:wght@700&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
