import React from 'react'
import { 
  Typography, Button, Tabs, 
  Tab, Box, Grid, TextField, 
  CircularProgress, IconButton
} from '@material-ui/core'
import { Redirect, useHistory } from 'react-router-dom'
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import Header from './Header';
import { useQuery, gql, useMutation } from '@apollo/client';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import {WbSunnyRounded, NightsStayRounded} from '@material-ui/icons';

const CssTextField = withStyles({
  root: {
    margin: "0px 20px",
    width: '300px',
    '& label.Mui-focused': {
      color: '#1890ff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1890ff',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1890ff',
      },
    },
  },
})(TextField);

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  orientation: any;
  className: any;
}

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      minWidth: 440,
      width: '100%',
      backgroundColor: '#FF572240',
      zIndex: 0
    },
  },
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

interface StyledTabProps {
  label: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: "200px",
      zIndex: 1,
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
      },
    },
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{width: "80%"}}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff' 
    },
    buttons: {
      backgroundColor: '#D32F2F',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#EF5350'
      }
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      minHeight: '70vh',
      // backgroundColor: '#f1f1f1',
      paddingTop: 40
    },
    main: {
      flexGrow: 1,
      // backgroundColor: theme.palette.background.paper,
      minHeight: "88vh",
      border: theme.palette.type === "light" ? "1px solid #e2e2e2" : "1px solid #464646",
      borderTop: "none",
      borderBottom: "none"
    },
    container: {
      flexGrow: 1,
      display: 'flex',
      minHeight: "80vh",
    },
    editDetails: {
      display: 'flex',
      flexGrow: 1,
      width: "100%",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    fields: {
      display: 'flex',
      width: "100%",
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 20
    }
  }),
);

interface dark {
  onToggleDark: any
}

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

const EDIT_NAME = gql`
  mutation EditName($username: String!, $newName: String!) {
    editName(username: $username, newName: $newName) {
      id
      email
      name
      username
    }
  }
`;

const EDIT_EMAIL = gql`
  mutation EditEmail($username: String!, $newEmail: String!) {
    editEmail(username: $username, newEmail: $newEmail) {
      id
      email
      name
      username
    }
  }
`;

const Settings: React.FC<dark> = ({onToggleDark}) => {
  let currentUser = localStorage.getItem("user")

  const history = useHistory()
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    },
    pollInterval: 500
  })

  const [editName] = useMutation(EDIT_NAME);
  const [editEmail] = useMutation(EDIT_EMAIL);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }
  
  const onClickName = async() => {
    if(name !== '') {
      await editName({
        variables: {username: currentUser, newName: name}
      })
    }
    setName('')
  }

  const onClickEmail = async() => {
    if(email !== '') {
      await editEmail({
        variables: {username: currentUser, newEmail: email}
      })
    }
    setEmail('')
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login")
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
      <Grid container>
        <Grid item xs={2}></Grid>
        <div className={classes.main}>
        <div className={classes.container}>
          <StyledTabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <StyledTab label="Edit Detials" {...a11yProps(0)} />
            <StyledTab label="Theme" {...a11yProps(1)} />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <div className={classes.editDetails}>
              <div className={classes.fields}>
                <Typography color="textSecondary">Name: </Typography>
                <CssTextField
                  variant="standard"
                  margin="normal"
                  id="name"
                  name="name"
                  value={name}
                  placeholder={data.profile.name}
                  type="text"
                  onChange={onChangeName}
                />
                <IconButton onClick={onClickName}>
                  <EditRoundedIcon />
                </IconButton>
              </div>
              <div className={classes.fields}>
                <Typography color="textSecondary">Email: </Typography>
                <CssTextField
                  variant="standard"
                  margin="normal"
                  id="email"
                  name="email"
                  placeholder={data.profile.email}
                  value={email}
                  type="email"
                  onChange={onChangeEmail}
                />
                <IconButton onClick={onClickEmail}>
                  <EditRoundedIcon />
                </IconButton>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <IconButton onClick={onToggleDark}>
              {localStorage.getItem("theme") === "light" ? (
                <WbSunnyRounded />
              ) : (
                <NightsStayRounded />
              )}
            </IconButton>
            {/* <Button variant="outlined" color="primary">D/L</Button> */}
          </TabPanel>
        </div>
        <Button className={classes.buttons} variant="outlined" onClick={logout}>logout</Button>
        </div>
        <Grid item xs={2}></Grid>
      </Grid>
      )}
      <br></br>
    </div>
  )
}

export default Settings
