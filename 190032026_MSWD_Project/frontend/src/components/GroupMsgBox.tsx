import React, {useState} from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import {Redirect, useParams} from 'react-router-dom'
import { 
  Grid, Snackbar, Button, Chip, List,
  ListItem, ListItemSecondaryAction, 
  ListItemText, Typography, IconButton, 
  InputBase, InputAdornment, Slide,
  Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Input, 
  Avatar, useMediaQuery, Drawer, Divider,
  TextField
} from '@material-ui/core'
import Header from './Header'
import {CircularProgress} from '@material-ui/core'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { Picker } from 'emoji-mart';
import "emoji-mart/css/emoji-mart.css"
import { TransitionProps } from '@material-ui/core/transitions';
import EditAttributesOutlinedIcon from '@material-ui/icons/EditAttributesOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
    },
    sender: {
      fontSize: 14,
      marginLeft: 5,
      fontStyle: 'italic',
      color: theme.palette.type === 'dark' ? '#9D9D9D' : '#727272'
    },
    searchList: {
      display: 'flex',
      cursor: 'pointer',
    },
    drawer: {
      width: 400,
      flexShrink: 0
    },
    drawerItems: {},
    leave: {
      width: "100%",
      padding: "10px 0px", 
      textAlign: 'center', 
      borderTop: "1px solid #F93A3A", 
      position: 'absolute', 
      bottom: 0, 
      color: '#F93A3A',
      cursor: 'pointer',
      '&:hover': {
        // backgroundColor: 'rgba(249, 58, 58, 0.62)',
        backgroundColor: 'rgba(249, 58, 58, 0.3)',
      }
    }
  })
)

