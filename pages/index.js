import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import MaterialTable from 'material-table';
import Link from 'next/link'
import React from 'react'
import {useManageTopics} from '../hooks'
import {useAuth} from '../hooks/auth'
import {dateFromFirebase} from '../src/utils/date'
import MessageStatusIcon from '../src/Message/MessageStatusIcon'
import MessageTypeIcon from '../src/Message/MessageTypeIcon'
import {PostModal} from '../src/Modal'
import tableIcons from '../src/tableIcons'

export default function Index() {
  const {user} = useAuth();
  const classes = useStyles();
  const {messages, deleteTopic} = useManageTopics(user);

  const data = messages
      .map(message => ({
        ...message,
        createdAt: dateFromFirebase(message.createdAt),
      }));

  return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialTable
              actions={[{
                iconProps: {},
                icon: () => (<PostModal topic={{}} user={user} mode="create"/>),
                isFreeAction: true
              }]}
              icons={tableIcons}
              title="Messages"
              options={{
                filtering: true,
                sorting: true,
                pageSize: 10
              }}
              columns={[
                {
                  title: 'Status',
              render: (message) => <MessageStatusIcon {...message} />,
            },
            {
              title: 'Type',
              render: ({ type }) => <MessageTypeIcon type={type}/>,
            },
                {
                  title: 'Date',
                  field: 'createdAt',
                  type: 'date',
                  defaultSort: 'desc',
                  render: ({createdAt}) => createdAt.toLocaleString(),
                },
            {
              title: 'Title',
              field: 'title',
              render: ({ id, title }) => (
                <Link href="/details/[id]" as={`/details/${id}`}>
                  <a>{title}</a>
                </Link>
              ),
              customSort: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
            },
            {
              sorting: false,
              title: 'Actions', render: (message) => {
                return <>
                  {message.author === user.uid && (
                      <PostModal topic={message} user={user} type="update"/>
                  )}
                  {message.author === user.uid && !message.isDeleted && (
                      <IconButton aria-label="delete" className={classes.margin}
                                  onClick={() => deleteTopic(message.id)}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                  )}
                </>
              },
            },
          ]}
              data={data}
        />
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
