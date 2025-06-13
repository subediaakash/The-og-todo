import React from "react";

function Home() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
    day: "2-digit",
  });
  return <div className="text-white">{formattedDate}</div>;
}

export default Home;
