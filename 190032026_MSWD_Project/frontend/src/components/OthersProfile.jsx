import React, { useCallback } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { IoMenu } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";

const OTHER_USER = gql`
  query OtherUser($username: String!) {
    otherUser(username: $username) {
      name
      username
      id
      email
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

const OthersProfile = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(OTHER_USER, {
    variables: { username: id },
    pollInterval: 500,
  });

  const [openModal, setOpenModal] = React.useState("");
  const [msg, setMsg] = React.useState("");
  let currentUser = localStorage.getItem("user");

  const [sendMessage] = useMutation(SEND_MSG);

  const onSend = async () => {
    if (msg !== "") {
      await sendMessage({
        variables: { sender: currentUser, otherUser: id, message: msg },
      });
      setOpenModal(false);
      navigate(`/inbox/${id}`, {
        state: { chatType: "personal" },
      });
    } else {
      console.log("failed");
    }
    setMsg("");
  };

  const overlay = React.useRef(null);
  const wrapper = React.useRef(null);

  const onClick = React.useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        setOpenModal(false);
      }
    },
    [setOpenModal, overlay, wrapper],
  );

  const onKeyDown = React.useCallback((e) => {
    if (e.key === "Escape") setOpenModal(false);
  });

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

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
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : error ? (
          <p>{error.message}</p>
        ) : (
          <React.Fragment>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.otherUser.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Username
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.otherUser.username}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data.otherUser.email}
                </dd>
              </div>
            </dl>
            <button
              className="bg-slate-600 text-white text-sm font-medium px-3 py-2 rounded-md shadow-md mt-6"
              onClick={() => setOpenModal(true)}
            >
              Send message
            </button>
            {openModal ? (
              <React.Fragment>
                <div
                  ref={overlay}
                  onClick={onClick}
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                ></div>

                <div
                  ref={wrapper}
                  className="fixed inset-0 z-10 w-screen overflow-y-auto"
                >
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <React.Fragment>
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                              <FiEdit3 className="text-slate-600 text-xl" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                              <h3
                                className="text-base font-semibold leading-6 text-gray-900"
                                id="modal-title"
                              >
                                Send message to {data.otherUser.username}
                              </h3>
                              <div className="relative mt-2 rounded-md shadow-sm mb-4 w-full">
                                <input
                                  type="text"
                                  value={msg}
                                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
                                  placeholder={"Hey there!"}
                                  onChange={(e) => setMsg(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 sm:ml-3 sm:w-auto"
                            onClick={onSend}
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpenModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </React.Fragment>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default OthersProfile;
