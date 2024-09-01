import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="animate-pulse flex space-x-4">
            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default LoadingSkeleton;
