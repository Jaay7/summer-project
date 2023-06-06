import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  InputBase,
  InputAdornment,
  Avatar,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import searchImg from "../images/searchImg.svg";
import noData from "../images/noData.svg";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      color: theme.palette.type === "dark" ? "#f1f1f1" : "inherit",
      paddingLeft: theme.spacing(2),
      // backgroundColor: theme.palette.type === "dark" ? "#424242" : "#fff",
      borderBottom: `2px solid ${
        theme.palette.type === "light" ? "#EDE7F6" : "#4527A0"
      }`,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      height: 30,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
    itemss: {
      padding: 16,
      display: "flex",
      alignItems: "center",
      marginBottom: 6,
      backgroundColor: theme.palette.type === "dark" ? "#272727" : "#fff",
      borderRadius: 10,
      border: "none",
    },
    root: {
      //   backgroundColor: theme.palette.type === "dark" ? "#111111" : "#f4f4f4",
    },
    content: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
    },
  })
);

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

const Search: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { letter: search },
  });
  let currentUser = localStorage.getItem("user");
  // const matches = theme.breakpoints.down('sm');

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={8} className={classes.content}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputBase
              placeholder="Search for the Users…"
              autoFocus
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon
                    style={{
                      color:
                        theme.palette.type === "light" ? "#4527A0" : "#EDE7F6",
                    }}
                  />
                </InputAdornment>
              }
              onChange={changeSearch}
              inputProps={{ "aria-label": "search" }}
            />
          </div>

          <br></br>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size="30px" style={{ color: "#0277BD" }} />
            </div>
          ) : error ? (
            <>{error.message}</>
          ) : search === "" ? (
            <div
              style={{
                display: "flex",
                height: "68vh",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <img src={searchImg} alt="" style={{ height: 200, width: 350 }} />
            </div>
          ) : data.searchUser.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img src={noData} alt="" style={{ height: 200, width: 350 }} />
              <br></br>
              <br></br>
              <Typography variant="h5" style={{ color: "#464646" }}>
                No results found
              </Typography>
            </div>
          ) : (
            <List style={{ borderRadius: 8 }}>
              {data.searchUser
                .filter((idx: any) => idx.username !== currentUser)
                .map((index: any) => (
                  <>
                    <ListItem key={index.username}>
                      {/* <Card variant="outlined" className={classes.itemss}> */}
                      <ListItemAvatar>
                        <Avatar>
                          {index.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      {/* <span style={{ flexGrow: 1 }}></span> */}
                      <ListItemText
                        primary={index.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                            >
                              {index.email}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      {/* <span style={{ flexGrow: 1 }}></span> */}
                      <ListItemSecondaryAction>
                        <Button
                          style={{
                            backgroundColor: "#4527A0",
                            color: "#fff",
                            height: 30,
                            width: "max-content",
                            textTransform: "capitalize",
                          }}
                          onClick={() =>
                            history.push(`/profile/${index.username}`)
                          }
                        >
                          View Profile
                        </Button>
                      </ListItemSecondaryAction>
                      {/* </div> */}
                      {/* </Card> */}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))}
            </List>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
