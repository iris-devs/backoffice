import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { useCommentsSubscription, useTopicSubscription } from '../../hooks'
import FeaturedPost from '../../src/FeaturedPost'
import Questions from '../../src/Questions'

export default function Detail({ id }) {
  const { topic } = useTopicSubscription(id)
  const { comments } = useCommentsSubscription(id)

  return (
    <Grid container spacing={3}>
      {topic ? <FeaturedPost post={topic}/> : null}
      <Grid item xs={12} md={8} lg={9}>
        <Paper style={{ marginTop: 20, padding: 10 }}>
          <Questions questions={comments}/>
        </Paper>
      </Grid>
    </Grid>
  )
}

Detail.getInitialProps = async ({ req, query }) => {
  const user = req && req.session ? req.session.decodedToken : null

  return { user, id: query.id }
}