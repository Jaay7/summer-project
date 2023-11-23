import React from "react";
import {
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
];

const Header = (props) => {
  let location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`fixed h-full z-50 lg:relative w-full lg:col-span-2 text-white  lg:flex flex-col ${
        props.isOpen ? "flex bg-gray-500/70 transition-opacity" : "hidden"
      }`}
    >
      <div className="w-[300px] py-8 px-4 flex flex-col bg-slate-700 h-full lg:w-full shadow-xl relative">
        <h1 className="self-center text-2xl font-semibold capitalize">
          bericht
        </h1>
        <div className="mt-8 flex flex-col space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                location.pathname === item.href
                  ? "bg-slate-900/20 text-white"
                  : "text-gray-300 hover:bg-slate-900/10 hover:text-white",
                "rounded-md px-3 py-2 text-sm font-medium flex items-center gap-x-3",
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <div
            className="text-gray-300 hover:bg-slate-900/10 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center gap-x-3 cursor-pointer"
            onClick={onLogout}
          >
            <span className="text-2xl">
              <HiLogout />
            </span>
            Logout
          </div>
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
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === undefined ||
    localStorage.getItem("token") === ""
  ) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="grid grid-cols-1 lg:mx-0 lg:grid-cols-10 h-screen">
      <Header isOpen={props.isOpen} toggle={props.toggle} />
      <div className="col-span-8 h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
