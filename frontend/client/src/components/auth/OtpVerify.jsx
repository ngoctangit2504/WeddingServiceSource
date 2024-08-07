import React, { useState } from "react"
import OtpInput from "react-otp-input"
import { Button } from ".."
import { GoDotFill } from "react-icons/go"
import { apiVerifyOtp } from "@/apis/user"
import { useSelector } from "react-redux"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import path from "@/ultils/path"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
const OtpVerify = ({ dispatch, setVariant }) => {
  const [otpNumber, setOtpNumber] = useState("")
  const { selectedUserName } = useSelector((s) => s.user)
  const handleSendOTP = async () => {
    const response = await apiVerifyOtp({
      otpNumber,
      userName: selectedUserName,
    })
    if (response.success) {
      Swal.fire({
        icon: "success",
        text: "Đăng ký thành công. Đi tới đăng nhập",
        title: "Congrats!",
      }).then(() => {
        dispatch(modal({ isShowModal: false, modalContent: null }))
        setVariant && setVariant("LOGIN")
      })
    } else toast.error(response.message)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white p-8 rounded-md flex flex-col items-center justify-center gap-8"
    >
      <h3>Chúng tôi đã gửi mã OTP tới SĐT của bạn. Hãy nhập OTP:</h3>
      <OtpInput
        value={otpNumber}
        onChange={setOtpNumber}
        numInputs={6}
        renderInput={(props) => <input {...props} />}
        inputStyle="h-16 border rounded-md outline-none inline-block otp-item border-emerald-500 text-lg mx-4"
        renderSeparator={
          <span className="text-emerald-500">
            <GoDotFill />
          </span>
        }
      />
      <Button onClick={handleSendOTP}>Xác minh OTP</Button>
    </div>
  )
}

export default withBaseTopping(OtpVerify)
