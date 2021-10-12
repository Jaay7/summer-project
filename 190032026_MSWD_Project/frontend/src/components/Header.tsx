import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: "none",
      flexGrow: 1,
    },
    appbar: {
      backgroundColor: theme.palette.background.default,
      boxShadow: "none",
      borderBottom: theme.palette.type === 'dark' ? '1px solid #616161' : '1px solid #e2e2e2',
      zIndex: 1
    },
    link: {
      color: theme.palette.text.secondary,
      textDecoration: "none",
      '&:hover': {
        color: theme.palette.text.primary,
      } 
    }
  })
)

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h5"><Link to="/" className={classes.link}>Messaging Application</Link></Typography>
          <span style={{flexGrow: 0.8}}></span>
          <Typography>
            <Link to="/search" className={classes.link}>Search</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Typography>
            <Link to="/inbox" className={classes.link}>Inbox</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Typography>
            <Link to="/profile" className={classes.link}>Profile</Link>
          </Typography>
          <span style={{flexGrow: 0.05}}></span>
          <Link to="/settings" className={classes.link}><SettingsIcon /></Link>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