const RET_GRP_MSGS = gql`
  query RetrieveGroupMessages($id: ID!) {
    retrieveGroupMessages(id: $id) {
      id
      groupName
      persons
      chats {
        sender
        message
        date
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

const SEND_GRP_MSG = gql`
  mutation SendGroupMessage($id: ID!, $sender: String!, $message: String!) {
    sendGroupMessage(id: $id, sender: $sender, message: $message) {
      id
      persons
      groupName
      chats {
        sender
        message
        date
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

const EDIT_GNAME = gql`
  mutation EditGroupName($id: ID!, $groupName: String!) {
    editGroupName(id: $id, groupName: $groupName){
      id
      persons
      groupName
      createdBy
      createdAt
    }
  }
`;

interface parm {
  id: any;
}

// slide amination
function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

// set the messages to bottom
const AlwaysScollToBottom = () => {
  const elementRef = React.useRef<any>();
  React.useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}

// dialog animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const GroupMsgBox = (props: any) => {
    const classes = useStyles()
    const matches = useMediaQuery('(min-width:780px)');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [ search, setSearch ] = useState('')
    const [state, setState] = React.useState<{
      open: boolean;
      Transition: React.ComponentType<TransitionProps & { children?: React.ReactElement<any, any> }>;
    }>({
      open: false,
      Transition: Slide,
    });
    
  // dialog
  const handleDialogOpen = () => {
    setDialogOpen(true);
    setDrawerOpen(false);
  }
  const handleDialogCancel = () => {
    setDialogOpen(false);
    setDrawerOpen(true);
  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  }
  
  // drawer
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }
  
  //snackbar closing
  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  
  // search
  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }
  
  let currentUser = localStorage.getItem("user")
  let {id} = useParams<parm>()
  
  const [ message, setMessage ] = useState('')
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }
  const { loading, error, data } = useQuery(RET_GRP_MSGS, {
    variables: {id: id},
    pollInterval: 500
  })
  
  const [sendMessage] = useMutation(SEND_GRP_MSG)
  
  const onSend = async() => {
    if(message !== '') {  
      await sendMessage({
        variables: {id: id, sender: currentUser, message: message}
      })
    } else {
      setState({open: true, Transition: SlideTransition})
    }
    setMessage('')
  }
  
  const [editGroupName] = useMutation(EDIT_GNAME)

  const onEdit = async() => {
    if(groupName !== '') {
      await editGroupName({
        variables: {id: id, groupName: groupName}
      })
    }
    setGroupName('')
  }
  const theme = useTheme();
  
  let emojiPicker;
  if(emojiPickerState) {
    emojiPicker = (
      <Picker 
      darkMode={theme.palette.type === 'light' ? false : true}
      title="Pick your emoji..."
      emoji="point_up"
      style={{position: 'absolute', bottom: 70, right: 40}}
      onSelect={(emoji: any) => setMessage(message + emoji.native)}
      />
      )
    }
    const [ groupName, setGroupName ] = React.useState('')
    const changeGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
    }
    if (loading) return <>
    <Header />
    <div style={{height: '79vh', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
      <CircularProgress  size="30px" style={{color: '#0277BD'}} />
    </div>
    </>
    if (error) return <Redirect to="/login" />
    return (
      <div className={classes.root}>
      <Header />
      <Grid container spacing={0} style={{display: 'flex', justifyContent: 'center'}}>
        <Grid item></Grid>
        <Grid item xs={matches !== true ? 12 : 6}>
          <div className={classes.chatbox}>
            <div className={classes.tabbar}>
              <Typography variant="h6" color="textPrimary">{data.retrieveGroupMessages.groupName}</Typography>
              <span style={{flexGrow: 1}}></span>
              {/* <IconButton onClick={handleDialogOpen}>
                <EditAttributesOutlinedIcon />
              </IconButton> */}
              <IconButton onClick={handleDrawerOpen}>
                <InfoOutlinedIcon />
              </IconButton>
            </div>
            <div style={{flexGrow: 1, height: '73vh', overflowY: 'auto'}}>
              {data.retrieveGroupMessages.length === 0 ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Typography variant="h5" style={{color: '#BDBDBD'}}>Start your conversation</Typography>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100%'}}>
                    {data.retrieveGroupMessages.chats.map((index: any) => (
                        index.sender === currentUser ? (
                          <div className={classes.rightSide}>
                            <Typography>{index.message}</Typography>
                          </div>
                        ) : (
                          <>
                          <Typography className={classes.sender}>{index.sender}</Typography>
                          <div className={classes.leftSide}>
                            <Typography>{index.message}</Typography>
                          </div>
                          </>
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
             style={{height: 35, alignSelf: 'center', backgroundColor: theme.palette.type === 'dark' ? '#EF9A9A' : '#D32F2F', color: theme.palette.type === 'dark' ? 'revert' : '#fff', marginLeft: 20, marginRight: 20}}>Send</Button>
            </div>
          </div>
        </Grid>
        {/* <Grid item>
        </Grid> */}
      </Grid>
      <Drawer
        open={drawerOpen}
        anchor="right"
        className={classes.drawer}
        onClose={handleDrawerClose}
      >
        <div style={{width: 400}}>
          <Typography variant="h6" style={{textAlign: 'center', padding: 10}}>Details</Typography>
          <Divider />
          <div style={{padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <TextField
              variant="standard"
              value={groupName}
              onChange={changeGroupName}
              fullWidth
              color="secondary"
              // label="Group Name"
              placeholder={data.retrieveGroupMessages.groupName}
            />
            <IconButton
              style={{color: theme.palette.type === 'dark' ? '#EF9A9A' : '#D32F2F'}}
              onClick={onEdit}
            >
              <EditRoundedIcon />
            </IconButton>  
          </div>
          <div style={{padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography style={{fontSize: 18}}>People</Typography>
            {
              data.retrieveGroupMessages.createdBy === currentUser ? 
              <IconButton
                onClick={handleDialogOpen}
                style={{color: theme.palette.type === 'dark' ? '#EF9A9A' : '#D32F2F'}}
              >
                <GroupAddOutlinedIcon />
              </IconButton>
              : <></>
            }
          </div>
          <List style={{padding: 10}}>
          {data.retrieveGroupMessages.persons.map((index: any) => (
            <ListItem key={index}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                <Typography>{index}</Typography>
                <FiberManualRecordIcon style={{height: 8, width: 8, padding: "0px 6px"}}/>
                <Typography color="textSecondary" style={{fontSize: 13}}>
                  {data.retrieveGroupMessages.createdBy === index ? "admin" : "member" }
                </Typography>
              </div>
              {/* <ListItemText id={index} primary={index} /> */}
              <ListItemSecondaryAction>
                {data.retrieveGroupMessages.createdBy === currentUser ? 
                  data.retrieveGroupMessages.createdBy !== index ?
                  <Button variant="contained" style={{height: 30, textTransform: 'capitalize', backgroundColor: theme.palette.type === 'dark' ? '#EF9A9A' : '#D32F2F', color: theme.palette.type === 'dark' ? 'revert' : '#fff'}}>Remove</Button>
                : <></>
                : <></>}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        { 
          data.retrieveGroupMessages.createdBy !== currentUser ?
            <div className={classes.leave}>
              <Typography>Leave Group</Typography>
            </div> :
            <div className={classes.leave}>
              <Typography>Delete Group</Typography>
            </div>
        }
        
        </div>
      </Drawer>
      <Snackbar
        open={state.open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={handleClose}
        autoHideDuration={2500}
        TransitionComponent={state.Transition}
        message="Can't send empty message"
        key={state.Transition.name}
      />
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
        <DialogTitle id="alert-dialog-slide-title">{"Group info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Add new people into the group chat.
          </DialogContentText>
          <Input 
            placeholder="Search people" 
            fullWidth
            value={search}
            onChange={changeSearch}
            inputProps={{ 'aria-label': 'description' }} 
          />
          <SearchUsers 
            search={search}
            classes={classes}
            currentUser={currentUser}
            id={id}
            handleDialogClose={handleDialogClose}
            handleDialogCancel={handleDialogCancel}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Ok
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  )
}

export default GroupMsgBox


const SEARCH_USERS = gql`
  query SearchUser($letter: String!) {
    searchUser(letter: $letter) {
      name
      username
      email
      id
    }
  }
`;

const ADD_PERSONS = gql`
  mutation AddPerosn($id: ID!, $currentUser: String!, $persons: [String!]!) {
    addPerson(id: $id, currentUser: $currentUser, persons: $persons) {
      id
      groupName
      persons
      createdBy
      chats {
        sender
        message
        date
      }
      createdAt
      updatedAt
    }
  }
`;

interface abc {
  name: string;
}

const SearchUsers = (props: any) => {

  let currentUser = localStorage.getItem("user")
  const { loading, error, data} = useQuery(SEARCH_USERS, {
    variables: { letter: props.search }
  })

  const [state, setState] = React.useState<any[]>([])

  const [addPersons] = useMutation(ADD_PERSONS)

  const handleSelect = (username: any) => {
    if(!state.includes(username)) {
      setState([...state, username])
    } else {
      console.log("user already to the chips")
    }
  }
  const handleDelete = (username: any) => {
    setState((chips) => chips.filter((chip) => chip !== username ))
  }
  const handleCancel = () => {
    props.handleDialogCancel()
  }
  const handleOk = async() => {
    if(state !== undefined || state !== null) {
      await addPersons({
        variables: {id: props.id, currentUser: props.currentUser, persons: state}
      })
      props.handleDialogClose()
    }
  }
  return(
    <div style={{minHeight: '350px', display: 'flex', flexDirection: 'column'}}>
      <br />
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {state.map((index) => (
          <Chip label={index} onDelete={(e) => handleDelete(index)} style={{marginLeft: 10}} />
        ))}
      </div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography>{error.message}</Typography>
      ) : props.search === '' ? (
        <Typography>Start search</Typography>
      ) : (
        <>
        <br />
        <div style={{height: 220,overflowY: 'auto'}}>
        {data.searchUser.filter((idx: any) => idx.username !== currentUser).map((index: any) => (
          <ListItem className={props.classes.searchList} onClick={() => handleSelect(index.username)} key={index.username}>
            <Avatar>{index.username.charAt(0).toUpperCase()}</Avatar>
            <Typography style={{marginLeft: 15}}>{index.username}</Typography>
          </ListItem>
        ))}
        </div>
        
        </>
      )}
      <div style={{position: 'absolute', bottom: 7, alignSelf: 'flex-end'}}>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </div>
    </div>
  )
}