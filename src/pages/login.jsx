import React, {useState, useEffect} from "react";
import axios from "axios";

function Login() {
    const [password, setPassword] = useState();

    useEffect(() => {

    },)
    
  return (
    <div className="w-full">
      <div className="flex justify-center items-center">
        <div className="w-1/3 bg-gray-200 mt-32">
          <form
            className=" bg-gray-100 shadow-md rounded px-8 pt-6 p-8 m-12 mt-30"
            onSubmit={(e) => this.handleLogin(e)}
          >
            <p className="text-gray-700 text-2xl font-bold mb-8 text-center">
              Login
            </p>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                placeholder="Username"
                value={""}
                onChange={""}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={""}
                onChange={""}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
