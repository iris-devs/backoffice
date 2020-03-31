import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useAuth, useQuestionSubscription } from '../hooks'
import { Detail } from '../src/Question'

export default function Questions({}) {
  const { user } = useAuth()
  const { questions } = useQuestionSubscription()
  const questionsArr = Object.keys(questions)

  if (!user) {
    return 'Authenticating...'
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={12}>
        <div>Questions list</div>
        {questionsArr &&
        questionsArr.map(key => {
          return (
            <Detail
              key={key}
              question={questions[key]}
              questionId={key}
            />
          )
        })}
      </Grid>
    </Grid>
  )
}