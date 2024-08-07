import React, { Fragment, useCallback, useEffect, useState } from "react"

//import { InputForm, Button, InputRadio, OtpVerify } from "../../components/inputs"
// import component
import Button from '@/components/common/Button'
import InputForm from '@/components/inputs/InputForm'
import InputRadio from '@/components/inputs/InputRadio';
//import OtpVerify from '@/components/auth/OtpVerify';

import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { apiRegister, apiLogin } from "@/apis/user"
import { Link, useSearchParams } from "react-router-dom"
import path from "@/ultils/path"
import { modal } from "@/redux/appSlice"
import { login, selectRole } from "@/redux/userSlice"

const Login = ({ navigate, dispatch, location }) => {
  const { selectedRole, current } = useSelector((state) => state.user)
  const [variant, setVariant] = useState(() => location.state || "LOGIN")
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()
  useEffect(() => {
    reset()
  }, [variant])
  const role = watch("role")
  const userName = watch("userName")
  useEffect(() => {
    dispatch(selectRole({ role, userName }))
  }, [role, userName])
  const onSubmit = async (payload) => {
    const { name, phoneNumber, ...data } = payload
    if (variant === "LOGIN") {
      if (phoneNumber) data.phoneNumber = `+84${phoneNumber?.substring(1)}`
      setIsLoading(true)
      const response = await apiLogin(data)
      setIsLoading(false)
      if (response.token) {
        dispatch(login({ token: response.token }))
       //  if (searchParams.get("redirect"))
        return navigate("/")
      } else {
        Swal.fire('Oops...', response.message, 'error')
      }
    }
    if (variant === "REGISTER") {
      if (phoneNumber) payload.phoneNumber = `+84${phoneNumber?.substring(1)}`
      setIsLoading(true)
      const response = await apiRegister(payload)
      console.log("message of body: " + response.body.message)
      setIsLoading(false)
      if (response.body.success) {
        if (selectedRole === "ROLE_MANAGE") {
          dispatch(
            modal({
              isShowModal: true,
              //   modalContent: <OtpVerify setVariant={setVariant} />,
            })
          )
        } else {
          Swal.fire({
            icon: "success",
            text: response.body.message,
            title: "Congrats!",
            showConfirmButton: true,
            confirmButtonText: "Đi tới đăng nhập",
          }).then(({ isConfirmed }) => {
            return isConfirmed && setVariant("LOGIN")
          })
        }
      } else Swal.fire("Oops!", response.body.message, "error")
    }
  }
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") setVariant("REGISTER")
    else setVariant("LOGIN")
  }, [variant])

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="bg-emerald-700 h-[80px] flex items-center w-full" style={{ backgroundColor: 'rgba(254, 241, 241, .65)' }}>
        <Link
          to="/"
          className="mx-auto w-main text-white font-bold flex items-center justify-between text-3xl"
        >
          <span style={{ color: '#e4007f' }}>SweetDream.com</span>
          {/* <span className="text-sm font-light">❓ Help</span> */}
        </Link>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-1/2">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
        </div>
        <div className="w-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg shadow-sm inset-0 p-4 flex flex-col gap-8 w-[500px]" style={{ backgroundColor: 'rgba(254, 241, 241, .65)' }}
          >
            <h2 className="text-3xl tracking-tight font-bold m-auto py-4" style={{ color: '#93536a' }}>
              {variant === "LOGIN" ? "Đăng nhập thành viên" : "Tạo tài khoản"}
            </h2>
            <InputForm
              label="Số điện thoại"
              register={register}
              errors={errors}
              id="phoneNumber"
              validate={{
                required: "Trường này không được bỏ trống.",
                pattern: {
                  value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
              placeholder="Nhập số điện thoại của bạn"
              fullWidth
            />
            <InputForm
              label="Mật khẩu"
              register={register}
              errors={errors}
              id="password"
              validate={{
                required: "Trường này không được bỏ trống.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu bắt buộc tối thiểu 6 ký tự.",
                },
              }}
              type="password"
              fullWidth
              placeholder="Mật khẩu tối thiểu 6 ký tự"
            />
            {variant === "REGISTER" && (
              <Fragment>
                <InputForm
                  label="Tên của bạn"
                  register={register}
                  errors={errors}
                  id="userName"
                  validate={{ required: "Trường này không được bỏ trống." }}
                  fullWidth
                  placeholder={"Họ và tên của bạn"}
                />
                <div>
                  <InputRadio
                    id="role"
                    values={[
                      { value: "ROLE_CUSTOMER", label: "Tìm kiếm" },
                      { value: "ROLE_MANAGE", label: "Chính chủ" },
                    ]}
                    register={register}
                    errors={errors}
                    name="role"
                  />
                </div>
              </Fragment>
            )}

            <Button disabled={isLoading} type="submit" fullWidth className="mt-3">
              {variant === "LOGIN" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </Button>
            <div className="flex gap-2">
              <span style={{ color: '#93536a' }}>
                {variant === "LOGIN"
                  ? "Bạn chưa có tài khoản?"
                  : "Đã có tài khoản?"}
              </span>
              <span
                className="text-pink-400 cursor-pointer hover:underline"
                onClick={toggleVariant}
              >
                {variant === "LOGIN" ? "Tạo tài khoản" : "Đi tới đăng nhập"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withBaseTopping(Login)