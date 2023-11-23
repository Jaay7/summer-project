import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client";
import { IoSendOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RET_MSGS = gql`
  query RetrieveMessages($currentUser: String!, $otherUser: String!) {
    retrieveMessages(currentUser: $currentUser, otherUser: $otherUser) {
      id
      persons
      chats {
        sender
        message
        date
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

const AlwaysScollToBottom = () => {
  const elementRef = React.useRef();
  React.useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const PersonalChat = () => {
  let { person } = useParams();
  let currentUser = localStorage.getItem("user");

  const [message, setMessage] = React.useState("");
  const [emojiPickerState, SetEmojiPicker] = React.useState(false);

  const { loading, error, data } = useQuery(RET_MSGS, {
    variables: { currentUser: currentUser, otherUser: person },
    pollInterval: 500,
  });

  const [sendMessage] = useMutation(SEND_MSG);

  const onSend = async () => {
    if (message !== "") {
      await sendMessage({
        variables: {
          sender: currentUser,
          otherUser: person,
          message: message,
        },
      });
    } else {
      // setState({ open: true, Transition: SlideTransition });
      console.log("message cant be empty");
    }
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSend();
    }
  };

  if (!person === "") {
    return (
      <div className="flex items-center justify-center">
        <p>Select a person to start messaging</p>
      </div>
    );
  }

  const dateConverter = (unixDate) => {
    // console.log(unixDate);
    // let date = new Date(unixDate);
    // console.log(date.toISOString());
    return unixDate;
  };

  return (
    <div className="h-screen relative px-3 py-1">
      <div className="h-14 flex items-center gap-x-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 ring-2 ring-white text-xl font-medium text-gray-500">
          {person.charAt(0).toUpperCase()}
        </div>
        {person}
      </div>
      <div className="grow h-[82vh] py-4 px-2 rounded-t-2xl overflow-y-auto noscrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : data.retrieveMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#BDBDBD]">Start your conversation</p>
          </div>
        ) : (
          <div className="flex flex-col justify-end min-h-full text-sm">
            {data.retrieveMessages.chats.map((index) =>
              index.sender === currentUser ? (
                <div
                  key={index._id}
                  className="py-2 px-3 bg-slate-100/70 rounded-xl flex self-end m-1 w-max-3/5 relative break-all"
                >
                  <span>{index.message}</span>
                  <span className="absolute -left-14 w-12 top-3 truncate text-xs text-gray-500 font-medium">
                    {dateConverter(index.date)}
                  </span>
                </div>
              ) : (
                <div
                  key={index._id}
                  className="py-2 px-3 bg-white rounded-xl flex self-start m-1 w-max max-w-[60%] relative break-all"
                >
                  <span>{index.message}</span>
                  <span className="absolute -right-14 w-12 top-3 truncate text-xs text-gray-500 font-medium">
                    {dateConverter(index.date)}
                  </span>
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
          className="h-12 px-3 rounded-r-lg self-center bg-slate-700 text-white text-xl font-medium shadow-sm outline-0"
          onClick={onSend}
        >
          <IoSendOutline />
        </button>
      </div>
    </div>
  );
};

export default PersonalChat;
