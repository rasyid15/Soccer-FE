import React from "react";

function Background() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-screen -z-50">
        <img
          src="/background.jpg"
          alt=""
          className="object-cover w-full h-screen fixed"
        />
        <div className="absolute top-0 left-0 w-full h-screen bg-black opacity-20"></div>
      </div>
    </>
  );
}

export default Background;
