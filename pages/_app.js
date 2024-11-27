import Head from "next/head";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr/_internal";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { useEffect } from "react";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps: { session, ...pageProps } }) {

    useEffect(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
              console.log('Service Worker registriert:', registration);
            })
            .catch((error) => {
              console.error('Fehler bei der Service Worker-Registrierung:', error);
            });
        }
      }, []);


    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <title>Plan-T</title>
                <meta name="description" content="Optimiere deine Pflanzen" />
                <link rel="shortcut icon" href="/icons/icon-192x192.png" />
                <link rel="mask-icon" href="/icons/icon-192x192.png" color="#FFFFFF" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link
                    rel="apple-touch-icon"
                    sizes="512x512"
                    href="/icons/icon-512x512.png"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://yourdomain.com" />
                <meta name="twitter:title" content="Plan-T" />
                <meta name="twitter:description" content="Optimiere deine Pflanzen" />
                <meta name="twitter:image" content="/icons/icon-512x512.png" />
                <meta name="twitter:creator" content="@DavidWShadow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Plan-T" />
                <meta property="og:description" content="Optimiere deine Pflanzen" />
                <meta property="og:site_name" content="Plan-T" />
                <meta property="og:url" content="https://yourdomain.com" />
                <meta property="og:image" content="/icons/icon-512x512.png" />
            </Head>
            <SessionProvider session={session}>
                <GlobalStyle />
                <SWRConfig value={{ fetcher }}>
                    <Component {...pageProps}/>
                    <SpeedInsights />
                    <Analytics />
                </SWRConfig>
            </SessionProvider>
        </>
    );
}
