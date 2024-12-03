"use client"; // Indicate that this is a client component

import { useState } from "react";

const AnnouncementsClient = ({ initialData } : {
    initialData : any
}) => {
  const [visibleCount, setVisibleCount] = useState(3); // Track visible announcements
  const [data, setData] = useState(initialData); // Initialize with server data

  // Function to load more announcements
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 ">
      {data.slice(0, visibleCount).map((announcement : any) => (
        <div
          key={announcement.id}
          className={`rounded-md p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ${
            new Date(announcement.date) < new Date()
              ? "bg-gray-200" // Past announcements
              : "bg-lamaSkyLight" // Current and future announcements
          }`}
        >
          <div className="flex items-center justify-between ">
            <h2 className="font-medium">{announcement.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {new Intl.DateTimeFormat("en-GB").format(announcement.date)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{announcement.description}</p>
        </div>
      ))}
      {visibleCount < data.length && ( // Show Load More button if there are more announcements
        <button onClick={loadMore} className="text-gray-800">
          Load More...
        </button>
      )}
    </div>
  );
};

export default AnnouncementsClient;