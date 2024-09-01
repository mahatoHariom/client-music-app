import Image from "next/image";
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="text-6xl mb-4">
        <Image
          src={"/not-found.png"}
          alt="not found"
          height={300}
          width={400}
        />
      </div>
      <h2 className="text-xl font-semibold">No Data Available</h2>
      <p className="text-gray-500">
        There are no records to display. Please try again later.
      </p>
    </div>
  );
};

export default EmptyState;
