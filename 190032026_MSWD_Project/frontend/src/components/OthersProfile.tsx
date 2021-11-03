import React from 'react'
import { Typography, Grid, CircularProgress, Button, DialogActions, Input, DialogContent, DialogTitle, Dialog, Slide, Snackbar, Card } from '@material-ui/core'
import Header from './Header'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useParams, Redirect } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client';
import { TransitionProps } from '@material-ui/core/transitions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff' 
    },
    leftContainer: {
      height: '60vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    boxes: {
      padding: "10px 20px",
      backdropFilter: 'blur(10px)',
      // border: `1px solid ${theme.palette.divider}`,
      boxShadow: '3px 3px 8px #0000002a',
      borderRadius: 10,
      width: '90%',
      background: '#AED58110',
      display: 'inline-block',
      marginBottom: '20px',
    }
  })
)

interface user {
  otherUser: any;
}


function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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

const SEND_MSG = gql`
  mutation SendMessage($sender: String!, $otherUser: String!, $message: String!) {
    sendMessage(sender: $sender, otherUser: $otherUser, message: $message){
      id
      persons
      chats {
        sender
        message
      }
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

  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children?: React.ReactElement<any, any> }>;
  }>({
    open: false,
    Transition: Slide,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [ msg, setMsg ] = React.useState('')
  let currentUser = localStorage.getItem("user")

  // dialog
  const handleDialogOpen = () => {
    setDialogOpen(true);
  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const changeMsg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(event.target.value);
  }

  const [sendMessage] = useMutation(SEND_MSG)

  const onSend = async() => {
    if(msg !== '') {  
      await sendMessage({
        variables: {sender: currentUser, otherUser: otherUser, message: msg}
      })
      setDialogOpen(false);
    } else {
      setState({open: true, Transition: SlideTransition})
    }
    setMsg('')
  }

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
        <>
          <Grid container spacing={0}>
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
              <div className={classes.leftContainer}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography gutterBottom variant="h5" color="textPrimary" style={{textTransform: "capitalize"}}>{data.otherUser.username}'s profile</Typography>
                  <Button variant="outlined" onClick={handleDialogOpen} style={{backgroundColor: '#81C784', color: '#fff', height: 35, textTransform: "capitalize" }}>
                    Send Message
                  </Button>
                </div>
                <span style={{flexGrow: .2}}></span>
                <Card elevation={4} variant="elevation" className={classes.boxes}>
                  <Typography style={{fontSize: 20}} color="textPrimary">Name</Typography>
                  <Typography color="textSecondary">{data.otherUser.name}</Typography>
                </Card>
                <Card elevation={4} variant="elevation" className={classes.boxes}>
                  <Typography style={{fontSize: 20}} color="textPrimary">Username</Typography>
                  <Typography color="textSecondary">{data.otherUser.username}</Typography>
                </Card>
                <Card elevation={4} variant="elevation" className={classes.boxes}>
                  <Typography style={{fontSize: 20}} color="textPrimary">Email</Typography>
                  <Typography color="textSecondary">{data.otherUser.email}</Typography>
                </Card>
              </div>
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <Dialog
            open={dialogOpen}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="sm"
            fullWidth
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">Send your message to {otherUser}</DialogTitle>
            <DialogContent>
              <Input 
                placeholder="Enter Message" 
                fullWidth
                value={msg}
                onChange={changeMsg}
                inputProps={{ 'aria-label': 'description' }} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={onSend} color="primary">
                Send
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={state.open}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            onClose={handleClose}
            autoHideDuration={2500}
            TransitionComponent={state.Transition}
            message="Can't send empty message"
            key={state.Transition.name}
          />
        </>
      )}
    </div>
  )
}

export default OthersProfile
