import React from 'react'
import { Button, TextField, Typography, Grid, CssBaseline, Slide, Snackbar } from '@material-ui/core';
import { makeStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link, useHistory, Redirect } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client';
import { TransitionProps } from '@material-ui/core/transitions';

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    textTransform: 'capitalize',
    height: 40,
    borderRadius: 5,
    boxShadow: 'none',
    color: theme.palette.getContrastText('#0e9170'),
    background: 'linear-gradient(152deg, #2193b0 0%, #6dd5ed 100%)',
    '&:hover': {
      boxShadow: '2px 4px 6px #2193b060',
      backgroundColor: '#1a866b96',
    },
  },
}))(Button);

const CssTextField = withStyles({
  root: {
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff'
    },
    root: {
      // flexGrow: 1,
      height: '70vh',
      width: '80%',
    },
    paper: {
      padding: theme.spacing(2),
      margin: "0px 15px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: "100%"
    },
    image: {
      backgroundImage: 'url(https://images.unsplash.com/photo-1506377711776-dbdc2f3c20d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(1),
      alignSelf: 'center'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
)

// interface user {
//   id: number;
//   name: string;
//   usernanme: string;
//   email: string;
// }

// interface register {
//   user: user;
//   token: string;
//   refreshToken: string;
// }

// interface registerVars {
//   name: string;
//   email: string;
//   password: string;
//   username: string;
// }

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const USER_REGISTER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!, $username: String!) {
    register(
      name: $name,
      email: $email,
      password: $password,
      username: $username,
    ) {
      user {
        id
        name
        email
        username
      }
      token
      refreshToken
    }
  }
`;

const Signup: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const [ username, setUsername ] = React.useState('');
  const [name, setName ] = React.useState('');
  const [email, setEmail ] = React.useState('');
  const [password, setPassword ] = React.useState('');

  const [state, setState] = React.useState<{
    open: boolean;
    message: string;
    Transition: React.ComponentType<TransitionProps & { children?: React.ReactElement<any, any> }>;
  }>({
    open: false,
    message: '',
    Transition: Slide,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const onChangeuser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }
  const onChangepass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }
  const onChangename = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }
  const onChangeemail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const [RegisterUser, {error, data}] = useMutation(USER_REGISTER)
  const onSubmit = async () => {
    const response = await RegisterUser({
      variables: { name: name, email: email, password: password, username: username} 
    })
  
    if(error) {
      console.log(error)
      setState({open: true, Transition: SlideTransition, message: error.message})
    } else {
      console.log(data?.token)
      let token = response.data.register.token
      let username = response.data.register.user.username
      localStorage.setItem('token', token);
      localStorage.setItem('user', username);
      history.push("/");
    }
  }
  return (
    <div className={classes.main}>
      { localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null ? (
        <>
        <Typography>You are already loggedin</Typography>
        <Redirect to="/" />
        </>
      ) : (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={4}>
          <div className={classes.paper}>
            <div>
              <Typography component="h1" variant="h5">Signup Here,</Typography>
              <div className={classes.form}>
                <CssTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  type="text"
                  size="small"
                  onChange={onChangename}
                />
                <CssTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  size="small"
                  name="username"
                  type="text"
                  onChange={onChangeuser}
                />
                <CssTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  size="small"
                  label="Email"
                  name="email"
                  type="email"
                  onChange={onChangeemail}
                />
                <CssTextField
                  variant="outlined"
                  margin="normal"
                  required
                  size="small"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={onChangepass}
                />
                <ColorButton 
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onSubmit}
                >
                  <Typography style={{ textDecoration: 'none', color: '#fff'}}>Signup</Typography>
                </ColorButton >
                <Grid container>
                  <Grid item xs>
                    
                  </Grid>
                  <Grid item>
                    <Link to="/login" style={{color: '#0083B0'}}>
                      Already have an account? Login
                    </Link>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={false} sm={4} md={8} className={classes.image}>
          {/* <Typography>This is Signup page</Typography> */}
        </Grid>
      </Grid>
      )}
      <Snackbar
        open={state.open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={handleClose}
        autoHideDuration={2500}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
      />
    </div>
  )
}

export default Signup
