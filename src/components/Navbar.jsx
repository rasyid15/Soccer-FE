import React from "react";
import {MdLogout} from "react-icons/md";

export default function Navbar() {
  return (
    <div className="w-full h-[4.3rem] bg-red-600 flex hover:bg-fixed ">
      <div className="flex items-center ml-7">
        <a
          href="/"
          className={`text-4xl font-bold text-white ${
            window.location.pathname === "/" ? "text-2xl text-gray-800 " : ""
          }`}
        >
          LMSS
        </a>
      </div>
      <div className="flex justify-center flex-grow">
        <div className="flex justify-center gap-5 items-center ml-10">
          <a
            href="/"
            className={`text-lg text-white py-5 text-center hover:text-2xl hover:text-gray-800 transition-all ${
              window.location.pathname === "/" ? "text-2xl text-gray-800 " : ""
            }`}
          >
            Match
          </a>
          <a
            href="/team"
            className={`text-lg text-white py-5 text-center hover:text-2xl hover:text-gray-800 transition-all ${
              window.location.pathname === "/team"
                ? "text-2xl text-gray-800 "
                : ""
            }`}
          >
            Team
          </a>
          <a
            href="/player"
            className={`text-lg text-white py-5 text-center hover:text-2xl hover:text-gray-800 transition-all ${
              window.location.pathname === "/player"
                ? "text-2xl text-gray-800 "
                : ""
            }`}
          >
            Player
          </a>
          <a
            href="/detail"
            className={`text-lg text-white py-5 text-center hover:text-2xl hover:text-gray-800 transition-all ${
              window.location.pathname === "/detail"
                ? "text-2xl text-gray-800 "
                : ""
            }`}
          >
            Detail
          </a>
        </div>
        <div className="flex items-center ml-auto mr-5">
          <a
            href="/login"
            className={`flex items-center text-lg font-bold text-red-600 py-2 px-6 bg-white rounded-lg hover:text-red-800 transition-all ${
              window.location.pathname === "/login"
                ? "text-2xl text-gray-800"
                : ""
            }`}
          >
            Log Out <MdLogout className="ml-1 font-bold"/>
          </a>
        </div>
      </div>
    </div>
  );
}
