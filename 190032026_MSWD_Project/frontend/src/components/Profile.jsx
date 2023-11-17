import React from "react";
import { useQuery, gql } from "@apollo/client";
import { IoMenu } from "react-icons/io5";

const USER_DATA = gql`
  query UserProfile {
    profile {
      id
      name
      email
      username
    }
  }
`;

const Profile = (props) => {
  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });
  return (
    <div className="p-8">
      <div className="px-4 sm:px-0 flex gap-x-4 items-center">
        <IoMenu
          className="text-2xl cursor-pointer lg:hidden block"
          onClick={props.toggle}
        />
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            User Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details of yours.
          </p>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p>{error.message}</p>
        ) : (
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.profile.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Username
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.profile.username}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.profile.email}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
};

export default Profile;
