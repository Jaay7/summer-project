import React from 'react'
import { Typography, Grid, CircularProgress, Button } from '@material-ui/core'
import Header from './Header'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useParams, Redirect, Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff' 
    },
  })
)

interface user {
  otherUser: any;
}



const OTHER_USER = gql`
  query OtherUser($username: String!){
    otherUser(username: $username) {
      name
      username
      id
      email
    }
  }
`;

const OthersProfile: React.FC = () => {
  let { otherUser } = useParams<user>();
  const classes = useStyles();
  const { loading, error, data } = useQuery(OTHER_USER, {
    variables: { username: otherUser},
    pollInterval: 500
  })
  return (
    <div className={classes.root}>
      <Header />
      <Grid container spacing={0}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          {loading ? (
            <div style={{display: 'flex', justifyContent: 'center', height: '89vh'}}>
              <CircularProgress />
            </div>
          ) : error ? (
            <><p>{error.message}</p><Redirect to="/login" /></>
          ) : (
            <div>
              <Typography color="textPrimary">Name : {data.otherUser.name} </Typography>
              <Typography color="textPrimary">Email : {data.otherUser.email} </Typography>
              <Typography color="textPrimary">Username : {data.otherUser.username} </Typography>
              <br />
              <Link style={{textDecoration: 'none'}} to={`/inbox/${data.otherUser.username}`}>
                <Button variant="outlined" style={{backgroundColor: '#81C784', color: '#fff', height: 35, textTransform: "capitalize" }}>
                  Send Message
                </Button>
              </Link>
            </div>
          )}
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  )
}

export default OthersProfile
