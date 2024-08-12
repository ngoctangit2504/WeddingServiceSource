import { apiCreatePricing } from "@/apis/pricing"
import { Button, InputForm, InputText, Title } from "@/components"
import React, { memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import path from "@/ultils/path"
import WithBaseTopping from "@/hocs/withBaseTopping"
const CreatePricing = ({navigate}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()
  const onSubmit = async (data) => {
    const response = await apiCreatePricing(data)
    if (response.success) {
      reset()
      toast.success(response.message)
      navigate(`/${path.ADMIN}/${path.MANAGE_PRICING}`)
    } else toast.error(response.message)
  }
  return (
    <section className="mb-[200px]">
      <Title title="Tạo mới bảng giá dịch vụ"></Title>
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
            value={30}
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
            Tạo mới
          </Button>
        </div>
      </form>
    </section>
  )
}

export default WithBaseTopping(memo(CreatePricing))
