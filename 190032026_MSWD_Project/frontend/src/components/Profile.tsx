import React from "react";
import { Redirect } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import { useQuery, gql } from "@apollo/client";
import {
  Card,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    heading: {
      fontSize: theme.typography.pxToRem(16),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    details: {
      backgroundColor: theme.palette.type === "dark" ? "#464646" : "#FCF3F4",
    },
    summary: {
      backgroundColor: theme.palette.type === "dark" ? "#000" : "#FAFAFA",
      opacity: 0.8,
    },
    buttons: {
      backgroundColor: "#D32F2F",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#EF5350",
      },
    },
    leftContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    boxes: {
      padding: "10px 20px",
      backdropFilter: "blur(10px)",
      // border: `1px solid ${theme.palette.divider}`,
      boxShadow: "3px 3px 8px #0000002a",
      borderRadius: 10,
      width: "80%",
      background: "#AED58110",
      display: "inline-block",
      marginBottom: "20px",
    },
  })
);

const USER_DATA = gql`
  query UserProfile {
    profile {
      id
      name
      email
      username
    }
  }
`;

const Profile: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  // const [expanded, setExpanded] = React.useState<string | false>(false);

  // const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  return (
    <div className={classes.root}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size="30px" style={{ color: "#4527A0" }} />
        </div>
      ) : error ? (
        <>
          <p>{error.message}</p>
          <Redirect to="/login" />
        </>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={12} md={8}>
            <div className={classes.leftContainer}>
              {/* <Avatar src={`${data.profile.profilePic}`} alt={data.profile.username} style={{height: 150, width: 150, borderRadius: "50%", objectFit: "cover"}} /> */}
              <Typography gutterBottom variant="h6" color="textPrimary">
                My Profile
              </Typography>
              <span style={{ flexGrow: 0.2 }}></span>
              <Card elevation={4} variant="elevation" className={classes.boxes}>
                <Typography variant="body2" color="textPrimary">
                  Name
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {data.profile.name}
                </Typography>
              </Card>
              <Card elevation={4} variant="elevation" className={classes.boxes}>
                <Typography variant="body2" color="textPrimary">
                  Username
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {data.profile.username}
                </Typography>
              </Card>
              <Card elevation={4} variant="elevation" className={classes.boxes}>
                <Typography variant="body2" color="textPrimary">
                  Email
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {data.profile.email}
                </Typography>
              </Card>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Profile;
