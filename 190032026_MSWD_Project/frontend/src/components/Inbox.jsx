import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IoCheckmarkOutline,
  IoCloseOutline,
  IoMenu,
  IoPersonAdd,
} from "react-icons/io5";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";

const ALL_CHATS = gql`
  query RetrieveChats($currentUser: String!) {
    retrieveChats(currentUser: $currentUser) {
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

const ALL_GROUPS = gql`
  query RetrieveGroups($currentUser: String!) {
    retrieveGroups(currentUser: $currentUser) {
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

const CREATE_GROUP = gql`
  mutation CreateGroup(
    $groupName: String
    $createdBy: String!
    $persons: [String!]!
  ) {
    createGroup(
      groupName: $groupName
      createdBy: $createdBy
      persons: $persons
    ) {
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

const Inbox = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let currentUser = localStorage.getItem("user");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState("All Messages");
  const [openModal, setOpenModal] = React.useState("");

  const { loading, error, data } = useQuery(ALL_CHATS, {
    variables: { currentUser: currentUser },
    pollInterval: 500,
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(ALL_GROUPS, {
    variables: { currentUser: currentUser },
    pollInterval: 500,
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      <div className="">
        <div className="relative inline-block text-left">
          <div className="flex items-center">
            <IoMenu
              className="text-2xl cursor-pointer lg:hidden block mt-2 ml-2"
              onClick={props.toggle}
            />
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 ml-2 mt-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {selectedMenu}
              <svg
                className="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {openMenu && (
            <div className="absolute left-2 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="none">
                <span
                  className={`${
                    selectedMenu === "All Messages"
                      ? "text-orange-600"
                      : "text-gray-700"
                  } px-4 py-2 text-sm cursor-pointer flex items-center justify-between`}
                  id="menu-item-0"
                  onClick={() => {
                    setSelectedMenu("All Messages");
                    setOpenMenu(false);
                  }}
                >
                  All Messages
                  {selectedMenu === "All Messages" && (
                    <IoCheckmarkOutline className="text-orange-600" />
                  )}
                </span>
              </div>
              <div className="py-1" role="none">
                <span
                  className={`${
                    selectedMenu === "Chats"
                      ? "text-orange-600"
                      : "text-gray-700"
                  } px-4 py-2 text-sm cursor-pointer flex items-center justify-between`}
                  id="menu-item-1"
                  onClick={() => {
                    setSelectedMenu("Chats");
                    setOpenMenu(false);
                  }}
                >
                  Chats
                  {selectedMenu === "Chats" && (
                    <IoCheckmarkOutline className="text-orange-600" />
                  )}
                </span>
              </div>
              <div className="py-1" role="none">
                <span
                  className={`${
                    selectedMenu === "Groups"
                      ? "text-orange-600"
                      : "text-gray-700"
                  } px-4 py-2 text-sm cursor-pointer flex items-center justify-between`}
                  id="menu-item-2"
                  onClick={() => {
                    setSelectedMenu("Groups");
                    setOpenMenu(false);
                  }}
                >
                  Groups
                  {selectedMenu === "Groups" && (
                    <IoCheckmarkOutline className="text-orange-600" />
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          {loading || loading2 ? (
            <React.Fragment>
              <div class="animate-pulse flex space-x-4 px-2 py-3.5">
                <div class="rounded-full bg-black/10 h-12 w-12"></div>
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 bg-black/10 rounded"></div>
                  <div class="space-y-3">
                    <div class="h-2 bg-black/10 rounded"></div>
                  </div>
                </div>
              </div>
              <div class="animate-pulse flex space-x-4 px-2 py-3.5">
                <div class="rounded-full bg-black/10 h-12 w-12"></div>
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 bg-black/10 rounded"></div>
                  <div class="space-y-3">
                    <div class="h-2 bg-black/10 rounded"></div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : error ? (
            <p>{error.message}</p>
          ) : error2 ? (
            <p>{error2.message}</p>
          ) : (
            <div className=" h-[93vh] px-2 overflow-auto scrollbar divide-y divide-gray-100">
              {selectedMenu !== "Groups" ? (
                data.retrieveChats.length === 0 ? (
                  <div className="px-3 mt-3 text-sm flex gap-x-2 flex-wrap">
                    <p>No chats found,</p>
                    <p className="text-gray-500">
                      Navigate to{" "}
                      <Link to="/" className="text-slate-600 font-semibold">
                        Search
                      </Link>
                    </p>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-100">
                    {data.retrieveChats.map((chat) => {
                      let personName =
                        chat.persons[0] === currentUser
                          ? chat.persons[1]
                          : chat.persons[0];
                      return (
                        <li
                          key={chat.id}
                          className="flex justify-between gap-x-6 py-3.5 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/inbox/${
                                chat.persons[0] === currentUser
                                  ? chat.persons[1]
                                  : chat.persons[0]
                              }`,
                              {
                                state: { chatType: "personal" },
                              },
                            )
                          }
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <div
                              className={`h-12 w-12 flex items-center justify-center rounded-full ring-2 ring-white text-xl font-medium ${
                                location.pathname.split("/")[2] === personName
                                  ? "bg-orange-50 text-orange-500"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {chat.persons[0] === currentUser
                                ? chat.persons[1].charAt(0).toUpperCase()
                                : chat.persons[0].charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-auto">
                              <p
                                className={`text-sm font-semibold leading-6 ${
                                  location.pathname.split("/")[2] === personName
                                    ? "text-orange-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {chat.persons[0] === currentUser
                                  ? chat.persons[1]
                                  : chat.persons[0]}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                <b>
                                  {chat.persons[0] === currentUser
                                    ? "You: "
                                    : ""}
                                </b>{" "}
                                {chat.chats.slice(-1)[0].message}
                              </p>
                            </div>
                          </div>
                          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">
                              {chat.role}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : (
                ""
              )}
              {selectedMenu !== "Chats" ? (
                data2.retrieveGroups.length === 0 ? (
                  <div className="px-3 mt-6 text-sm flex gap-x-2 flex-wrap">
                    <p>No groups found,</p>
                    <button
                      className="text-slate-600 font-semibold outline-none"
                      onClick={() => setOpenModal(true)}
                    >
                      Create group
                    </button>
                    {openModal ? (
                      <SearchUsers setOpenModal={() => setOpenModal(false)} />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-100">
                    {data2.retrieveGroups.map((group) => {
                      return (
                        <li
                          key={group.id}
                          className="flex justify-between gap-x-6 py-3.5 cursor-pointer"
                          onClick={() =>
                            navigate(`/inbox/${group.id}`, {
                              state: { chatType: "group" },
                            })
                          }
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <div
                              className={`h-12 w-12 flex items-center justify-center rounded-full ring-2 ring-white text-xl font-medium ${
                                location.pathname.split("/")[2] === group.id
                                  ? "bg-orange-50 text-orange-500"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {group.groupName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-auto">
                              <p
                                className={`text-sm font-semibold leading-6 ${
                                  location.pathname.split("/")[2] === group.id
                                    ? "text-orange-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {group.groupName}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {group.chats.length === 0 ? (
                                  "Start your conversation"
                                ) : (
                                  <span>
                                    <b>{group.chats.slice(-1)[0].sender}</b>
                                    {": "}
                                    {group.chats.slice(-1)[0].message}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            {/* <p className="text-sm leading-6 text-gray-900">
                              {chat.role}
                            </p> */}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      <div className="h-screen col-span-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Inbox;

const SearchUsers = (props) => {
  let currentUser = localStorage.getItem("user");
  const [groupName, setGroupName] = React.useState("");
  const [search, setSearch] = React.useState("");
  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { letter: search },
  });

  const [state, setState] = React.useState([]);

  const [createGroup] = useMutation(CREATE_GROUP);

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
    if (state !== undefined || state !== null || groupName.length > 0) {
      await createGroup({
        variables: {
          groupName: groupName,
          createdBy: currentUser,
          persons: state,
        },
      }).then(() => {
        console.log("group created");
        setState([]);
        setSearch("");
        // close modal
        props.setOpenModal();
      });
    }
  };

  return (
    <React.Fragment>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <React.Fragment>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                    <IoPersonAdd className="text-slate-600 text-lg" />
                  </div>
                  <div className="mt-3 text-center h-96 sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Add group
                    </h3>
                    <input
                      type="text"
                      value={groupName}
                      className="block w-full py-1.5 px-2 text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:border-b-2 focus:border-slate-600 sm:text-sm sm:leading-6 outline-0"
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder={"Group name"}
                    />
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
                              .filter((index) => index.username !== currentUser)
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
                                      onClick={() =>
                                        handleDelete(item.username)
                                      }
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
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 sm:ml-3 sm:w-auto"
                  onClick={handleOk}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => props.setOpenModal()}
                >
                  Cancel
                </button>
              </div>
            </React.Fragment>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
