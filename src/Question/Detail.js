import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI Card
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import ReplyIcon from "@material-ui/icons/Reply";
import { useQuestionSubscription, useAuth } from "../../hooks";
import TextField from "@material-ui/core/TextField";
import EditEcon from "@material-ui/icons/EditOutlined";

export default function Detail({ question, questionId }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const { comment } = question;
  const [replyBody, setReplyBody] = React.useState(
    comment && comment.body ? comment.body : ""
  );
  const { reply } = useQuestionSubscription();
  const { user } = useAuth();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const replyToQuestion = event => {
    event.preventDefault();
    reply(questionId, replyBody, user.displayName, user.uid);
    setShowReplyForm(false);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title={question.title}
        subheader="subheader"
      />
      <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {question.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{ justifyContent: "flex-end" }}>
        <IconButton size="small" aria-label="add to favorites">
          <FavoriteIcon />
          <span>{question.likes}</span>
        </IconButton>

        {!comment && (
          <Button
            color="primary"
            className={classes.button}
            startIcon={<ReplyIcon />}
            onClick={() => setShowReplyForm(true)}
          >
            Reply
          </Button>
        )}
        {comment && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </CardActions>
      {comment && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ paddingLeft: 20 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <span>{comment.authorName}:</span>{" "}
              <span>
                {user.uid === comment.uid && (
                  <IconButton
                    onClick={handleExpandClick}
                    aria-label="edit"
                    onClick={e => {
                      setShowReplyForm(true);
                    }}
                  >
                    <EditEcon />
                  </IconButton>
                )}
              </span>
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {comment.body}
            </Typography>
          </CardContent>
        </Collapse>
      )}
      {showReplyForm && (
        <div style={{padding: 20}}>
          <form>
            <TextField
              id="reply-text"
              label="Antwort"
              multiline
              rows="4"
              variant="outlined"
              fullWidth={true}
              onChange={e => setReplyBody(e.target.value)}
              value={replyBody}
            />

            <Button color="primary" onClick={() => setShowReplyForm(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={e => replyToQuestion(e, questionId)}
            >
              Reply
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20
  },
  avatar: {
    backgroundColor: red[500]
  },
  button: {
    margin: theme.spacing(1)
  }
}));
