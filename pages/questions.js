import Grid from '@material-ui/core/Grid'
import React from 'react'
import { useQuestionSubscription } from '../hooks'
import QuestionList from '../src/Question/QuestionList'

export default function Questions({}) {
  const { questions } = useQuestionSubscription()

  const dataSource = Object
    .entries(questions)
    .map(([id, question]) => ({
      ...question,
      id,
    }))

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={12}>
        <QuestionList dataSource={dataSource}/>
      </Grid>
    </Grid>
  )
}