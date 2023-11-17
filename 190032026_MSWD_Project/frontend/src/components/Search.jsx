import React from "react";
import { useQuery, gql } from "@apollo/client";
import { IoSearch, IoMenu } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

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

const Search = (props) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = React.useState("");
  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { letter: searchInput },
  });
  let currentUser = localStorage.getItem("user");

  return (
    <div className="bg-white h-full overflow-auto">
      <div className="h-16 shadow-sm border-b border-b-gray-200 text-gray-400 flex items-center">
        <div className="flex items-center gap-x-3 px-8 w-full h-full">
          <IoMenu
            className="text-2xl cursor-pointer lg:hidden block"
            onClick={props.toggle}
          />
          <IoSearch className="text-2xl" />
          <input
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="max-w-xl w-full h-full text-base outline-0 p-2"
          />
        </div>
      </div>
      <div className="p-10">
        {loading ? (
          <div className="flex justify-center">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <>{error.message}</>
        ) : searchInput === "" ? (
          <div className="flex items-center justify-center h-full">
            <p>search for users</p>
          </div>
        ) : data.searchUser.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p>No results found</p>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            {data.searchUser
              .filter((idx) => idx.username !== currentUser)
              .map((person) => (
                <li
                  key={person.username}
                  className="group relative flex justify-between px-6 py-5 overflow-hidden rounded-md shadow-sm cursor-pointer"
                  onClick={() => navigate(`/user/${person.username}`)}
                >
                  <div className="absolute right-0 top-0 h-full p-3 flex items-center justify-center text-indigo-950 font-medium text-xl">
                    <GoArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 ease-linear duration-100" />
                  </div>
                  <div className="flex min-w-0 gap-x-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-50 ring-2 ring-white text-xl font-medium text-gray-500">
                      {person.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900 group-hover:text-indigo-600">
                        {person.username}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {person.email}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">
                      {person.role}
                    </p>
                    {/* {person.lastSeen ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
              </div>
            )} */}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
