import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, Outlet } from "react-router-dom";

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
  let currentUser = localStorage.getItem("user");
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
      <div className="p-3">
        All Chats
        <div>
          {loading || loading2 ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : error2 ? (
            <p>{error2.message}</p>
          ) : (
            <div>
              {data.retrieveChats.length === 0 ? (
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
                <ul
                  role="list"
                  className="divide-y divide-gray-50 h-max overflow-auto"
                >
                  {data.retrieveChats.map((chat) => (
                    <li
                      key={chat.id}
                      className="flex justify-between gap-x-6 py-5"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-50 ring-2 ring-white text-xl font-medium text-gray-500">
                          {chat.persons[0] === currentUser
                            ? chat.persons[1].charAt(0).toUpperCase()
                            : chat.persons[0].charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {chat.persons[0] === currentUser
                              ? chat.persons[1]
                              : chat.persons[0]}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            <b>
                              {chat.persons[0] === currentUser ? "You: " : ""}
                            </b>{" "}
                            {chat.chats.slice(-1)[0].message}
                          </p>
                        </div>
                      </div>
                      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-gray-900">
                          {chat.role}
                        </p>
                        {/* {chat.lastSeen ? (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Last seen{" "}
                            <time dateTime={chat.lastSeenDateTime}>
                              {chat.lastSeen}
                            </time>
                          </p>
                        ) : (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 text-gray-500">
                              Online
                            </p>
                          </div>
                        )} */}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="overflow-hidden col-span-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Inbox;
