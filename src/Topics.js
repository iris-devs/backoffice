import React from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AlarmIcon from "@material-ui/icons/AlarmOn";
import PublishedIcon from "@material-ui/icons/DoneAll";
import RemovedIcon from "@material-ui/icons/HighlightOff";
import { PostEditModal } from "./Modal";
import { isEmpty, orderBy } from "lodash";
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

const statusIcon = (isPublished, isDeleted) => {
  if (isDeleted) {
    return <Tooltip title="deleted" placement="top"><RemovedIcon color="error" /></Tooltip>;
  }
  if (isPublished) {
    return <Tooltip title="published" placement="top"><PublishedIcon htmlColor="green" titleAccess="published" /></Tooltip>;
  }
  return <Tooltip title="pending" placement="top"><AlarmIcon color="disabled" titleAccess="pending" /></Tooltip>;
};

const typeIcon = (type) => {
  let iconColor = "#90caf9";
  let iconTitle = "Info";
  switch (type) {
    case 'warn':
      iconColor = "orange";
      iconTitle = "Warning";
      break;
    case 'alert':
      iconColor = "red";
      iconTitle = "Alert";
      break;
  }
  return <Tooltip title={iconTitle} placement="top"><InfoIcon htmlColor={iconColor} /></Tooltip>;
}

export default function Topics({ topics, user, deleteTopic }) {
  const classes = useStyles();
  let topicsArr = [];

  if (!isEmpty(topics)) {
    topicsArr = Object.keys(topics).map( (key) => {
      let createdAt = null;
      if (topics[key].createdAt) {
        if (topics[key].createdAt.constructor.name === 't') {
          createdAt = topics[key].createdAt.seconds * 1000;
        } else {
          createdAt = topics[key].createdAt;
        }
      }

      return { ...topics[key], createdAt, key };
    });
    topicsArr = orderBy(topicsArr, ['createdAt'], ['desc'])
  }

  if (isEmpty(topicsArr)) {
    return null;
  }

  return (
    <React.Fragment>
      <Title>Recent Topics</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topicsArr.map(topic => {
            return (
              <TableRow key={topic.key}>
                <TableCell>
                  {statusIcon(topic.isPublished, topic.isDeleted)}
                </TableCell>
                <TableCell>
                  {typeIcon(topic.type)}
                </TableCell>
                <TableCell>{ new Date(topic.createdAt).toUTCString() }</TableCell>
                <TableCell>
                  <Link href="/details/[id]" as={`/details/${topic.key}`}>
                    <a>{topic.title}</a>
                  </Link>
                </TableCell>
                <TableCell align="right">
                  {topic.author === user.uid && !topic.isDeleted && (
                    <IconButton
                      aria-label="delete"
                      className={classes.margin}
                      onClick={() => deleteTopic(topic.key)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  {topic.author === user.uid && (
                    <PostEditModal topic={topic} user={user}/>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {/* <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={}>
          See more orders
        </Link>
      </div> */}
    </React.Fragment>
  );
}
