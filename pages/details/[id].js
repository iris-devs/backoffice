import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { useTopicSubscription } from '../../hooks'
import FeaturedPost from '../../src/FeaturedPost'

export default function Detail({ id }) {
  const { topic } = useTopicSubscription(id)

  return (
    <Grid container spacing={3}>
      {topic ? <FeaturedPost post={topic}/> : null}
    </Grid>
  )
}

Detail.getInitialProps = async ({ req, query }) => {
  const user = req && req.session ? req.session.decodedToken : null

  return { user, id: query.id }
}