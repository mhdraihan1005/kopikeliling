"use client";

import { Toaster, resolveValue, Toast } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster position="top-center">
      {(t: Toast) => {
        const isError = t.type === "error";

        return (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full shadow-xl rounded-r-xl rounded-l-md pointer-events-auto flex overflow-hidden border-l-[8px] ${
              isError
                ? "bg-red-50 border-l-red-600 border-y border-r border-red-200"
                : "bg-[#dcfce7] border-l-[#16a34a] border-y border-r border-green-200"
            }`}
          >
            <div className="p-4 w-full flex items-center gap-5">
              <div className="flex-shrink-0 pl-2">
                {isError ? (
                  // Red X Icon for Error
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                ) : (
                  // Green Check Icon for Success
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
              </div>
              <div className="flex-1 text-center pr-4">
                <p className={`text-[20px] font-extrabold ${isError ? "text-red-700" : "text-[#166534]"}`}>
                  {isError ? "Gagal!" : "Berhasil!"}
                </p>
                <p className={`mt-1 text-[15px] font-medium leading-tight ${isError ? "text-red-600" : "text-[#15803d]"}`}>
                  {resolveValue(t.message, t)}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    </Toaster>
  );
}
