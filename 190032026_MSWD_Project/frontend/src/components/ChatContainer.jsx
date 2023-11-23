import React from "react";
import { useLocation } from "react-router-dom";
import GroupChat from "./GroupChat";
import PersonalChat from "./PersonalChat";
const ChatContainer = () => {
  let location = useLocation();
  return location.state.chatType === "group" ? <GroupChat /> : <PersonalChat />;
};

export default ChatContainer;
