import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client";
import { IoSendOutline } from "react-icons/io5";

const RET_GRP_MSGS = gql`
  query RetrieveGroupMessages($id: ID!) {
    retrieveGroupMessages(id: $id) {
      id
      groupName
      persons
      chats {
        sender
        message
        date
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

const SEND_GRP_MSG = gql`
  mutation SendGroupMessage($id: ID!, $sender: String!, $message: String!) {
    sendGroupMessage(id: $id, sender: $sender, message: $message) {
      id
      persons
      groupName
      chats {
        sender
        message
        date
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

const EDIT_GNAME = gql`
  mutation EditGroupName($id: ID!, $groupName: String!) {
    editGroupName(id: $id, groupName: $groupName) {
      id
      persons
      groupName
      createdBy
      createdAt
    }
  }
`;

const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!, $admin: String!) {
    deleteGroup(id: $id, admin: $admin)
  }
`;

const AlwaysScollToBottom = () => {
  const elementRef = React.useRef();
  React.useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const GroupChat = () => {
  const navigate = useNavigate();
  let { person } = useParams();
  let currentUser = localStorage.getItem("user");

  const [message, setMessage] = React.useState("");
  const [emojiPickerState, SetEmojiPicker] = React.useState(false);

  const { loading, data } = useQuery(RET_GRP_MSGS, {
    variables: { id: person },
    pollInterval: 500,
  });

  const [sendMessage] = useMutation(SEND_GRP_MSG);

  const onSend = async () => {
    if (message !== "") {
      await sendMessage({
        variables: { id: person, sender: currentUser, message: message },
      });
    } else {
      // setState({ open: true, Transition: SlideTransition });
      console.log("message cant be empty");
    }
    setMessage("");
  };

  const [deleteGroup] = useMutation(DELETE_GROUP);

  const onDelete = async () => {
    const response = await deleteGroup({
      variables: { id: person, admin: currentUser },
    });
    if (response) {
      //   setSnackMessage(response.data?.deleteGroup);
      //   setState({ open: true, Transition: SlideTransition });
      console.log("group deleted");
      navigate("/inbox");
    }
  };

  const [groupName, setGroupName] = React.useState("");

  const [editGroupName] = useMutation(EDIT_GNAME);

  const onEdit = async () => {
    if (groupName !== "") {
      await editGroupName({
        variables: { id: person, groupName: groupName },
      });
    }
    setGroupName("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSend();
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!person === "") {
    return (
      <div className="flex items-center justify-center">
        <p>Select a group to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-screen relative px-3 py-1">
      <div className="h-14 flex items-center gap-x-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 ring-2 ring-white text-xl font-medium text-gray-500">
          {data.retrieveGroupMessages.groupName.charAt(0).toUpperCase()}
        </div>
        {data.retrieveGroupMessages.groupName}
      </div>
      <div className="grow h-[82vh] py-4 px-2 rounded-t-2xl overflow-y-auto noscrollbar">
        {data.retrieveGroupMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#BDBDBD]">Start your conversation</p>
          </div>
        ) : (
          <div className="flex flex-col justify-end min-h-full text-sm">
            {data.retrieveGroupMessages.chats.map((index) =>
              index.sender === currentUser ? (
                <div
                  key={index._id}
                  className="py-2 px-3 bg-indigo-100/70 rounded-xl flex self-end m-1 w-max-3/5  break-all"
                >
                  <span>{index.message}</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs self-end">{index.sender}</span>
                  <div
                    key={index._id}
                    className="py-2 px-3 bg-white rounded-xl flex self-start m-1 w-max max-w-[60%] break-all"
                  >
                    <span>{index.message}</span>
                  </div>
                </div>
              ),
            )}
            <AlwaysScollToBottom />
          </div>
        )}
      </div>
      <div className="w-full rounded-b-2xl flex p-3 bg-[#fdfbfb] text-sm justify-center">
        <input
          placeholder="Enter message…"
          autoFocus
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full md:w-[80%] outline-0 h-12 px-3 rounded-l-lg shadow-sm"
        />
        <button
          className="h-12 px-3 rounded-r-lg self-center bg-indigo-600 text-white text-xl font-medium shadow-sm outline-0"
          onClick={onSend}
        >
          <IoSendOutline />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
