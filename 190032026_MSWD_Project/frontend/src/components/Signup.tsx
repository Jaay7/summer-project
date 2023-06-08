import React from "react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  CssBaseline,
  Slide,
  Snackbar,
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
import TwoPeople from "../images/TwoPeople.svg";

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
      height: "600px",
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
  mutation RegisterUser(
    $name: String!
    $email: String!
    $password: String!
    $username: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      username: $username
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
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
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
  const onChangename = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeemail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const [RegisterUser, { error, loading, data }] = useMutation(USER_REGISTER);
  const onSubmit = async () => {
    await RegisterUser({
      variables: {
        name: name,
        email: email,
        password: password,
        username: username,
      },
    })
      .then((res) => {
        console.log(res.data.register.token);
        let token = res.data.register.token;
        let username = res.data.register.user.username;
        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        setState({
          open: true,
          Transition: SlideTransition,
          message: "Signed up successfully!",
        });
        history.push("/");
      })
      .catch((err) => {
        console.log(error);
        setState({
          open: true,
          Transition: SlideTransition,
          message: err.message,
        });
      });

    // if (error) {
    // }
    // else {
    //   console.log(data?.token);
    //   let token = response.data.register.token;
    //   let username = response.data.register.user.username;
    //   localStorage.setItem("token", token);
    //   localStorage.setItem("user", username);
    //   history.push("/");
    // }
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
          <Grid item xs={12} sm={6} md={6}>
            <div className={classes.paper}>
              <div>
                <Typography component="h1" variant="h5">
                  Signup Here,
                </Typography>
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
                    {loading ? (
                      <CircularProgress size={28} color="inherit" />
                    ) : (
                      <Typography
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        Signup
                      </Typography>
                    )}
                  </ColorButton>
                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "none",
                          color:
                            theme.palette.type === "light"
                              ? "#101010"
                              : "#f1f1f1",
                        }}
                      >
                        Already have an account?{" "}
                        <span
                          style={{
                            color:
                              theme.palette.type === "light"
                                ? "#673AB7"
                                : "#9575CD",
                          }}
                        >
                          Login
                        </span>
                      </Link>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} className={classes.imageGrid}>
            <img src={TwoPeople} alt="" className={classes.image} />
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

export default Signup;
