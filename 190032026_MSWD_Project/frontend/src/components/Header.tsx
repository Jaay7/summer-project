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
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import {
  useLocation,
  NavLink,
  BrowserRouter,
  Switch as DSwitch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  InboxRounded,
  HomeRounded,
  PersonOutline,
  SearchRounded,
  SettingsRounded,
  ExitToAppRounded,
  WbSunnyRounded,
  NightsStayRounded
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
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import { useQuery, gql } from "@apollo/client";

const drawerWidth = 270;
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
        display: "none",
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
      position: "absolute",
      top: 10,
      left: 10,
    },
    toolbar: {
      ...theme.mixins.toolbar,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    toolbar2: {
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    drawerPaper: {
      width: drawerWidth,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    content: {
      flexGrow: 1,
      // padding: theme.spacing(2),
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
    listST: {
      // backgroundColor: theme.palette.background.default,
      cursor: "pointer",
      height: 70,
      borderRadius: 8,
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

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.palette.background.default,
        "& + $track": {
          backgroundColor: "#4527A0",
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: "#4527A0",
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  })
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const USER_DATA = gql`
  query UserProfile {
    profile {
      id
      name
      email
      username
    }
  }
`;

const Header: React.FC<Dark> = ({ onToggleDark }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const matches = theme.breakpoints.up("sm");

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [checked, isChecked] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangeSwitch = () => {
    isChecked(!checked);
  };

  const activeRoute = (routeName: any) => {
    return location.pathname === routeName ? true : false;
  };

  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login");
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
          selected={activeRoute("/settings")}
          onClick={() => history.push("/settings")}
        >
          <ListItemIcon>
            <SettingsRounded />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </List>
      <List
        style={{
          position: "fixed",
          bottom: 10,
          width: drawerWidth,
          padding: 8,
        }}
      >
        <Divider component="li" />
        {loading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : error ? (
          <Typography variant="body2">
            {error.message}
            <Redirect to={"/login"} />
          </Typography>
        ) : (
          <>
            <ListItem
              className={classes.listST}
              // selected={activeRoute("/profile")}
              onClick={() => history.push("/profile")}
            >
              <ListItemAvatar>
                <Avatar>{data.profile.username.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={data.profile.username}
                secondary={data.profile.email}
              />
            </ListItem>
            <ListItem style={{ cursor: "pointer" }} onClick={logout}>
              <ListItemIcon>
                <ExitToAppRounded />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </>
        )}
        <Divider component="li" />
        <ListItem>
          <ListItemText primary={"Theme"} />
          <ListItemSecondaryAction>
            <IconButton onClick={onToggleDark}>
              {localStorage.getItem("theme") === "light" ? (
                <WbSunnyRounded />
              ) : (
                <NightsStayRounded />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      {/* <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        </Toolbar>
      </AppBar> */}
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
        <div className={classes.toolbar2} />
        <Route path="/">
          <DSwitch>
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
          </DSwitch>
        </Route>
      </main>
      {/* </BrowserRouter>*/}
    </div>
  );
};

export default Header;
