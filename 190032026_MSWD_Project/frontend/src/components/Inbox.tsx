import React from 'react'
import Header from './Header'
import { Grid, Typography, 
  Button, ListItem, Avatar, 
  Tabs, Tab, Box, IconButton, Dialog, 
  TextField, DialogContent, Chip,
  DialogTitle, Slide, List, 
  ListItemSecondaryAction,
  ListItemAvatar, ListItemText, Snackbar, useTheme
} from '@material-ui/core'
import { useQuery, gql, useMutation } from '@apollo/client';
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import {Link, Redirect} from 'react-router-dom'
// import MessageBox from './MessageBox';
import {CircularProgress} from '@material-ui/core'
import emtInbox from '../images/emtInbox.svg'
import { TransitionProps } from '@material-ui/core/transitions';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import MessageBox from './MessageBox';
import GroupMsgBox from './GroupMsgBox';

// badge styles
// const StyledBadge = withStyles((theme: Theme) =>
//   createStyles({
//     badge: {
//       right: -20,
//       top: 16,
//       height: 25,
//       width: 25,
//       borderRadius: "50%",
//       border: `2px solid ${theme.palette.background.paper}`,
//       padding: '0 4px',
//       backgroundColor: theme.palette.type === 'light' ? '#FF8A80' : '#D32F2F',
//       color: theme.palette.text.secondary
//     },
//   }),
// )(Badge);

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#AED581',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#AED581',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#AED581',
      },
    },
  },
})(TextField);

// tab panel
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

// tab styles
const StyledTabs = withStyles({
  root: {
    // width: '450px',
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 70,
      width: '100%',
      backgroundColor: '#AED581',
    },
  },
})((props: StyledTabsProps) => <Tabs {...props} centered TabIndicatorProps={{ children: <span /> }} />);

interface StyledTabProps {
  label: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(16),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
        fontWeight: theme.typography.fontWeightMedium
      },
    },
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

// normal styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      // borderRight: `1px solid ${theme.palette.divider}`,
    },
    listlink: {
      padding: 15,
      backdropFilter: 'blur(10px)',
      borderTop: `1px solid ${theme.palette.divider}`,
      // borderRadius: 10,
      // width: '90%',
      // backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#e2e2e250',
      // background: '#AED58110',
      cursor: 'pointer',
      // marginBottom: 10,
    },
    root: {
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff'
    },
    divd: {
      backgroundColor: theme.palette.type === 'dark' ? '#242424' : '#ebebeb'
    },
    searchList: {
      display: 'flex',
      cursor: 'pointer',
    },
  })
)

const ALL_CHATS = gql`
  query RetrieveChats($currentUser: String!) {
    retrieveChats(currentUser: $currentUser) {
      id
      persons
      chats {
        sender
        message
        date
      }
    }
  }
`;

