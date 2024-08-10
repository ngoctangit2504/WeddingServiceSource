import { apiPayment } from "@/apis/payment"
import { Button, InputForm, Title } from "@/components"
import path from "@/ultils/path"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineArrowRight } from "react-icons/ai"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const Card = ({ logo, text, setTitle, setMethod, id }) => {
  return (
    <div
      onClick={() => {
        setTitle(`Nạp tiền từ ${text}`)
        setMethod(id)
      }}
      className="w-full border flex flex-col justify-between rounded-md"
    >
      <div className="flex justify-center items-center flex-auto bg-white h-full">
        <div className="w-24">{logo}</div>
      </div>
      <span className="text-center flex-none text-emerald-700 block w-full bg-gray-300 p-3 font-semibold hover:underline cursor-pointer">
        {text}
      </span>
    </div>
  )
}

const Deposit = () => {
  const { current } = useSelector((s) => s.user)
  const [title, setTitle] = useState()
  const [method, setMethod] = useState()


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const handleDeposit = async (data) => {
    if (method === "VNPAY") {
      data.paymentContent = "Nạp Tiền Vào Tài Khoản"
      data.paymentDestinationId = "VNPAY"
    }
    const response = await apiPayment(data)
    if (response.success) {
      window.open(response.data?.paymentUrl, "_self")
    } else toast.error(response.message)
  }
  return (
    <div>
      <Title title={title || "Nạp tiền vào tài khoản"} />
      <div className="p-4">
        {!title && (
          <h3 className="text-lg">Mời bạn chọn phương thức nạp tiền:</h3>
        )}
        <div className="grid grid-cols-10 gap-4">
          {!title && (
            <div className="col-span-7 grid grid-cols-3 gap-4 mt-6">
              <Card
                text="VNPAY"
                id="VNPAY"
                logo={
                  <img
                    src="/logo.png"
                    alt=""
                    className="w-full object-contain"
                  />
                }
                setTitle={setTitle}
                setMethod={setMethod}
              />
              <Card
                text="Momo"
                id="MOMO"
                logo={
                  <img
                    src="/momo.png"
                    alt=""
                    className="w-full object-contain"
                  />
                }
                setMethod={setMethod}
              />
            </div>
          )}
          {title?.includes("VNPAY") && (
            <div className="col-span-7 flex flex-col gap-4 mt-6">
              <h2>Chọn số tiền cần nạp:</h2>
              <div className="flex items-center gap-4">
                <InputForm
                  id="requiredAmount"
                  register={register}
                  errors={errors}
                  validate={{ requried: "Nhập số tiền cần nạp" }}
                  wrapClassanme="w-[240px] flex-none"
                  placeholder="Nhập số tiền"
                />
                <span className=" w-[42px] h-[42px] flex items-center">
                  VNĐ
                </span>
              </div>
              <Button onClick={handleSubmit(handleDeposit)} className="w-fit">
                Tiếp tục
              </Button>
            </div>
          )}
          <div className="col-span-3">
            <div className="flex flex-col gap-2 border rounded-md p-4">
              <h3>Số dư tài khoản:</h3>
              <span>
                <span className="text-emerald-700 text-3xl font-medium">
                  {current?.balance || 0}
                </span>{" "}
                VNĐ
              </span>
            </div>
            <Link
              to={`/${path.SUPPLIER}/${path.MANAGE_DEPOSIT}`}
              className="text-sm text-white bg-gray-600 mt-2 w-full py-2 flex items-center gap-2 justify-center rounded-md"
            >
              Lịch sử nạp tiền <AiOutlineArrowRight />
            </Link>
            <Link
              to={`/${path.SUPPLIER}/${path.HISTORIES_PAYMENT}`}
              className="text-sm text-white bg-gray-600 mt-2 w-full py-2 flex items-center gap-2 justify-center rounded-md"
            >
              Lịch sử thanh toán <AiOutlineArrowRight />
            </Link>
            <Link
              to={`/${path.PRICING}`}
              className="text-sm text-white bg-gray-600 mt-2 w-full py-2 flex items-center gap-2 justify-center rounded-md"
            >
              Bảng giá dịch vụ <AiOutlineArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deposit
