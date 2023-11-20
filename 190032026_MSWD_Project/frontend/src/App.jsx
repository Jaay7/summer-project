import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ChatContainer from "./components/ChatContainer";
import Dashboard from "./components/Dashboard";
import GroupChat from "./components/GroupChat";
import Inbox from "./components/Inbox";
import NotFound from "./components/NotFound";
import OthersProfile from "./components/OthersProfile";
import PersonalChat from "./components/PersonalChat";
import Profile from "./components/Profile";
import Search from "./components/Search";

function App() {
  const [openSideNav, setOpenSideNav] = React.useState(false);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                isOpen={openSideNav}
                toggle={() => setOpenSideNav(!openSideNav)}
              />
            }
          >
            <Route
              path="/"
              element={<Search toggle={() => setOpenSideNav(!openSideNav)} />}
            />
            <Route
              path="/profile"
              element={<Profile toggle={() => setOpenSideNav(!openSideNav)} />}
            />
            <Route
              path="/inbox"
              element={<Inbox toggle={() => setOpenSideNav(!openSideNav)} />}
            >
              <Route path=":person" element={<ChatContainer />} />
            </Route>
            <Route
              path="/user/:id"
              element={
                <OthersProfile toggle={() => setOpenSideNav(!openSideNav)} />
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
