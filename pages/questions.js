import Grid from '@material-ui/core/Grid'
import MaterialTable from 'material-table'
import React from 'react'
import {useQuestionSubscription} from '../hooks'
import {useAuth} from '../hooks/auth'
import {dateFromFirebase} from '../src/utils/date'
import AnswerForm from '../src/Question/AnswerForm'
import tableIcons from '../src/tableIcons'

export default function Questions({}) {
    const {user} = useAuth()
    const {questions} = useQuestionSubscription(user)

    const data = questions
        .map((question) => ({
            ...question,
            createdAt: dateFromFirebase(question.createdAt)
        }));

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <MaterialTable
                    title="Questions"
                    options={{
                        filtering: true,
                        pageSize: 10,
                        sorting: true
                    }}
          columns={[{
            title: 'Title',
            field: 'title',
          }, {
            title: 'Author',
            field: 'authorName',
          }, {
              title: 'Date',
              field: 'createdAt',
              type: 'date',
              defaultSort: 'desc',
              render: ({createdAt}) => createdAt.toLocaleString()
          }, {
            title: 'Likes',
            field: 'likes',
            type: 'numeric',
            filtering: false
          }, {
            title: 'Answered',
            field: 'comment',
            type: 'boolean',
          }]}
          data={data}
          icons={tableIcons}
          detailPanel={({ id, body, comment }) => (
            <div style={{ padding: 20, background: '#fafafa' }}>
              <div>{body}</div>
              <AnswerForm
                questionId={id}
                comment={comment}
              />
            </div>
          )}
        />
      </Grid>
    </Grid>
  )
}
