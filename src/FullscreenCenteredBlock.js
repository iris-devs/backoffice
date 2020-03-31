import Grid from '@material-ui/core/Grid'
import React from 'react'

export default ({ children }) => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={6}>
      {children}
    </Grid>
  </Grid>
)