import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import {useManageTopics} from "../../hooks";
import MarkdownEditor from "../MarkdownEditor";
import AddIcon from '@material-ui/icons/Add';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: "60%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function PostModal({topic, user, mode}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(topic.title || '');
  const [text, setText] = React.useState(topic.text || '');
  const [isPublished, setIsPublished] = React.useState(topic.isPublished || true);
  const [summary, setSummary] = React.useState(topic.summary || '');
  const [type, setType] = React.useState(topic.type || "info");
  const {updateTopic, createTopic} = useManageTopics(user);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitTopic = e => {
    e.preventDefault();
    if (mode === 'create') {
      createTopic(text, title, user.fullName, isPublished, summary, type)
    } else {
      updateTopic(topic.key, title, text, isPublished, summary, type);
    }
    handleClose();
  };

  let modalSubmitText = 'Update post';
  let modalIcon = (
      <IconButton aria-label="edit" className={classes.margin} onClick={handleOpen}>
        <EditIcon fontSize="small"/>
      </IconButton>
  );

  if (mode === 'create') {
    modalIcon = (
        <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<AddIcon/>}
            onClick={handleOpen}
        >
          New message
        </Button>
    );
    modalSubmitText = 'Create post';
  }

  return (
      <>
        {modalIcon}
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
        >
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">{modalSubmitText}:</h2>
            <form onSubmit={submitTopic}>
              <TextField
                  id="post-title"
                  label="Title"
                  fullWidth={true}
                  style={{marginBottom: 40}}
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

            <FormControl className={classes.formControl} style={{ margin: "40px 0px 40px 40px" }}>
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

            <div style={{ display: "flex", alignItems: "right" }}>
              <Button type="submit" variant="outlined" color="primary">
                {modalSubmitText}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      </>
  );
}
