import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import Profile from './components/Profile';
import Search from './components/Search';
import Inbox from './components/Inbox';
import OthersProfile from './components/OthersProfile';
import Settings from './components/Settings';
import GroupMsgBox from './components/GroupMsgBox';


const client = new ApolloClient({
  uri: "https://msg-app-backend.herokuapp.com/graphql",
  cache: new InMemoryCache()
});

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
        main: darkTheme ? '#90caf9' : '#757ce8',
      },
      type: darkTheme ? "dark" : "light"
    }
  });

  React.useEffect(() => {
    const themeType = localStorage.getItem("theme") || "light";
    if(themeType === "light") {
      setDarkTheme(false)
    }
  }, [])
  const toggleDarkTheme = () => {
    localStorage.setItem("theme", darkTheme ? "light" : "dark")
    setDarkTheme(!darkTheme);
    // let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    // setTheme({
    //   palette: {
    //     type: newPaletteType
    //   }
    // })
  }


  return (
  <ApolloProvider client={client}>
    <ThemeProvider theme={muiTheme}>
    <div className="App">
      <Router>
        <React.Fragment>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/inbox/">
              <Inbox />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/profile/:otherUser">
              <OthersProfile />
            </Route>
            {/* <Route exact path="/inbox/:name">
              <MessageBox />
            </Route> */}
            <Route exact path="/inbox/group/:id">
              <GroupMsgBox />
            </Route>
            <Route exact path="/settings">
              <Settings onToggleDark={toggleDarkTheme} />
            </Route>
          </Switch>
        </React.Fragment>
      </Router>
    </div>
    
    </ThemeProvider>
  </ApolloProvider>
  );
}

export default App;
