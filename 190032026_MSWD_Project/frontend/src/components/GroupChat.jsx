import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  IoSendOutline,
  IoInformationCircleOutline,
  IoPersonAdd,
  IoCloseOutline,
} from "react-icons/io5";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";

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

const ADD_PERSONS = gql`
  mutation AddPerosn($id: ID!, $currentUser: String!, $persons: [String!]!) {
    addPerson(id: $id, currentUser: $currentUser, persons: $persons) {
      id
      groupName
      persons
      createdBy
      chats {
        sender
        message
        date
      }
      createdAt
      updatedAt
    }
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

  const [openMenu, setOpenMenu] = React.useState(false);
  const [openModal, setOpenModal] = React.useState({
    check: false,
    item: "",
  });
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
    setOpenModal({
      check: false,
      item: "",
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSend();
    }
  };

  if (loading) {
    return (
      <div class="animate-pulse flex space-x-4 items-center px-2 py-3.5">
        <div class="rounded-full bg-black/10 h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="h-2 bg-black/10 rounded max-w-xs"></div>
        </div>
      </div>
    );
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
      <div className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-x-4 capitalize">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 ring-2 ring-white text-xl font-medium text-gray-500">
            {data.retrieveGroupMessages.groupName.charAt(0).toUpperCase()}
          </div>
          {data.retrieveGroupMessages.groupName}
        </div>
        <div className="relative inline-block">
          <IoInformationCircleOutline
            className="text-2xl text-gray-600 mr-4 cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          />
          {openMenu ? (
            <div className="absolute right-4 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="none">
                <span
                  className="text-gray-600 block px-4 py-2 text-sm cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    setOpenMenu(false);
                    setOpenModal({
                      check: true,
                      item: "edit",
                    });
                  }}
                >
                  Edit Name
                </span>
                <span
                  className="text-gray-600 block px-4 py-2 text-sm cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    setOpenMenu(false);
                    setOpenModal({
                      check: true,
                      item: "members",
                    });
                  }}
                >
                  Add/Remove Members
                </span>
                <span
                  className="text-gray-600 block px-4 py-2 text-sm cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    setOpenMenu(false);
                    setOpenModal({
                      check: true,
                      item: "delete",
                    });
                  }}
                >
                  {data.retrieveGroupMessages.createdBy === currentUser
                    ? "Delete Group"
                    : "Leave Group"}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
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
                  key={index.id}
                  className="py-2 px-3 bg-slate-100/70 rounded-xl flex self-end m-0.5 w-max-3/5  break-all"
                >
                  <span>{index.message}</span>
                </div>
              ) : (
                <div key={index.id}>
                  <span className="text-xs self-end text-gray-500 px-1">
                    {index.sender}
                  </span>
                  <div className="py-2 px-3 bg-white rounded-xl flex self-start m-0.5 w-max max-w-[60%] break-all">
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
          className="h-12 px-3 rounded-r-lg self-center bg-slate-700 text-white text-xl font-medium shadow-sm outline-0"
          onClick={onSend}
        >
          <IoSendOutline />
        </button>
      </div>

      {openModal.check ? (
        <React.Fragment>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {openModal.item === "edit" ? (
                  <React.Fragment>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                          <FiEdit3 className="text-slate-600 text-xl" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="modal-title"
                          >
                            Edit Group Name
                          </h3>
                          <div className="relative mt-2 rounded-md shadow-sm mb-4">
                            <input
                              type="text"
                              value={groupName}
                              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
                              placeholder={data.retrieveGroupMessages.groupName}
                              onChange={(e) => setGroupName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 sm:ml-3 sm:w-auto"
                        onClick={onEdit}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() =>
                          setOpenModal({
                            check: false,
                            item: "",
                          })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </React.Fragment>
                ) : openModal.item === "members" ? (
                  <React.Fragment>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                          <IoPersonAdd className="text-slate-600 text-lg" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                          <h3
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="modal-title"
                          >
                            Edit members
                          </h3>
                          <SearchUsers id={person} groupData={data} />
                          <div>
                            <ul className="divide-y divide-gray-100">
                              {data.retrieveGroupMessages.persons.map(
                                (item) => (
                                  <li
                                    key={item}
                                    className="flex justify-between gap-x-6 py-4"
                                  >
                                    <div className="flex items-center">
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                          {item}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                      <p className="text-xs leading-6 text-gray-900">
                                        {data.retrieveGroupMessages
                                          .createdBy === item ? (
                                          "admin"
                                        ) : (
                                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 cursor-pointer">
                                            Remove
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-6 top-6">
                      <div
                        className="rounded-md bg-slate-950/5 p-1 ring-1 ring-slate-950/10 cursor-pointer flex items-center w-max text-gray-800"
                        onClick={() => {
                          setOpenModal({
                            item: "",
                            check: false,
                          });
                        }}
                      >
                        <AiOutlineClose />
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="modal-title"
                          >
                            {data.retrieveGroupMessages.createdBy ===
                            currentUser
                              ? "Delete group"
                              : "Leave group"}
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want{" "}
                              {data.retrieveGroupMessages.createdBy ===
                              currentUser
                                ? "to delete"
                                : "leave"}{" "}
                              your group? All of your messages will be
                              permanently removed. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={
                          data.retrieveGroupMessages.createdBy === currentUser
                            ? onDelete
                            : () => {}
                        }
                      >
                        {data.retrieveGroupMessages.createdBy === currentUser
                          ? "Delete"
                          : "Leave"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() =>
                          setOpenModal({
                            check: false,
                            item: "",
                          })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GroupChat;

const SearchUsers = (props) => {
  let currentUser = localStorage.getItem("user");
  const [search, setSearch] = React.useState("");
  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { letter: search },
  });

  const [state, setState] = React.useState([]);

  const [addPersons] = useMutation(ADD_PERSONS);

  const handleSelect = (username) => {
    if (!state.includes(username)) {
      setState([...state, username]);
    } else {
      console.log("user already to the chips");
    }
  };
  const handleDelete = (username) => {
    setState((chips) => chips.filter((chip) => chip !== username));
  };

  const handleOk = async () => {
    if (state !== undefined || state !== null) {
      await addPersons({
        variables: {
          id: props.id,
          currentUser: currentUser,
          persons: state,
        },
      }).then(() => {
        console.log("persons added");
        setState([]);
        setSearch("");
      });
    }
  };

  return (
    <div className="w-full">
      <div className="relative mt-2 mb-4 w-full">
        <div className="flex flex-row flex-wrap gap-1">
          {state.length > 0
            ? state.map((item) => (
                <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {item}
                </span>
              ))
            : ""}
        </div>
        <div className="flex flex-row space-x-2 mt-3">
          <input
            type="search"
            value={search}
            className="block w-full py-1.5 px-2 text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:border-b-2 focus:border-slate-600 sm:text-sm sm:leading-6 outline-0"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search to add members"}
          />
          <button
            disabled={!state.length > 0}
            className="bg-slate-600 px-3 text-white text-sm font-medium rounded-md"
            onClick={handleOk}
          >
            Add
          </button>
        </div>
        {loading ? (
          ""
        ) : error ? (
          ""
        ) : search === "" ? (
          ""
        ) : (
          <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data.searchUser
              .filter(
                (index) =>
                  !props.groupData.retrieveGroupMessages.persons.includes(
                    index.username,
                  ),
              )
              .map((item) => (
                <li
                  className={`${
                    state.includes(item.username)
                      ? "text-indigo-600"
                      : "text-gray-900"
                  } relative cursor-default select-none py-2 pl-3 pr-9`}
                  role="option"
                  onClick={() => handleSelect(item.username)}
                >
                  <div className="flex items-center cursor-pointer">
                    <span className="font-normal ml-3 block truncate">
                      {item.username}
                    </span>
                  </div>
                  {state.includes(item.username) ? (
                    <span
                      class="text-indigo-600 absolute inset-y-0 right-0 flex items-center mr-4 cursor-pointer"
                      onClick={() => handleDelete(item.username)}
                    >
                      <IoCloseOutline className="text-indigo-600 text-lg" />
                    </span>
                  ) : (
                    ""
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
