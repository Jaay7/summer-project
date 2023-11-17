import React from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoSettingsOutline,
  IoPersonCircleOutline,
  IoClose,
} from "react-icons/io5";
import { HiOutlineInbox, HiLogout } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Home", href: "/", icon: <IoHomeOutline /> },
  { name: "Inbox", href: "/inbox", icon: <HiOutlineInbox /> },
  { name: "Settings", href: "/settings", icon: <IoSettingsOutline /> },
  { name: "Profile", href: "/profile", icon: <IoPersonCircleOutline /> },
  { name: "Logout", href: "#", icon: <HiLogout /> },
];

const Header = (props) => {
  let location = useLocation();

  return (
    <div
      className={`fixed h-full z-50 lg:relative w-full lg:col-span-2 text-white bg-indigo-600 lg:flex flex-col ${
        props.isOpen ? "flex bg-gray-500/70 transition-opacity" : "hidden"
      }`}
    >
      <div className="w-[300px] py-8 px-4 flex flex-col bg-indigo-600 h-full lg:w-full shadow-xl relative">
        <h1 className="self-center text-2xl font-semibold">bericht</h1>
        <div className="mt-12 flex flex-col space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                location.pathname === item.href
                  ? "bg-gray-900/20 text-white"
                  : "text-gray-300 hover:bg-gray-900/10 hover:text-white",
                "rounded-md px-3 py-2 text-sm font-semibold flex items-center gap-x-3",
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
        <div
          className={`absolute z-50 -right-10 top-0 flex pt-4 pr-4 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${
            props.isOpen ? "lg:hidden" : "hidden"
          }`}
        >
          <IoClose className="text-2xl" onClick={props.toggle} />
        </div>
      </div>
    </div>
  );
};

const Dashboard = (props) => {
  return (
    <div className="grid grid-cols-1 lg:mx-0 lg:grid-cols-10 h-screen">
      <Header isOpen={props.isOpen} toggle={props.toggle} />
      <div className="col-span-8 h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
