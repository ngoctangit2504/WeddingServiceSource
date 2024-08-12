import { apiUpdatePricing } from "@/apis/pricing"
import { Button, InputForm, InputText, Title } from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

const UpdatePricing = ({ editPricing, dispatch, render }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()
  useEffect(() => {
    if (editPricing) {
      reset({
        name: editPricing?.name,
        durationDays: editPricing?.durationDays,
        price: editPricing?.price,
        description: editPricing?.description,
      })
    }
  }, [editPricing])
  const onSubmit = async (data) => {
    const response = await apiUpdatePricing(data, editPricing.servicePackageId)
    if (response.success) {
      toast.success(response.message)
      dispatch(modal({ isShowModal: false, modalContent: null }))
      render()
    } else toast.error(response.message)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[90%] bg-white h-full py-4"
    >
      <h2 className="px-4 h-[60px] font-bold text-3xl border-b">
        Cập nhật dịch vụ <span>#{editPricing?.servicePackageId}</span>
      </h2>
      <div className="p-4">
        <form className="p-4">
          <div className="grid grids-cols-4 gap-4">
            <InputForm
              id="name"
              register={register}
              errors={errors}
              validate={{ required: "Trường này không được bỏ trống" }}
              placeholder="Nhập tên dịch vụ"
              wrapClassanme="col-span-2"
              label="Tên dịch vụ"
            />
            <InputForm
              id="durationDays"
              register={register}
              errors={errors}
              validate={{ required: "Trường này không được bỏ trống" }}
              placeholder="Nhập số ngày áp dụng"
              wrapClassanme="col-span-1"
              label="Số ngày áp dụng"
              type="number"
              readOnly
            />
            <InputForm
              id="price"
              register={register}
              errors={errors}
              validate={{ required: "Trường này không được bỏ trống" }}
              placeholder="Nhập giá dịch vụ"
              wrapClassanme="col-span-1"
              label="Giá dịch vụ"
              type="number"
            />
            <InputText
              id="description"
              register={register}
              errors={errors}
              validate={{ required: "Trường này không được bỏ trống" }}
              placeholder="Nhập mô tả dịch vụ"
              wrapClassanme="col-span-4"
              label="Mô tả"
              row={10}
            />
            <Button onClick={handleSubmit(onSubmit)} className="mt-4">
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithBaseTopping(UpdatePricing)
