import WithBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import React, { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import CustomSlider from "../common/CustomSlider"

const DetailImages = ({ dispatch, images = [], currentImage }) => {
  const [index, setIndex] = useState(() => currentImage + 1 || 1)
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-overlay-70 rounded-md w-full h-full text-white"
    >
      <div className="flex justify-between items-center p-4">
        <span>{`${index}/${images.length}`}</span>
        <span
          onClick={() =>
            dispatch(modal({ isShowModal: false, modalContent: null }))
          }
          className="text-xl cursor-pointer"
        >
          <AiOutlineClose />
        </span>
      </div>
      <div className="w-full p-4 grid h-full pb-12 grid-rows-6">
        <div className="row-span-6 flex items-center pb-24 px-8">
          <CustomSlider

            currentImage={currentImage}
            setIndex={setIndex}
            slides={images}
            count={1}
          >
            {images.map((el) => (
              <img
                key={el?.image}
                src={el?.image}
                alt="avatar"
                className="h-[450px] object-contain m-auto"
              />
            ))}
          </CustomSlider>
        </div>
      </div>
    </div>
  )
}
export default WithBaseTopping(DetailImages)

