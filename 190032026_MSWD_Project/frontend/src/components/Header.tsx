import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings';
import { InboxRounded, PersonOutline, SearchRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      justifyContent: 'center',
    },
    appbar: {
      boxShadow: "none",
      backgroundColor: 'transparent',
      // borderBottom: theme.palette.type === 'dark' ? '1px solid #616161' : '1px solid #e2e2e2',
      zIndex: 1,
      position: "fixed",
    },
    link: {
      color: theme.palette.text.secondary,
      textDecoration: "none",
      display: 'inline-block',
      position: 'relative',
      '&:hover': {
        color: theme.palette.text.primary,
      },
      "&:after": {
        content: '""',
        position: 'absolute',
        width: '100%',
        transform: 'scaleX(0)',
        height: '3px',
        bottom: -5,
        left: 0,
        background: theme.palette.type === 'dark' ? '#d2d2d2' : '#AB47BC',
        transformOrigin: 'bottom right',
        transition: 'transform 0.25s ease-out',
      },
      "&:hover:after": {
          transform: 'scaleX(1)',
          transformOrigin: 'bottom right',
      }
    }
  })
)

const Header: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const matches = theme.breakpoints.down('xs');

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6"><Link to="/" className={classes.link}>Messaging Application</Link></Typography>
          <span style={{flexGrow: 0.8}}></span>
          <Typography>
            <Link to="/search" className={classes.link}>{matches ? <SearchRounded /> : 'Search'}</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Typography>
            <Link to="/inbox" className={classes.link}>{matches ? <InboxRounded /> : 'Inbox'}</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Typography>
            <Link to="/profile" className={classes.link}>{ matches ? <PersonOutline /> : 'Profile'}</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Link to="/settings" className={classes.link}><SettingsIcon /></Link>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
