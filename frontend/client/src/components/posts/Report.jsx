import React from "react"
import { Button, InputForm } from ".."
import { useForm } from "react-hook-form"
import { modal } from "@/redux/appSlice"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { apiAddReport } from "@/apis/report"
import { toast } from "react-toastify"

const Report = ({ dispatch, id }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const handleSendReport = async (data) => {
    const response = await apiAddReport({ ...data, idOfPost: id })
    if (response.success) {
      toast.success(response.message)
      dispatch(modal({ isShowModal: false, modalContent: null }))
    } else toast.error(response.message)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-md w-[500px]"
    >
      <h1 className="p-4 border-b text-2xl text-center font-semibold">
        Vui lòng điền thông tin
      </h1>
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Bạn hãy mô tả thêm thông tin"
            id="content"
            rows="5"
            className="form-textarea w-full"
            {...register("content", { required: "Không thể bỏ trống." })}
          ></textarea>
          {errors["content"] && (
            <small className="text-xs text-red-500">
              {errors["content"]?.message}
            </small>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">
            Điền thông tin để chúng tôi liên lạc với bạn khi cần thiết
          </h3>
          <InputForm
            register={register}
            id="name"
            errors={errors}
            placeholder="Tên của bạn"
            validate={{ required: "Không thể bỏ trống." }}

          />
          <InputForm
            register={register}
            id="phoneNumber"
            errors={errors}
            placeholder="Phone number"
            validate={{ required: "Không thể bỏ trống." }}

          />
        </div>
        <div className="flex gap-4 items-center justify-end">
          <Button
            onClick={() =>
              dispatch(modal({ isShowModal: false, modalContent: null }))
            }
            className="bg-red-700"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit(handleSendReport)}>Gửi báo cáo</Button>
        </div>
      </div>
    </div>
  )
}
export default WithBaseTopping(Report)
