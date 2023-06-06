import React from "react";
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  useLocation,
  NavLink,
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import {
  InboxRounded,
  HomeRounded,
  PersonOutline,
  SearchRounded,
  SettingsRounded,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import Profile from "./Profile";
import Search from "./Search";
import Inbox from "./Inbox";
import OthersProfile from "./OthersProfile";
import Settings from "./Settings";
import GroupMsgBox from "./GroupMsgBox";
import Home from "./Home";
import { useHistory } from "react-router";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: theme.palette.type === "light" ? "#4527A0" : "#EDE7F6",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    toolbar: {
      ...theme.mixins.toolbar,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    drawerPaper: {
      width: drawerWidth,
      border: "none",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    listS: {
      padding: 8,
      "& .Mui-selected": {
        backgroundColor: theme.palette.type === "light" ? "#EDE7F6" : "#4527A0",
        color: theme.palette.type === "light" ? "#4527A0" : "#EDE7F6",
        "& .MuiListItemIcon-root": {
          color: theme.palette.type === "light" ? "#4527A0" : "#EDE7F6",
        },
        "&:hover": {
          backgoundColor:
            theme.palette.type === "light" ? "#EDE7F6" : "#4527A0",
        },
      },
      "& .MuiListItem-root": {
        cursor: "pointer",
        borderRadius: 8,
      },
    },
    link: {
      color: theme.palette.text.secondary,
      textDecoration: "none",
      display: "inline-block",
      position: "relative",
      "&:hover": {
        color: theme.palette.text.primary,
      },
      "&:after": {
        content: '""',
        position: "absolute",
        width: "100%",
        transform: "scaleX(0)",
        height: "3px",
        bottom: -5,
        left: 0,
        background: theme.palette.type === "dark" ? "#d2d2d2" : "#AB47BC",
        transformOrigin: "bottom right",
        transition: "transform 0.25s ease-out",
      },
      "&:hover:after": {
        transform: "scaleX(1)",
        transformOrigin: "bottom right",
      },
    },
  })
);

interface Dark {
  onToggleDark: any;
}

const Header: React.FC<Dark> = ({ onToggleDark }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const matches = theme.breakpoints.down("xs");

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const activeRoute = (routeName: any) => {
    return location.pathname === routeName ? true : false;
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography
          style={{
            color: theme.palette.type === "light" ? "#4527A0" : "#EDE7F6",
            fontWeight: 600,
            fontSize: 26,
          }}
        >
          Chatter
        </Typography>
      </div>
      {/* <Divider /> */}
      <List className={classes.listS}>
        <ListItem selected={activeRoute("/")} onClick={() => history.push("/")}>
          <ListItemIcon>
            <HomeRounded />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem
          selected={activeRoute("/inbox")}
          onClick={() => history.push("/inbox")}
        >
          <ListItemIcon>
            <InboxRounded />
          </ListItemIcon>
          <ListItemText primary={"Inbox"} />
        </ListItem>
        <ListItem
          selected={activeRoute("/profile")}
          onClick={() => history.push("/profile")}
        >
          <ListItemIcon>
            <PersonOutline />
          </ListItemIcon>
          <ListItemText primary={"Profile"} />
        </ListItem>
        <ListItem
          selected={activeRoute("/settings")}
          onClick={() => history.push("/settings")}
        >
          <ListItemIcon>
            <SettingsRounded />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* <BrowserRouter> */}
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/">
          <Switch>
            <Route exact path="/" component={Search} />
            <Route exact path="/inbox/">
              <Inbox />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/profile/:otherUser">
              <OthersProfile />
            </Route>
            <Route exact path="/inbox/group/:id">
              <GroupMsgBox />
            </Route>
            <Route exact path="/settings">
              <Settings onToggleDark={onToggleDark} />
            </Route>
          </Switch>
        </Route>
      </main>
      {/* </BrowserRouter>*/}
    </div>
  );
};

export default Header;
