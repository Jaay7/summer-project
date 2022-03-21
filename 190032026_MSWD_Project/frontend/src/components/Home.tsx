import React from 'react'
import Header from './Header'
import { Grid, Card, Typography, CircularProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import SearchIcon from '@material-ui/icons/Search'
import { useQuery, gql } from '@apollo/client';
import { Link, Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    cards: {
      padding: 25,
      borderRadius: 15,
    },
    box: {
      display: 'flex',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
      justifyContent: 'space-between',
    },
    container: {
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff' 
    },
    sfubox: {
      backgroundColor: theme.palette.type === 'dark' ? '#2E7D32' : '#A5D6A7',
      '&:hover': {
        "& $container": {
          backgroundColor: theme.palette.type === 'dark' ? '#1B5E20' : '#81C784',
        }
      }
    },
    gotbox: {
      backgroundColor: theme.palette.type === 'dark' ? '#EF6C00' : '#FFCC80'
    },
    mpbox: {
      backgroundColor: theme.palette.type === 'dark' ? '#C62828' : '#EF9A9A'
    }
  })
)

const USER_DATA = gql`
  query UserProfile {
    profile{
      id
      name
      email
      username
    }
  }

`;

const Home: React.FC = () => {
  const classes = useStyles();

  const { loading, error } = useQuery(USER_DATA, {
    context: {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    },
    pollInterval: 500
  })
  return (
    <div className={classes.container}>
      <Header />
      {loading ? (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '89vh'}}>
          <CircularProgress size="30px" style={{color: '#0277BD'}} />
        </div>
      ) : error ? (
        <><p>{error.message}</p><Redirect to="/login" /></>
      ) : (
      <Grid container spacing={0}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6} style={{height: '89vh', alignItems: 'center', justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column'}}>
          <Typography variant="h3" color="textPrimary">A new way to unite with people.</Typography>
          <Grid container spacing={4} >
          <Grid item xs={6}>
            <Link to="/search" style={{textDecoration: 'none'}}>
              <Card variant="outlined" className={`${classes.cards} ${classes.sfubox}`}>
                <div className={classes.box}>
                  <div style={{display: 'flex'}}>
                    <SearchIcon style={{fontSize: 35}} />
                    <Typography variant="h5" style={{paddingLeft: 10}}>Search for Users</Typography>
                  </div>
                  <ChevronRightRoundedIcon style={{fontSize: 40}} />
                </div>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link to="/inbox" style={{textDecoration: 'none'}}>
              <Card variant="outlined" className={`${classes.cards} ${classes.gotbox}`}>
                <div className={classes.box}>
                  <Typography variant="h5">Go to Inbox</Typography>
                  <ChevronRightRoundedIcon style={{fontSize: 40}} />
                </div>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link to="/profile" style={{textDecoration: 'none'}}>
              <Card variant="outlined" className={`${classes.cards} ${classes.mpbox}`} >
                <div className={classes.box}>
                  <Typography variant="h5">My Profile</Typography>
                  <ChevronRightRoundedIcon style={{fontSize: 40}} />
                </div>
              </Card>
            </Link>
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      )}
    </div>
  )
}

export default Home