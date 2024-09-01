import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full border border-slate-200 mt-4">
      <div className="border-b border-slate-200 bg-slate-100 p-4 flex gap-5">
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
        <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
      </div>
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex border-b border-slate-200 p-4 gap-5"
            >
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
              <div className="flex-1 p-4 bg-gray-200 rounded h-4 w-1/6"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
