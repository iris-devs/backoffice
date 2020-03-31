import Backdrop from '@material-ui/core/Backdrop'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import firebase from 'firebase'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Copyright from '../src/Copyright'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signIn = async () => {
    setLoading(true)
    error && setError(null)

    try {
      await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      await router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 1 }}>
        <CircularProgress color="inherit"/>
      </Backdrop>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        open={error !== null}
        autoHideDuration={10000}
        onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
      </Snackbar>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={6}>
          <Box m={1}>
            <Button onClick={signIn} color="primary" variant="contained">Login with Google</Button>
          </Box>
          <Copyright/>
        </Grid>
      </Grid>
    </>
  )
}
