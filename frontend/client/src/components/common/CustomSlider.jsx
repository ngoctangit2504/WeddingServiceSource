import React, { memo } from "react"
import Carousel from "nuka-carousel"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"
const CustomSlider = ({
  count = 4,
  children,
  className,
  setIndex,
  slides = [],
  currentImage = 0,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "w-full flex bg-transparent flex-col rounded-tl-md rounded-tr-md",
          className
        )
      )}
    >
      <Carousel
        className="w-full"
        slidesToShow={count}
        slidesToScroll={1}
        cellSpacing={16}
        slideIndex={currentImage}
        afterSlide={(index) => setIndex(index)}
        renderCenterLeftControls={({ previousSlide, previousDisabled }) => (
          <button
            className={twMerge(
              clsx(
                "p-2 bg-gray-700 border -ml-4 shadow-md rounded-full",
                previousDisabled && "cursor-default opacity-20"
              )
            )}
            onClick={previousSlide}
          >
            <FiChevronLeft size={20} />
          </button>
        )}
        renderCenterRightControls={({ nextSlide, nextDisabled }) => (
          <button
            className={twMerge(
              clsx(
                "p-2 bg-gray-700 shadow-md -mr-4  border rounded-full",
                nextDisabled && "cursor-default opacity-20"
              )
            )}
            onClick={nextSlide}
          >
            <FiChevronRight size={20} />
          </button>
        )}
        wrapAround={false}
        renderBottomCenterControls={({ currentSlide, goToSlide }) => (
          <div className="absolute left-0 right-0 h-[100px] bottom-[-250px] flex justify-center items-center">
            <div className="flex justify-center items-center h-full gap-[2px]">
              {slides?.map((el, idx) => (
                <img
                  onClick={() => goToSlide(idx)}
                  key={el?.image}
                  src={el?.image}
                  alt="avatar"
                  className={twMerge(
                    clsx(
                      "h-full object-contain m-auto cursor-pointer",
                      currentSlide === idx &&
                      "border-4 ring-4 border-emerald-700"
                    )
                  )}
                />
              ))}
            </div>
          </div>
        )}
      >
        {children}
      </Carousel>
    </div>
  )
}
export default memo(CustomSlider)
