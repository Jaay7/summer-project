import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { IoMenu } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NotificationBox from "./utils/NotificationBox";

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

const EDIT_NAME = gql`
  mutation EditName($username: String!, $newName: String!) {
    editName(username: $username, newName: $newName) {
      id
      email
      name
      username
    }
  }
`;

const EDIT_EMAIL = gql`
  mutation EditEmail($username: String!, $newEmail: String!) {
    editEmail(username: $username, newEmail: $newEmail) {
      id
      email
      name
      username
    }
  }
`;

const Profile = (props) => {
  let currentUser = localStorage.getItem("user");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const { loading, error, data } = useQuery(USER_DATA, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const [notification, setNotification] = React.useState({
    open: false,
    for: "",
    title: "",
    description: "",
  });

  const [editDetails, setEditDetails] = React.useState(false);
  const [editName, { loading: nameLoading }] = useMutation(EDIT_NAME);
  const [editEmail, { loading: emailLoading }] = useMutation(EDIT_EMAIL);

  const onClickEdit = async () => {
    if (name !== "") {
      await editName({
        variables: { username: currentUser, newName: name },
      }).then(() => {
        setName("");
        setNotification({
          open: true,
          for: "success",
          title: "Details updated successful!",
          description: "",
        });
        setEditDetails(false);
      });
    }
    if (email !== "") {
      await editEmail({
        variables: { username: currentUser, newEmail: email },
      }).then(() => {
        setEmail("");
        setNotification({
          open: true,
          for: "success",
          title: "Details updated successful!",
          description: "",
        });
        setEditDetails(false);
      });
    }
  };

  React.useEffect(() => {
    if (notification.open) {
      setTimeout(() => {
        setNotification({
          open: false,
          for: "",
          title: "",
          description: "",
        });
      }, 2500);
    }
  }, [notification]);

  return (
    <div className="p-8">
      <div className="px-4 sm:px-0 flex gap-x-4 items-center">
        <IoMenu
          className="text-2xl cursor-pointer lg:hidden block"
          onClick={props.toggle}
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            User Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details of yours.
          </p>
        </div>
        <div className="px-4 py-3 ">
          {editDetails ? (
            <div className="sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 sm:ml-3 sm:w-auto"
                disabled={name === "" && email === ""}
                onClick={onClickEdit}
              >
                {nameLoading || emailLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setEditDetails(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-slate-600 text-white text-sm font-medium px-3 py-2 rounded-md shadow-md"
              onClick={() => setEditDetails(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
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
                {editDetails ? (
                  <div className="relative rounded-md shadow-sm w-full max-w-xs">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
                      placeholder={data.profile.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                ) : (
                  <p>{data.profile.name}</p>
                )}
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
                {editDetails ? (
                  <div className="relative rounded-md shadow-sm w-full max-w-xs">
                    <input
                      type="email"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
                      placeholder={data.profile.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <p>{data.profile.email}</p>
                )}
              </dd>
            </div>
          </dl>
        )}
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default Profile;
