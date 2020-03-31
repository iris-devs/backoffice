import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

export default function AlignItemsList({ questions }) {
  const classes = useStyles();
  const questionsArr = Object.keys(questions);
  if (!questionsArr.length) {
    return <Typography>No comments yet</Typography>;
  }

  return (
    <div>
      <Typography>{questionsArr.length} comments</Typography>
      <List className={classes.root}>
        {questionsArr &&
          questionsArr.map(key => (
            <ListItem alignItems="flex-start" key={key}>
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText
                primary={questions[key].text}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Dr. Connors
                    </Typography>
                    {" - Zahnmedizin"}
                    <div>{`up: ${questions[key].up}`}</div>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
      </List>
    </div>
  );
}
