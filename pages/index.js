import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "../src/listItems";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { useAuth, signOut, useManageTopics } from "../hooks";
import Topics from "../src/Topics";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MarkdownEditor from "../src/MarkdownEditor";
import Copyright from "../src/Copyright";

export default function Index() {
  const {user} = useAuth();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);
  const [type, setType] = React.useState("info");
  const { createTopic, messages, deleteTopic } = useManageTopics(user);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const submitTopic = e => {
    e.preventDefault();
    console.log(`creating topic: ${title}, ${text}, ${isPublished}`);
    setTitle("");
    setText("");
    setSummary("");
    createTopic(text, title, user.name, isPublished, summary, type);
  };

  if (!user) {
    return 'Authenticating...';
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button
            variant="contained"
            className={classes.signOut}
            onClick={signOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={12}>
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

                    <div style={{ display: "flex", alignItems: "right" }}>
                      <Button type="submit" variant="outlined" color="primary">
                        Create post
                      </Button>
                    </div>
                  </form>
                </div>
              </Paper>
            </Grid>
            {/* topics table */}
            <Grid item xs={12} md={8} lg={12}>
              <Paper style={{ marginTop: 20, padding: 10 }}>
                <div>
                  <Topics
                    topics={messages}
                    user={user}
                    deleteTopic={deleteTopic}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  signOut: {
    marginLeft: 12
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));
