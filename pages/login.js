import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import firebase from 'firebase'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Copyright from '../src/Copyright'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const signIn = async () => {
    setLoading(true);

    try {
      await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      await router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>
      <Container maxWidth="sm">
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Button onClick={signIn}>Login with Google</Button>
        </Grid>
        <Copyright/>
      </Container>
    </>
  )
}
