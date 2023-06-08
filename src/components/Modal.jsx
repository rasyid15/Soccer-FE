import React, { useState } from "react";


export default function Modal({ isVisible, children, onClose }) {
  return isVisible ? (
    <div className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <div className="bg-white rounded-lg">
          <div className="flex justify-end">
            <button
              onClick={() => onClose()}
              className="text-slate-600 hover:text-slate-800 p-2 text-xl place-self-end"
            >
              ❌
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
