import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'

import * as Showdown from 'showdown'

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: '50%',
  },
})

export default function FeaturedPost({ post }) {
  if (!post) {
    return null
  }
  const classes = useStyles()
  const topicHtml = converter.makeHtml(post.text)
  let createdAt = null
  if (post.createdAt) {
    if (post.createdAt.constructor.name === 't') {
      createdAt = post.createdAt.seconds * 1000
    } else {
      createdAt = post.createdAt
    }
  }

  return (
    <CardActionArea component="a" href="#">
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {new Date(createdAt).toUTCString()}
            </Typography>
            <Typography variant="subtitle1" paragraph>{post.summary}</Typography>
            <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: topicHtml }}/>
          </CardContent>
        </div>
      </Card>
    </CardActionArea>
  )
}

FeaturedPost.propTypes = {
  post: PropTypes.object,
}
