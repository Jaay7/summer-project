import React from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useQuery, gql, useMutation } from '@apollo/client';
import Header from './Header';
import {CircularProgress, Grid, Button, AccordionActions, Accordion, AccordionDetails, AccordionSummary, Typography, Avatar} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff' 
    },
    heading: {
      fontSize: theme.typography.pxToRem(16),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    details: {
      backgroundColor: theme.palette.type === 'dark' ? '#464646' : '#FCF3F4',
    },
    summary: {
      backgroundColor: theme.palette.type === 'dark' ? '#000' : '#FAFAFA',
      opacity: 0.8
    },
    buttons: {
      backgroundColor: '#D32F2F',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#EF5350'
      }
    }
  }),
);


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

const Profile: React.FC = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    },
    pollInterval: 500
  })


  return (
    <div className={classes.root}>
      <Header />
      {loading ? (
        <div style={{display: 'flex', justifyContent: 'center', height: '89vh'}}>
          <CircularProgress />
        </div>
        ) : error ? (
          <><p>{error.message}</p><Redirect to="/login" /></>
        ) : (
          <Grid container spacing={0}>
            <Grid item xs={3}>
              {/* <div>
              <Avatar src={`${data.profile.profilePic}`} alt={data.profile.username} style={{height: 150, width: 150, borderRadius: "50%", objectFit: "cover"}} />
              </div> */}
            </Grid>
            <Grid item xs={6}>
              <div>
                <Typography>Name: {data.profile.name}</Typography>
                <Typography>Username: {data.profile.username}</Typography>
                <Typography>Email: {data.profile.email}</Typography>
              </div>
            </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      )}
    </div>
  )
}

export default Profile


