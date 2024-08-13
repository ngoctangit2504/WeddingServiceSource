import React from "react";

const VideoPlayer = ({ videoSrc, title }) => {
    return (
        <div 
            className="flex flex-col items-center justify-center bg-neutral-900 rounded-md shadow-lg overflow-hidden"
            style={{ width: '904px', height: '508px' }} // Set fixed dimensions
        >
            <div className="relative w-full h-full">
                <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-t-md"
                    src={videoSrc}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <h3
                className="text-white text-2xl font-extrabold p-2 w-full text-center rounded-b-md shadow-lg tracking-wide"
                style={{ background: 'linear-gradient(216.54deg, #f800b6 0%, #ef007f 100%)' }}
            >
                {title}
            </h3>
        </div>
    );
};

export default VideoPlayer;
