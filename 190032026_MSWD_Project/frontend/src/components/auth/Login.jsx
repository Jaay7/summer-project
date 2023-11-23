import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const USER_LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        name
        username
        email
      }
      token
      refreshToken
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [viewPassword, setViewPassword] = React.useState(false);
  const [LoginUser, { error, loading, data }] = useMutation(USER_LOGIN);

  const onSubmit = async () => {
    await LoginUser({
      variables: { username: username, password: password },
    })
      .then((response) => {
        // console.log(response.data.login.token);
        let token = response.data.login.token;
        let username = response.data.login.user.username;
        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        // setState({
        //   open: true,
        //   Transition: SlideTransition,
        //   message: "Login success!",
        // });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        // setState({
        //   open: true,
        //   Transition: SlideTransition,
        //   message: error.message,
        // });
      });
  };

  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-slate-600 hover:text-slate-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={viewPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 outline-0"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center transition-all duration-75 pr-2 cursor-pointer"
                onClick={() => setViewPassword(!viewPassword)}
              >
                {viewPassword ? <RxEyeOpen /> : <RxEyeClosed />}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!username && !password}
              onClick={onSubmit}
              className="flex w-full justify-center rounded-md bg-slate-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            className="font-semibold leading-6 text-slate-600 hover:text-slate-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
