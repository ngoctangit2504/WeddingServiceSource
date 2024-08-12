import React from "react"
import { Button, InputForm } from ".."
import { useForm } from "react-hook-form"
import { modal } from "@/redux/appSlice"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { apiAddReport } from "@/apis/report"
import { toast } from "react-toastify"
import { apiCreateNewBooking } from "@/apis/service"

const Booking = ({ dispatch, id }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()
    const handleSendReport = async (data) => {
        const requestBody = {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            notes: data.content,
            serviceId: id
        }
        const response = await apiCreateNewBooking(requestBody);
        if (response.success) {
            toast.success(response.message)
            dispatch(modal({ isShowModal: false, modalContent: null }))
        } else toast.error("Có lỗi hãy thử lại sau")
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
                    <InputForm
                        register={register}
                        errors={errors}
                        id="name"
                        validate={{
                            required: "Trường này không được bỏ trống."
                        }}
                        placeholder="Tên"
                        fullWidth
                    />
                    <InputForm
                        register={register}
                        errors={errors}
                        id="email"
                        validate={{
                            required: "Trường này không được bỏ trống."
                        }}
                        placeholder="E-mail"
                        fullWidth
                    />
                    <InputForm
                        register={register}
                        errors={errors}
                        id="phoneNumber"
                        validate={{
                            required: "Trường này không được bỏ trống."
                        }}
                        placeholder="Điện thoại"
                        fullWidth
                    />
                    <textarea
                        placeholder="Bạn hãy mô tả thêm ghi chú"
                        id="content"
                        rows="5"
                        className="form-textarea w-full rounded-md border-gray-200"
                        {...register("content", { required: "Không thể bỏ trống." })}
                    ></textarea>
                    {errors["content"] && (
                        <small className="text-xs text-red-500">
                            {errors["content"]?.message}
                        </small>
                    )}
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
                    <Button onClick={handleSubmit(handleSendReport)}>Gửi báo giá</Button>
                </div>
            </div>
        </div>
    )
}
export default WithBaseTopping(Booking)
