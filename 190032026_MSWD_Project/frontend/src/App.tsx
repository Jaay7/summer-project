import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
// import './App.css';
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Inbox from "./components/Inbox";
import OthersProfile from "./components/OthersProfile";
import Settings from "./components/Settings";
import GroupMsgBox from "./components/GroupMsgBox";
import Header from "./components/Header";

const client = new ApolloClient({
  uri: "https://message-app-apis.onrender.com/graphql",
  cache: new InMemoryCache(),
});

interface Darking {
  toggleDarkTheme: any
}

const AppWithRouter: React.FC<Darking> = ({toggleDarkTheme}) => {
  let location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return(
    <>
    {!isAuthPage && <Header onToggleDark={toggleDarkTheme} />}
            <Switch>
              {/* <Route
                path="/"
                render={() => }
              ></Route> */}
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
            </Switch>
    </>
  )
}

const App: React.FC = () => {
  // const [theme, setTheme] = React.useState<MTheme>({
  //   palette: {
  //     type: "light"
  //   }
  // })
  const [darkTheme, setDarkTheme] = React.useState(true);

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: darkTheme ? "#90caf9" : "#757ce8",
      },
      type: darkTheme ? "dark" : "light",
    },
    typography: {
      fontFamily: "'Source Sans Pro', sans-serif",
    },
  });

  React.useEffect(() => {
    const themeType = localStorage.getItem("theme") || "light";
    if (themeType === "light") {
      setDarkTheme(false);
    }
  }, []);
  const toggleDarkTheme = () => {
    localStorage.setItem("theme", darkTheme ? "light" : "dark");
    setDarkTheme(!darkTheme);
    // let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    // setTheme({
    //   palette: {
    //     type: newPaletteType
    //   }
    // })
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={muiTheme}>
        <div className="App">
          <Router>
            <AppWithRouter toggleDarkTheme={toggleDarkTheme} />
          </Router>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
