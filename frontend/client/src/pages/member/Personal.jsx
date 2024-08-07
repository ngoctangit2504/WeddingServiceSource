import { apiUpdateProfile } from "@/apis/user"
import { Button, InputForm, Title } from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { getCurrent } from "@/redux/action"
import { getBase64 } from "@/ultils/fn"
import path from "@/ultils/path"
import clsx from "clsx"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const Personal = ({ dispatch }) => {
  const { current } = useSelector((s) => s.user)
  const [previewAvatar, setPreviewAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {
    formState: { errors },
    watch,
    register,
    reset,
    handleSubmit,
    getValues,
  } = useForm()
  useEffect(() => {
    reset({
      userName: current?.userName,
      phoneNumber: current?.phoneNumber,
      role: current?.roles?.map((el) => el.description)?.join(" / "),
      active: !current?.active ? "Đang khóa" : "Đang hoạt động",
      email: current?.email,
      address: current?.address,
      dateOfBirth: moment(current?.dateOfBirth)?.format("YYYY-MM-DD") || "",
      profileImage: current?.profileImage,
    })
  }, [current])
  const convertImage = async (file) => {
    const image64 = await getBase64(file)
    setPreviewAvatar(image64)
  }
  useEffect(() => {
    const files = getValues("profileImage")
    if (files instanceof FileList && files.length > 0) {
      const file = files[0]
      convertImage(file)
    }
  }, [watch("profileImage")])
  const onSubmit = async (data) => {
    const { profileImage, address, dateOfBirth, userName, email } = data
    const profileRequest = { address, dateOfBirth, userName, email }
    if (current?.roles?.some((el) => el.name === "ROLE_USER"))
      profileRequest.phoneNumber = data.phoneNumber
    const formData = new FormData()
    if (profileImage && profileImage instanceof FileList && profileImage.length > 0)
      formData.append("profileImage", profileImage[0])
    formData.append("profileRequest", JSON.stringify(profileRequest))
    setIsLoading(true)
    const response = await apiUpdateProfile(formData)
    setIsLoading(false)
    if (response.success) {
      toast.success(response.message)
      dispatch(getCurrent())
    } else toast.error(response.message)
  }
  return (
    <section className="">
      <Title title="Thông tin cá nhân" />
      <div className="sm:w4/5 w-3/5 mx-auto p-4 grid grid-cols-10 mt-6 gap-6">
        <form className="flex flex-col gap-3 col-span-7">
          <InputForm
            label="Tên của bạn"
            register={register}
            errors={errors}
            id="userName"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
          />
          <InputForm
            label="Số điện thoại"
            register={register}
            errors={errors}
            id="phoneNumber"
            validate={{ required: "Trường này không được bỏ trống." }}
            inputClassName={clsx(
              current?.roles?.some((el) => el.name === "ROLE_MANAGE") &&
                "border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
            )}
            readOnly={current?.roles?.some(
              (el) => el.name === "ROLE_MANAGE"
            )}
            fullWidth
          />
          <InputForm
            label="Vai trò"
            register={register}
            errors={errors}
            id="role"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
            readOnly
            inputClassName="border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
          />
          <InputForm
            label="Trạng thái"
            register={register}
            errors={errors}
            id="active"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
            inputClassName="border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
            readOnly
          />
          <InputForm
            label="Địa chỉ"
            register={register}
            errors={errors}
            id="address"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
          />
          <InputForm
            label="Sinh nhật"
            register={register}
            errors={errors}
            id="dateOfBirth"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
            type="date"
          />
          <InputForm
            label="Email"
            register={register}
            errors={errors}
            id="email"
            validate={{ required: "Trường này không được bỏ trống." }}
            fullWidth
          />
          <div className="my-6">
            <Button
              type="submit"
              className="w-fit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              Cập nhật
            </Button>
          </div>
          <Link
            to={
              current?.roles?.some((el) => el.name === "ROLE_MANAGE")
                ? `/${path.MANAGER}/${path.CHANGE_PASSWORD}`
                : `/${path.MEMBER}/${path.CHANGE_PASSWORD}`
            }
            className="text-emerald-600 hover:underline cursor-pointer text-sm"
          >
            Đổi mật khẩu
          </Link>
          {current?.roles?.some((el) => el.name === "ROLE_MANAGE") && (
            <Link
              to={`/${path.MANAGER}/${path.CHANGE_PHONE}`}
              className="text-emerald-600 hover:underline cursor-pointer text-sm"
            >
              Cập nhật số điện thoại mới
            </Link>
          )}
        </form>
        <div className="col-span-3 flex flex-col gap-4">
          <h3 className="font-medium" htmlFor="avatar">
            Ảnh đại diện
          </h3>
          <label
            className="rounded-md px-4 py-2 flex items-center justify-center text-white bg-main-pink w-fit gap-2"
            htmlFor="profileImage"
          >
            <img
              src={getValues("profileImage") || previewAvatar || "/user.svg"}
              alt="avatar"
              className="w-24 h-24 object-cover border rounded-full"
            />
          </label>
          <input {...register("profileImage")} hidden type="file" id="profileImage" />
        </div>
      </div>
    </section>
  )
}

export default WithBaseTopping(Personal)
