import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
// import {useHistory} from 'react-router-dom'
import {
  Grid,
  Snackbar,
  Button,
  Typography,
  InputBase,
  InputAdornment,
  Slide,
  Avatar,
  // useMediaQuery,
} from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { TransitionProps } from "@material-ui/core/transitions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: "max-content",
      // margin: "0px 20px",
      // borderTop: `1px solid ${theme.palette.divider}`,
      // backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff'
    },
    inputRoot: {
      color: theme.palette.type === "dark" ? "#f1f1f1" : "inherit",
      borderRadius: 10,
      marginLeft: 20,
      paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
      backgroundColor: theme.palette.type === "dark" ? "#424242" : "#eeeeee",
      paddingRight: `calc(1em + ${theme.spacing(2)}px)`,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      height: 40,
      transition: theme.transitions.create("width"),
      // [theme.breakpoints.up('sm')]: {
      //   width: '50ch',
      //   '&:focus': {
      //     width: '60ch',
      //   },
      // },
    },
    chatbox: {
      // borderLeft: theme.palette.type === 'dark' ? '1px solid #303030' : "1px solid #e2e2e2",
      // borderRight: theme.palette.type === 'dark' ? '1px solid #303030' : "1px solid #e2e2e2",
      height: "100vh",
      position: "relative",
    },
    tabbar: {
      // height: 40,
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      padding: 10,
      backgroundColor: theme.palette.type === "dark" ? "#111111" : "#fff",
    },
    leftSide: {
      padding: "5px 15px",
      borderRadius: "0px 10px 10px 0px",
      borderLeft: "4px solid #FF8A80",
      alignSelf: "flex-start",
      width: "max-content",
      border:
        theme.palette.type === "dark"
          ? "1px solid #303030"
          : "1px solid #e2e2e2",
      margin: 5,
      display: "flex",
      color: theme.palette.text.primary,
      maxWidth: "60%",
    },
    rightSide: {
      padding: "5px 15px",
      borderRadius: "10px 0px 0px 10px",
      borderRight: "4px solid #42A5F5",
      display: "flex",
      color: theme.palette.text.primary,
      // backgroundColor: '#C62828',
      border:
        theme.palette.type === "dark"
          ? "1px solid #303030"
          : "1px solid #e2e2e2",
      alignSelf: "flex-end",
      margin: 5,
      maxWidth: "60%",
    },
  })
);

const RET_MSGS = gql`
  query RetrieveMessages($currentUser: String!, $otherUser: String!) {
    retrieveMessages(currentUser: $currentUser, otherUser: $otherUser) {
      id
      persons
      chats {
        sender
        message
      }
    }
  }
`;

const SEND_MSG = gql`
  mutation SendMessage(
    $sender: String!
    $otherUser: String!
    $message: String!
  ) {
    sendMessage(sender: $sender, otherUser: $otherUser, message: $message) {
      id
      persons
      chats {
        sender
        message
      }
    }
  }
`;

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const AlwaysScollToBottom = () => {
  const elementRef = React.useRef<any>();
  React.useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const MessageBox = (props: any) => {
  // const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  // const matches = useMediaQuery('(min-width:920px)');
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & { children?: React.ReactElement<any, any> }
    >;
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
  let currentUser = localStorage.getItem("user");
  // let {name} = useParams<parm>()
  const [message, setMessage] = useState("");
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const { loading, error, data } = useQuery(RET_MSGS, {
    variables: { currentUser: currentUser, otherUser: props.name },
    pollInterval: 500,
  });

  const [sendMessage] = useMutation(SEND_MSG);

  // useEffect(() => {
  //   refetch()
  // }, [refetch])

  const onSend = async () => {
    if (message !== "") {
      await sendMessage({
        variables: {
          sender: currentUser,
          otherUser: props.name,
          message: message,
        },
      });
    } else {
      setState({ open: true, Transition: SlideTransition });
    }
    setMessage("");
  };

  let emojiPicker;
  if (emojiPickerState) {
    emojiPicker = (
      <Picker
        // darkMode={false}
        title="Pick your emoji..."
        emoji="point_up"
        style={{ position: "absolute", bottom: 70, right: 40 }}
        onSelect={(emoji: any) => setMessage(message + emoji.native)}
      />
    );
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      console.log("enter is working...");
      onSend();
    }
  };

  if (props.name === "") {
    return (
      <div
        className={classes.root}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="textPrimary">
          Select a person to start messaging
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {/* <Header /> */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div className={classes.chatbox}>
            <div className={classes.tabbar}>
              {/* <IconButton onClick={() => history.goBack()} style={{color: theme.palette.type === 'dark' ? '#fff': '#000', padding: 8}}>
                <KeyboardArrowLeftRounded />
              </IconButton> */}
              <Avatar>{props.name.charAt(0).toUpperCase()}</Avatar>
              <Typography
                color="textPrimary"
                style={{ marginLeft: 8, fontSize: 16, fontWeight: 600 }}
              >
                {props.name}
              </Typography>
            </div>
            <div style={{ flexGrow: 1, height: "80vh", overflowY: "auto" }}>
              {loading ? (
                <>
                  <CircularProgress />
                </>
              ) : error ? (
                <></>
              ) : data.retrieveMessages.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h5" style={{ color: "#BDBDBD" }}>
                    Start your conversation
                  </Typography>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    minHeight: "100%",
                  }}
                >
                  {data.retrieveMessages.chats.map((index: any) =>
                    index.sender === currentUser ? (
                      <div key={index._id} className={classes.rightSide}>
                        <Typography>{index.message}</Typography>
                      </div>
                    ) : (
                      <div key={index._id} className={classes.leftSide}>
                        <Typography>{index.message}</Typography>
                      </div>
                    )
                  )}
                  <AlwaysScollToBottom />
                </div>
              )}
            </div>
            {emojiPicker}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                flex: 0.1,
                width: "100%",
                display: "flex",
                paddingBottom: 10,
              }}
            >
              <InputBase
                placeholder="Enter message…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                fullWidth
                autoFocus
                value={message}
                onKeyDown={handleKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <SentimentSatisfiedOutlinedIcon
                      style={{ cursor: "pointer" }}
                      onClick={(event) => {
                        event.preventDefault();
                        SetEmojiPicker(!emojiPickerState);
                      }}
                    />
                  </InputAdornment>
                }
                onChange={changeMessage}
                inputProps={{ "aria-label": "search" }}
              />
              <Button
                variant="contained"
                onClick={onSend}
                style={{
                  height: 35,
                  alignSelf: "center",
                  backgroundColor:
                    theme.palette.type === "dark" ? "#EF9A9A" : "#D32F2F",
                  color: theme.palette.type === "dark" ? "revert" : "#fff",
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={state.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        autoHideDuration={2500}
        TransitionComponent={state.Transition}
        message="Can't send empty message"
        key={state.Transition.name}
      />
    </div>
  );
};

export default MessageBox;
