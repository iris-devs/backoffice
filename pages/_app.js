import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { useAuth } from '../hooks'
import CircularProgress from '@material-ui/core/CircularProgress';

import initFirebase from '../src/firebase'
import FullscreenCenteredBlock from '../src/FullscreenCenteredBlock'
import Layout from '../src/Layout'
import theme from '../src/theme'

initFirebase()

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const currentRoute = router.pathname

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const { user } = useAuth()

  return (
    <>
      <Head>
        <title>IRIS</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {currentRoute === '/login' ? (
          <Component {...pageProps}/>
        ) : (
          user ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <FullscreenCenteredBlock>
              <CircularProgress title="Loading..." />
            </FullscreenCenteredBlock>
          )
        )}
      </ThemeProvider>
    </>
  )
}