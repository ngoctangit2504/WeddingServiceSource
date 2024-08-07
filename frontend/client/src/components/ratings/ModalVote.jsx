import WithBaseTopping from "@/hocs/WithBaseTopping"
import { Button } from ".."
import { AiFillStar } from "react-icons/ai"
import { modal } from "@/redux/appSlice"
import { apiRatings } from "@/apis/rating"
import { memo, useState } from "react"
import { toast } from "react-toastify"

const votes = [
  { txt: "Rất tệ", star: 1 },
  { txt: "Tệ", star: 2 },
  { txt: "Bình thường", star: 3 },
  { txt: "Tốt", star: 4 },
  { txt: "Rất tốt", star: 5 },
]
const ModalVote = ({ pid, dispatch }) => {
  const [payload, setPayload] = useState({
    txt: "",
    star: null,
  })
  const handleSubmit = async () => {
    const data = {
      postId: pid,
      starPoint: payload.star,
    }
    const response = await apiRatings(data)
    if (response.success) {
      toast.success(response.message)
      setPayload({
        txt: "",
        star: null,
      })
    } else toast.info(response.message)
    dispatch(modal({ isShowModal: false, modalContent: null }))
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-8 bg-white rounded-md min-w-[600px]"
    >
      <div className="flex flex-col gap-4 mt-2">
        <span className="font-bold">Bạn thấy tin đăng này như thế nào</span>
        <div className="w-full flex justify-between items-center">
          {votes.map((item, index) => (
            <span
              key={item.star}
              className="flex flex-col flex-1 py-4 gap-2 justify-center rounded-lg cursor-pointer items-center hover:bg-gray-200"
              onClick={() =>
                setPayload((prev) => ({ ...prev, star: item.star }))
              }
            >
              {payload.star < index + 1 ? (
                <AiFillStar size={18} />
              ) : (
                <AiFillStar size={18} color="#f59e0b" />
              )}
              <span>{item.txt}</span>
            </span>
          ))}
        </div>
      </div>
      <Button className="mt-6 mx-auto" onClick={handleSubmit}>
        Gửi đánh giá
      </Button>
    </div>
  )
}

export default WithBaseTopping(memo(ModalVote))
