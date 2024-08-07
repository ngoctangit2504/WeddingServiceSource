import React, { useEffect, useState } from "react"
import Button from "../common/Button"
import InputForm from "../inputs/InputForm"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { apiSendOTP } from "@/apis/user"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import { toast } from "react-toastify"
import { modal } from "@/redux/appSlice"

const VerifyPhone = ({ navigate, dispatch }) => {
  const { current } = useSelector((s) => s.user)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm()
  useEffect(() => {
    if (current && current?.phoneNumber) {
      reset({ phoneNumber: current.phoneNumber })
    }
  }, [current])
  const handleSendOtp = async () => {
    setIsLoading(true)
    const response = await apiSendOTP({
      phoneNumber: watch("phoneNumber"),
      userName: current?.userName,
    })
    setIsLoading(false)
    if (response.status === "DELIVERED") {
      dispatch(modal({ isShowModal: false, modalContent: null }))
      navigate(`/${path.VERIFY_PHONE}`)
    } else toast.error(response.message)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[500px] bg-white p-4 rounded-md"
    >
      <h3 className="border-b pb-2 text-lg font-bold">Xác minh SĐT:</h3>
      <InputForm
        register={register}
        errors={errors}
        id="phoneNumber"
        placeholder="Nhập SĐT của bạn"
        wrapClassanme="mt-4"
        readOnly
      />
      <Button
        disabled={isLoading}
        onClick={handleSendOtp}
        className="mt-4 mx-auto"
      >
        Gửi OTP
      </Button>
    </div>
  )
}

export default WithBaseTopping(VerifyPhone)
