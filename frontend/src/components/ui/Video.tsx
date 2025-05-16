import React from "react";

const Video = () => {
  return (
    <video
      className="h-full w-full object-cover object-center"
      width="1080"
      height="1920"
      autoPlay
      playsInline
      preload="auto"
      loop
      muted
    >
      <source src="/money-video.mp4" type="video/mp4" />
    </video>
  );
};

export default Video;
