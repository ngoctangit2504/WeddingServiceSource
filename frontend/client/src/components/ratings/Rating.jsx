import WithBaseTopping from "@/hocs/WithBaseTopping"
import { renderStarFromNumber } from "@/ultils/fn"
import { memo } from "react"
import { Button } from ".."
import path from "@/ultils/path"
import { modal } from "@/redux/appSlice"
import Votebar from "./Votebar"
import { useSelector } from "react-redux"
import ModalVote from "./ModalVote"
import Swal from "sweetalert2"

const Rating = ({
  name,
  pid,
  dispatch,
  navigate,
  averageStarPoint,
  detail = [],
}) => {
  const { current } = useSelector((state) => state.user)
  return (
    <div className="relative border rounded-md mt-6 bg-white p-4">
      <h3 className="text-base font-bold">{`Đánh giá & nhận xét ${name}`}</h3>
      <div className="flex border rounded-md mt-8">
        <div className="flex-auto w-2/5 border-r flex flex-col gap-1 items-center justify-center">
          <span className="text-[24px] font-bold">{`${
            Math.round(averageStarPoint * 10) / 10
          }/5`}</span>
          <span className="flex items-center">
            {renderStarFromNumber(averageStarPoint)?.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </span>
          <span className="text-base text-gray-600">{`${detail.length} lượt đánh giá và nhận xét`}</span>
        </div>
        <div className="flex-auto w-3/5 p-[10px]">
          {[...Array(5).keys()].map((item) => (
            <Votebar
              key={item}
              star={5 - item}
              voter={detail?.find((i) => +i.starPoint === 5 - item)?.count}
              percent={Math.round(
                (detail?.find((i) => +i.starPoint === 5 - item)?.count * 100) /
                  detail?.reduce((sum, n) => sum + n.count, 0)
              )}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center items-center text-main-500 gap-2 flex-col mt-4">
        <span>Bạn đánh giá sao sản phẩm này</span>
        <Button
          onClick={() => {
            if (
              current &&
              current?.roles?.some((el) => el.name === "ROLE_CUSTOMER")
            ) {
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: <ModalVote pid={pid} />,
                })
              )
            } else {
              Swal.fire(
                "Oops!",
                "Hãy đăng nhập tài khoản tìm kiếm để đánh giá~",
                "info"
              ).then(() => {
                navigate("/" + path.LOGIN)
              })
            }
          }}
        >
          Đánh giá ngay
        </Button>
      </div>
      {/* {votes?.map((item) => (
        <div key={item.id} className="flex gap-2 flex-col mt-4">
          <div className="flex gap-2">
            <span className="font-bold">{item?.userData?.name}</span>
          </div>
          <div className="ml-[28px] p-4 gap-2 flex flex-col bg-gray-100 rounded-md text-sm">
            <span className="font-semibold flex gap-2">
              <span>Đánh giá: </span>
              <span className="flex items-center">
                {renderStarFromNumber(item.score)?.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </span>
            </span>
            <span className="font-semibold flex gap-2">
              <span>Nhận xét:</span>
              <span>{item.content || "Chưa có nhận xét"}</span>
            </span>
          </div>
        </div>
      ))} */}
    </div>
  )
}

export default WithBaseTopping(memo(Rating))
