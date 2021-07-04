import React, {useState} from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {Link, Route, Switch, Redirect, useRouteMatch, useParams} from 'react-router-dom'
import { Grid, Snackbar, Button, 
  Paper, Typography, ListItem,
  InputBase, InputAdornment, 
  Slide, useMediaQuery
} from '@material-ui/core'
import Header from './Header'
import {CircularProgress} from '@material-ui/core'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { Picker } from 'emoji-mart';
import "emoji-mart/css/emoji-mart.css"
import { TransitionProps } from '@material-ui/core/transitions';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff'
    },
    inputRoot: {
      color: theme.palette.type === 'dark' ? '#f1f1f1': 'inherit',
      borderRadius: 10,
      marginLeft: 20,
      paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
      backgroundColor: theme.palette.type === 'dark' ? '#424242' : '#eeeeee',
      paddingRight: `calc(1em + ${theme.spacing(2)}px)`,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      height: 40,
      transition: theme.transitions.create('width'),
      // [theme.breakpoints.up('sm')]: {
      //   width: '50ch',
      //   '&:focus': {
      //     width: '60ch',
      //   },
      // },
    },
    chatbox: {
      borderLeft: theme.palette.type === 'dark' ? '1px solid #303030' : "1px solid #e2e2e2",
      borderRight: theme.palette.type === 'dark' ? '1px solid #303030' : "1px solid #e2e2e2",
      minHeight: '91.5vh',
      position: 'relative'
    },
    tabbar: {
      height: 40,
      borderBottom: theme.palette.type === 'dark' ? '1px solid #303030' : '1px solid #e2e2e2',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 10
    },
    leftSide: {
      padding: "5px 15px",
      borderRadius: "0px 10px 10px 0px",
      borderLeft: "4px solid #FF8A80",
      alignSelf: 'flex-start',
      width: 'max-content',
      border: theme.palette.type === 'dark' ? '1px solid #303030' : '1px solid #e2e2e2',
      margin: 5,
      display: 'flex',
      color: theme.palette.text.primary,
      maxWidth: '60%'
    },
    rightSide: {
      padding: "5px 15px",
      borderRadius: "10px 0px 0px 10px",
      borderRight: "4px solid #42A5F5",
      display: 'flex',
      color: theme.palette.text.primary,
      // backgroundColor: '#C62828',
      border: theme.palette.type === 'dark' ? '1px solid #303030' : '1px solid #e2e2e2',
      alignSelf: 'flex-end',
      margin: 5,
      maxWidth: '60%'
    }
  })
)

const RET_MSGS = gql`
  query RetrieveMessages($currentUser: String!, $otherUser: String!) {
    retrieveMessages(currentUser: $currentUser, otherUser: $otherUser){
      currentUser
      otherUser
      message
      isSeen
    }
  }
`;

const SEND_MSG = gql`
  mutation SendMessage($currentUser: String!, $otherUser: String!, $message: String!) {
    sendMessage(currentUser: $currentUser, otherUser: $otherUser, message: $message){
      currentUser
      otherUser
      message
      isSeen
    }
  }
`;

interface parm {
  name: string;
}

interface Props {
  match: any,
}

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const AlwaysScollToBottom = () => {
  const elementRef = React.useRef<any>();
  React.useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}

const MessageBox = (props: any) => {
  const classes = useStyles()
  const matches = useMediaQuery('(min-width:780px)');
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
  let currentUser = localStorage.getItem("user")
  let {name} = useParams<parm>()
  const [ message, setMessage ] = useState('')
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }
  const { loading, error, data } = useQuery(RET_MSGS, {
    variables: {currentUser: currentUser, otherUser: name},
    pollInterval: 500
  })

  const [sendMessage] = useMutation(SEND_MSG)

  // useEffect(() => {
  //   refetch()
  // }, [refetch])

  const onSend = async() => {
    if(message !== '') {  
      await sendMessage({
        variables: {currentUser: currentUser, otherUser: name, message: message}
      })
    } else {
      setState({open: true, Transition: SlideTransition})
    }
    setMessage('')
  }

  let emojiPicker;
  if(emojiPickerState) {
    emojiPicker = (
      <Picker 
        // darkMode={false}
        title="Pick your emoji..."
        emoji="point_up"
        style={{position: 'absolute', bottom: 70, right: 40}}
        onSelect={(emoji: any) => setMessage(message + emoji.native)}
      />
    )
  }

  return (
    <div className={classes.root}>
      <Header />
      <Grid container spacing={0} style={{display: 'flex', justifyContent: 'center'}}>
        <Grid item></Grid>
        <Grid item xs={matches !== true ? 12 : 6} >
          <div className={classes.chatbox}>
            <div className={classes.tabbar}>
              <Typography variant="h6" color="textPrimary">{name}</Typography>
            </div>
            <div style={{flexGrow: 1, height: '73vh', overflowY: 'auto'}}>
              {loading ? (
                <><CircularProgress /></>
                ) : error ? (
                  <><Redirect to="/login" /></>
                ) : data.retrieveMessages.length === 0 ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Typography variant="h5" style={{color: '#BDBDBD'}}>Start your conversation</Typography>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100%'}}>
                    {data.retrieveMessages.map((index: any) => (
                      index.currentUser === currentUser ? (
                        <div className={classes.rightSide}>
                          <Typography>{index.message}</Typography>
                        </div>
                      ) : (
                        <div className={classes.leftSide}>
                          <Typography>{index.message}</Typography>
                        </div>
                      )
                      
                    ))}
                    <AlwaysScollToBottom />
                  </div>
                )}
            </div>
          {emojiPicker}
            <div style={{position: 'absolute', bottom: 0, flex: 0.1, width: '100%', display: 'flex', paddingBottom: 10}}>
              <InputBase
              placeholder="Enter message…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              fullWidth
              autoFocus
              value={message}
              endAdornment={
                <InputAdornment position="end">
                  <SentimentSatisfiedOutlinedIcon
                    style={{cursor: 'pointer'}}
                    onClick={(event) => {
                    event.preventDefault();
                    SetEmojiPicker(!emojiPickerState);
                  }} />
                </InputAdornment>
              }
              onChange={changeMessage}
              inputProps={{ 'aria-label': 'search' }}
            />
            <Button variant="contained" onClick={onSend}
             style={{height: 35, alignSelf: 'center', color: '#fff', backgroundColor: '#C62828', marginLeft: 20, marginRight: 20}}>Send</Button>
            </div>
          </div>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
      <Snackbar
        open={state.open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={handleClose}
        autoHideDuration={2500}
        TransitionComponent={state.Transition}
        message="Can't send empty message"
        key={state.Transition.name}
      />
    </div>
  )
}

export default MessageBox
