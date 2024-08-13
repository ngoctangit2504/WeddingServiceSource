import React, { useState, useEffect } from "react";

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % images.length // Cycle through all images
            );
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [images.length]);

    return (
        <div className="relative w-main h-96 overflow-hidden rounded-md shadow-lg bg-gray-200 mx-auto">
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${(currentIndex % images.length) * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-main h-96">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-black bg-opacity-50">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full mx-1 ${currentIndex === index ? "bg-white" : "bg-gray-500"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
