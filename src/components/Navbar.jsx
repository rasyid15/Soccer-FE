import React from "react";

export default function Navbar() {
  return (
    <div className="h-[4.3rem] bg-red-600 flex hover:bg-fixed ">
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
        <div className="flex justify-center gap-5 items-center">
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
      </div>
    </div>
  );
}
