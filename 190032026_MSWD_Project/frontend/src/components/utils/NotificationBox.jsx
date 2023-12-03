import React from "react";
import { VscError, VscPass, VscChromeClose } from "react-icons/vsc";

const NotificationBox = ({ notification }) => {
  return (
    <React.Fragment>
      {notification.open ? (
        <div
          className={`z-50 flex items-center fixed top-5 right-5 shadow-md rounded-lg bg-white border border-gray-200 w-64 md:w-80 lg:w-96 p-3 gap-x-3 ${
            notification.open ? "animate-notification" : ""
          }`}
        >
          {notification.for === "success" ? (
            <VscPass className="text-green-500 text-xl" />
          ) : (
            <VscError className="text-red-500 text-xl" />
          )}
          <div className="overflow-hidden flex-1">
            <p className="text-base font-medium text-gray-950">
              {notification.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {notification.description}
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default NotificationBox;
