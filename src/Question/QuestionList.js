import { green, red } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import React, { useState } from 'react'
import AnswerForm from './AnswerForm'

const formatFirebaseDate = (date) => new Date(date.seconds * 1000).toLocaleString()
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}))

export default ({ dataSource }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(null)

  return (
    <div style={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Likes</TableCell>
              <TableCell align="center">Answered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map(({ id, title, authorName, createdAt, likes, comment, body }) => (
              <React.Fragment key={id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => setExpanded(expanded === id ? null : id)}
                    >
                      {expanded === id
                        ? <ExpandLessIcon fontSize="inherit"/>
                        : <ExpandMoreIcon fontSize="inherit"/>
                      }
                    </IconButton>{' '}{title}
                  </TableCell>
                  <TableCell>{authorName}</TableCell>
                  <TableCell>{formatFirebaseDate(createdAt)}</TableCell>
                  <TableCell align="center">{likes}</TableCell>
                  <TableCell align="center">
                    {comment
                      ? <CheckCircleIcon style={{ color: green[500] }} fontSize="small"/>
                      : <CancelIcon style={{ color: red[500] }} fontSize="small"/>}
                  </TableCell>
                </TableRow>
                {expanded === id && (
                  <TableRow style={{ backgroundColor: '#fafafa' }}>
                    <TableCell colSpan={5}>
                      <div>{body}</div>
                      <AnswerForm
                        questionId={id}
                        comment={comment}
                        onCancel={() => setExpanded(null)}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}