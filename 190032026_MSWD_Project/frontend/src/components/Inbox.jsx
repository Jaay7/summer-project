import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { IoCheckmarkOutline } from "react-icons/io5";

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

const Inbox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let currentUser = localStorage.getItem("user");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState("All Messages");
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
          <div>
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
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
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
                      ? "text-indigo-600"
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
                    <IoCheckmarkOutline className="text-indigo-600" />
                  )}
                </span>
              </div>
              <div className="py-1" role="none">
                <span
                  className={`${
                    selectedMenu === "Chats"
                      ? "text-indigo-600"
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
                    <IoCheckmarkOutline className="text-indigo-600" />
                  )}
                </span>
              </div>
              <div className="py-1" role="none">
                <span
                  className={`${
                    selectedMenu === "Groups"
                      ? "text-indigo-600"
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
                    <IoCheckmarkOutline className="text-indigo-600" />
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          {loading || loading2 ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : error2 ? (
            <p>{error2.message}</p>
          ) : (
            <div className=" h-[93vh] px-2 overflow-auto scrollbar">
              {selectedMenu !== "Groups" ? (
                data.retrieveChats.length === 0 ? (
                  <>
                    <p>No chats found</p>
                    <p className="text-[#bdbdbd]">
                      Click here to search for people{" "}
                      <Link to="/" className="text-[#aed581]">
                        Search
                      </Link>
                    </p>
                  </>
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
                                  ? "bg-indigo-50 text-indigo-500"
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
                                    ? "text-indigo-600"
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
                  <div className="p-4">
                    <p>No groups found</p>
                    <button className="px-4 py-2 rounded-sm text-white bg-indigo-600 mt-4">
                      Create group
                    </button>
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
                                  ? "bg-indigo-50 text-indigo-500"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {group.groupName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-auto">
                              <p
                                className={`text-sm font-semibold leading-6 ${
                                  location.pathname.split("/")[2] === group.id
                                    ? "text-indigo-600"
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