const ALL_GROUPS = gql`
  query RetrieveGroups($currentUser: String!) {
    retrieveGroups(currentUser: $currentUser) {
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

const Inbox: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [ search, setSearch ] = React.useState('')
  const [ groupName, setGroupName ] = React.useState('')
  let currentUser = localStorage.getItem("user")

  // search
  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  // groupname
  const changeGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }
  const handleDialogCancel = () => {
    setDialogOpen(false);
  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
        <div style={{maxHeight: '90vh', marginTop: 50}}>
          <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
            <StyledTab label="Chats" {...a11yProps(0)} />
            <StyledTab label="Groups" {...a11yProps(1)} />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <Chats />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Groups handleDialogOpen={handleDialogOpen} />
          </TabPanel>
        </div>

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
        <DialogTitle id="alert-dialog-slide-title">{"Create New Group"}</DialogTitle>
        <DialogContent>
          <CssTextField 
            placeholder="Enter Group Name..." 
            fullWidth
            value={groupName}
            onChange={changeGroupName}
            inputProps={{ 'aria-label': 'description' }} 
          />
          <br />
          <br />
          <CssTextField 
            placeholder="Search people to add..." 
            fullWidth
            value={search}
            onChange={changeSearch}
            inputProps={{ 'aria-label': 'description' }} 
          />
          <SearchUsers 
            groupName={groupName}
            search={search}
            classes={classes}
            currentUser={currentUser}
            handleDialogClose={handleDialogClose}
            handleDialogCancel={handleDialogCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Inbox;

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

const CREATE_GROUP = gql`
  mutation CreateGroup($groupName: String, $createdBy: String!, $persons:[String!]!) {
    createGroup(groupName: $groupName, createdBy: $createdBy, persons: $persons) {
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

const SearchUsers = (props: any) => {

  let currentUser = localStorage.getItem("user")
  const { loading, error, data} = useQuery(SEARCH_USERS, {
    variables: { letter: props.search }
  })
  const [snackState, setSnackState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children?: React.ReactElement<any, any> }>;
  }>({
    open: false,
    Transition: Slide,
  });
  const handleCloseSnack = () => {
    setSnackState({
      ...snackState,
      open: false,
    });
  };

  const [state, setState] = React.useState<any[]>([])

  const [createGroup] = useMutation(CREATE_GROUP)

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
      await createGroup({
        variables: {groupName: props.groupName,createdBy: props.currentUser, persons: state}
      })
      setSnackState({open: true, Transition: SlideTransition})
      props.handleDialogClose()
    }
  }
  return(
    <div style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
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
        <div style={{height: 260,overflowY: 'auto'}}>
          <List>
          {data.searchUser.filter((idx: any) => idx.username !== currentUser).map((index: any) => (
            <ListItem className={props.classes.searchList} key={index.username}>
              <ListItemAvatar>
                <Avatar style={{backgroundColor: 'orange'}}>{index.username.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText id={index.username} primary={index.username}/>
              <ListItemSecondaryAction onClick={() => handleSelect(index.username)}>
                <IconButton>
                  <PersonAddOutlinedIcon />
                </IconButton>
                {/* <Button>Add</Button> */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        </div>
        
        </>
      )}
      <div style={{bottom: 10, alignSelf: 'flex-end', position: "absolute"}}>
        <Button onClick={handleCancel} style={{color: '#AED581', marginRight: 15}}>
          Cancel
        </Button>
        <Button onClick={handleOk} style={{backgroundColor: '#AED581', color: '#000'}}>
          Ok
        </Button>
      </div>
      <Snackbar
        open={snackState.open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={handleCloseSnack}
        autoHideDuration={2500}
        TransitionComponent={snackState.Transition}
        message={`${props.groupName} group created successfully!`}
        key={snackState.Transition.name}
      />
    </div>
  )
}


// chats tab
const Chats: React.FC = (props: any) => {
  let currentUser = localStorage.getItem("user")
  const { loading, error, data } = useQuery(ALL_CHATS, {
    variables: {currentUser: currentUser},
    pollInterval: 500
  })
  const classes = useStyles();
  const theme = useTheme();
  const [name, setName] = React.useState('')
  return(
    <div  style={{maxHeight: "100%"}}>
    { loading ? (
        <div style={{minHeight: "79vh", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <CircularProgress size="30px" style={{color: '#AED581'}} />
        </div>
      ) : 
      error ? (
        <p>{error.message}<Redirect to="/login" /></p>
      ) :
      data.retrieveChats.length === 0 ? (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column'}}>
          {/* <img src={noData} alt="" style={{height: 200, width: 350, opacity: 0.8}} /> */}
          <img src={emtInbox} alt="" style={{height: 120, width: 220, opacity: 0.8}} />
          <Typography style={{color: '#BDBDBD'}}>
            Oh no! Your inbox is empty
          </Typography>
          <Typography style={{color: '#BDBDBD'}}>
            Click here to search for people <Link to="/search" style={{color: '#AED581'}}>Search</Link>
          </Typography>
        </div>
      ) :
      (
        <div style={{display: 'flex', flexDirection: 'row'}}>
          {/* <Grid item xs={1}></Grid> */}
          <Grid item xs={3} style={{height: '86vh', overflow: 'auto', borderRight: `1px solid ${theme.palette.divider}`,background: '#AED58110',}}>
        {data.retrieveChats.map((index: any) => (
        <List style={{padding: 0}}>
        <ListItem key={index.id} className={classes.listlink} onClick={() => setName(index.persons[0] === currentUser ? index.persons[1] : index.persons[0])}>
        <Avatar>M</Avatar>
        <span style={{flexGrow: .07}}></span>
        <div>
          <Typography variant='body1' color="textPrimary">
            {index.persons[0] === currentUser ? index.persons[1] : index.persons[0]}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{overflow: 'hidden'}}>
          <b>{index.persons[0] === currentUser ? "You: " : ""}</b> {index.chats.slice(-1)[0].message}
          </Typography>
        </div>
        </ListItem>
        {/* <Divider className={classes.divd} /> */}
        </List>
      ))}</Grid>
      {/* <Grid item xs={8} style={{ borderTop: `1px solid ${theme.palette.divider}`,}}> */}
        <MessageBox name={name} />
        {/* <Switch>
          <Route exact path={path}>
            <Typography color="textPrimary">Select a person to start messaging</Typography>
          </Route>
          <Route exact path={`/inbox/${name}`} component={MessageBox} /> 
        </Switch> */}
      {/* </Grid> */}
      </div>
      )
    }
    </div>
  )
}

interface Props {
  handleDialogOpen: any
}

//groups tab
const Groups: React.FC<Props> = (props: any) => {
  let currentUser = localStorage.getItem("user")
  const { loading, error, data } = useQuery(ALL_GROUPS, {
    variables: {currentUser: currentUser},
    pollInterval: 500
  })
  const [groupId, setGroupId] = React.useState('')
  const classes = useStyles();
  const theme = useTheme();
  
  return(
    <div>
    { loading ? (
      <div style={{minHeight: "79vh", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress size="30px" style={{color: '#AED581'}}  />
      </div>
      ) : 
      error ? (
        <p>{error.message}<Redirect to="/login" /></p>
      ) :
      data.retrieveGroups.length === 0 ? (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column'}}>
          {/* <img src={noData} alt="" style={{height: 200, width: 350, opacity: 0.8}} /> */}
          <img src={emtInbox} alt="" style={{height: 120, width: 220, opacity: 0.8}} />
          <Typography style={{color: '#BDBDBD'}}>
            Oh no! Your inbox is empty
          </Typography>
          <Typography style={{color: '#BDBDBD'}}>
            Click here to search for people <Link to="/search" style={{color: '#AED581'}}>Search</Link>
          </Typography>
        </div>
      ) :
      
      (
        <div style={{display: 'flex', flexDirection: 'row'}}>
        <Grid item xs={1}>
          <Button onClick={props.handleDialogOpen} style={{margin: 20, textTransform: "capitalize"}}>Create Group</Button>
        </Grid>
        <Grid item xs={3} style={{height: '86vh', overflow: 'auto', borderRight: `1px solid ${theme.palette.divider}`,background: '#AED58110',}}>
        {data.retrieveGroups.map((index: any) => (
        <List style={{padding: 0}}>
        <ListItem key={index.id} className={classes.listlink} onClick={() => setGroupId(index.id)} >
        <Avatar>{index.groupName.charAt(0).toUpperCase()}</Avatar>
        <span style={{flexGrow: .07}}></span>
        <div>
          <Typography variant='body1' color="textPrimary" style={{overflow: 'hidden'}}>
            {index.groupName}
          </Typography>
          {index.chats.length === 0 ? (
            <Typography variant="body2" color="textSecondary" style={{overflow: 'hidden', fontStyle: 'italic'}}>Start your Conversation</Typography>
            ) : (
            <Typography variant="body2" color="textSecondary" style={{overflow: 'hidden'}}>
              {index.chats.slice(-1)[0].sender}: {index.chats.slice(-1)[0].message}
            </Typography>
          )}
        </div>
        </ListItem>
        </List>
      ))}
      </Grid>
        {/* <Grid item xs={7}> */}
        <GroupMsgBox groupId={groupId} />
        {/* </Grid> */}
      </div>
      )
    }
    </div>
  )
}