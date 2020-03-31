import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import MaterialTable from 'material-table'
import Link from 'next/link'
import React from 'react'
import { useManageTopics } from '../hooks'
import { useAuth } from '../hooks/auth'
import { dateFromFirebase } from '../src/utils/date'
import MarkdownEditor from '../src/MarkdownEditor'
import MessageStatusIcon from '../src/Message/MessageStatusIcon'
import MessageTypeIcon from '../src/Message/MessageTypeIcon'
import { PostEditModal } from '../src/Modal'
import tableIcons from '../src/tableIcons'

export default function Index() {
  const { user } = useAuth()
  const classes = useStyles()
  const [title, setTitle] = React.useState('')
  const [text, setText] = React.useState('')
  const [summary, setSummary] = React.useState('')
  const [isPublished, setIsPublished] = React.useState(true)
  const [type, setType] = React.useState('info')
  const { createTopic, messages, deleteTopic } = useManageTopics(user)

  const submitTopic = e => {
    e.preventDefault()
    console.log(`creating topic: ${title}, ${text}, ${isPublished}`)
    setTitle('')
    setText('')
    setSummary('')
    createTopic(text, title, user.name, isPublished, summary, type)
  }

  const data = Object.entries(messages)
    .map(([id, message]) => ({
      ...message,
      id,
      createdAt: dateFromFirebase(message.createdAt),
    }))

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={12}>
        <MaterialTable
          icons={tableIcons}
          title="Messages"
          options={{
            filtering: true,
            sorting: true,
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
              render: ({ createdAt }) => createdAt.toLocaleString(),
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
                  {message.author === user.uid && !message.isDeleted && (
                    <IconButton aria-label="delete" className={classes.margin} onClick={() => deleteTopic(message.id)}>
                      <DeleteIcon fontSize="small"/>
                    </IconButton>
                  )}
                  {message.author === user.uid && (
                    <PostEditModal topic={message} user={user}/>
                  )}
                </>
              },
            },
          ]}
          data={data}
        />
        <Paper style={{ marginTop: 20, padding: 10 }}>
          <div>
            <form onSubmit={submitTopic}>
              <TextField
                id="post-title"
                label="Title"
                fullWidth={true}
                style={{ marginBottom: 40 }}
                onChange={e => setTitle(e.target.value)}
                value={title}
              />
              <TextField
                id="post-summary"
                label="Summary"
                multiline
                rows="3"
                variant="outlined"
                fullWidth={true}
                onChange={e => setSummary(e.target.value)}
                value={summary}
                style={{ marginBottom: 40 }}
              />
              <MarkdownEditor
                id="post-text"
                label="Topic"
                value={text}
                onChange={value => setText(value)}
              />
              <FormControl className={classes.formControl} style={{ marginTop: 40, marginBottom: 40 }}>
                <InputLabel id="post-status-label">Status</InputLabel>
                <Select
                  labelId="Post Status"
                  id="post-status"
                  value={isPublished}
                  onChange={e => setIsPublished(e.target.value)}
                >
                  <MenuItem value={true}>Published</MenuItem>
                  <MenuItem value={false}>Pending</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} style={{ marginTop: 40, marginBottom: 40 }}>
                <InputLabel id="post-type-label">Type</InputLabel>
                <Select
                  labelId="Post Type"
                  id="post-type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warn">Warn</MenuItem>
                  <MenuItem value="alert">Alert</MenuItem>
                </Select>
              </FormControl>

              <div style={{ display: 'flex', alignItems: 'right' }}>
                <Button type="submit" variant="outlined" color="primary">
                  Create post
                </Button>
              </div>
            </form>
          </div>
        </Paper>

      </Grid>
    </Grid>
  )
}

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  signOut: {
    marginLeft: 12,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))
