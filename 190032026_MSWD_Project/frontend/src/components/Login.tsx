import React from "react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Snackbar,
  CssBaseline,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import {
  makeStyles,
  withStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { Link, useHistory, Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { TransitionProps } from "@material-ui/core/transitions";
import ClayPurple from "../images/Clay_Purple.png";

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    textTransform: "capitalize",
    height: 40,
    borderRadius: 8,
    boxShadow: "none",
    color: theme.palette.getContrastText("#0e9170"),
    backgroundColor: "#673AB7",
    "&:hover": {
      backgroundColor: "#7E57C2",
    },
  },
}))(Button);

const CssTextField = withStyles((theme: Theme) => ({
  root: {
    "& label.Mui-focused": {
      color: theme.palette.type === "light" ? "#673AB7" : "#9575CD",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.palette.type === "light" ? "#673AB7" : "#9575CD",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.type === "light" ? "#673AB7" : "#9575CD",
      },
    },
  },
}))(TextField);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      // height: "100vh",
      backgroundColor: theme.palette.type === "dark" ? "#111111" : "#fff",
    },
    root: {
      // flexGrow: 1,
      minHeight: "100vh",
      // width: "80%",
      // padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      margin: "0px 15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    imageGrid: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.type === "light" ? "#bcadd4" : "#45404e",
      // backgroundSize: "cover",
      // backgroundPosition: "center",
    },
    image: {
      [theme.breakpoints.down("sm")]: {
        height: "400px",
      },
      [theme.breakpoints.down("xs")]: {
        height: "300px",
      },
    },
    form: {
      width: "300px",
      // marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

// interface user {
//   id: number;
//   name: string;
//   usernanme: string;
//   email: string;
// }

// interface login {
//   user: user;
//   token: string;
//   refreshToken: string;
// }

// interface loginVars {
//   username: string;
//   password: string;
// }

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const USER_LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        name
        username
        email
      }
      token
      refreshToken
    }
  }
`;

const Login: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [state, setState] = React.useState<{
    open: boolean;
    message: string;
    Transition: React.ComponentType<
      TransitionProps & { children?: React.ReactElement<any, any> }
    >;
  }>({
    open: false,
    message: "",
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
  };
  const onChangepass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const [LoginUser, { error, loading, data }] = useMutation(USER_LOGIN);
  // if (localStorage.getItem('token') !== undefined) {
  //   return <Redirect to="/" />
  // }
  const onSubmit = async () => {
    await LoginUser({
      variables: { username: username, password: password },
    })
      .then((response) => {
        console.log(response.data.login.token);
        let token = response.data.login.token;
        let username = response.data.login.user.username;
        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        setState({
          open: true,
          Transition: SlideTransition,
          message: "Login success!",
        });
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        setState({
          open: true,
          Transition: SlideTransition,
          message: error.message,
        });
      });
    //   if (error) {
    //     // console.log(error)
    //     setState({
    //       open: true,
    //       Transition: SlideTransition,
    //       message: error.message,
    //     });
    //   } else {

    //   }
  };

  return (
    <div className={classes.main}>
      {localStorage.getItem("token") !== undefined &&
      localStorage.getItem("token") !== null ? (
        <>
          <Typography>You are already loggedin</Typography>
          <Redirect to="/" />
        </>
      ) : (
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={12} sm={6} md={6} className={classes.imageGrid}>
            <img src={ClayPurple} alt="" className={classes.image} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <div className={classes.paper}>
              <div>
                <Typography component="h1" variant="h5">
                  Welcome back!
                </Typography>
                <div className={classes.form}>
                  <CssTextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    type="text"
                    size="small"
                    onChange={onChangeuser}
                  />
                  <CssTextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    size="small"
                    onChange={onChangepass}
                  />
                  <Link
                    to="#"
                    style={{
                      color:
                        theme.palette.type === "light" ? "#673AB7" : "#9575CD",
                      textDecoration: "none",
                      alignSelf: "flex-end",
                    }}
                  >
                    Forgot password?
                  </Link>
                  <ColorButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={onSubmit}
                  >
                    {loading ? (
                      <CircularProgress size={28} color="inherit" />
                    ) : (
                      <Typography
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        Login
                      </Typography>
                    )}
                  </ColorButton>
                  <Link
                    to="/signup"
                    style={{
                      textDecoration: "none",
                      color:
                        theme.palette.type === "light" ? "#101010" : "#f1f1f1",
                    }}
                  >
                    Don't have an account?{" "}
                    <span
                      style={{
                        color:
                          theme.palette.type === "light"
                            ? "#673AB7"
                            : "#9575CD",
                      }}
                    >
                      Sign up
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={state.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        autoHideDuration={2500}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
      />
    </div>
  );
};

export default Login;
