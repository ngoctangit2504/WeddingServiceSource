import { apiGetPricings, apiSubcribePricing } from "@/apis/pricing"
import { Button, VerifyPhone } from "@/components"
import { modal } from "@/redux/appSlice"
import { formatMoney } from "@/ultils/fn"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { FaCheck } from "react-icons/fa"
import { MdOutlineCheckCircle } from "react-icons/md"
import clsx from "clsx"
import { getCurrent } from "@/redux/action"
import Swal from "sweetalert2"

const PricingItem = ({
  name,
  description,
  price,
  durationDays,
  servicePackageId,
  isDisabled
}) => {
  const dispatch = useDispatch()
  const { current } = useSelector((s) => s.user)
  const handleSubcribe = async () => {
    Swal.fire({
      icon: "info",
      title: "Xác nhận thao tác",
      text: `Bạn có chắc muốn đăng ký gói dịch vụ ${name} không?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Đăng ký",
      cancelButtonText: "Quay lại",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        if (current?.phoneNumberConfirmed) {
          const response = await apiSubcribePricing({ servicePackageId })
          if (response.success) {
            toast.success(response.message)
            dispatch(getCurrent())
          } else toast.error(response.message)
        } else {
          dispatch(modal({ isShowModal: true, modalContent: <VerifyPhone /> }))
        }
      }
    })
  }

  // Đảm bảo giá trị boolean cho thuộc tính disabled
  // const isDisabled = current?.servicePackageUsed === name;
  return (
    <div className={clsx("col-span-1 h-full mb-[150px]")}>
      <h3
        className={clsx(
          "text-center p-4 border border-emerald-500 bg-emerald-700 text-white font-semibold rounded-t-md",
          current?.servicePackageUsed === name &&
          "bg-orange-700 border-orange-700"
        )}
      >
        {name}
      </h3>
      <div
        className={clsx(
          "flex rounded-b-md border h-[260px] border-emerald-500 flex-col gap-2 justify-between items-center py-3",
          current?.servicePackageUsed === name && " border-orange-700"
        )}
      >
        <div className="flex flex-col gap-2 items-center">
          <span>
            <span>Số ngày áp dụng:</span>{" "}
            <span className="text-emerald-700 font-semibold">
              {durationDays + " ngày"}
            </span>
          </span>
          <span>
            <span>Giá:</span>{" "}
            <span className="text-emerald-700 font-semibold">
              {formatMoney(price) + " VNĐ"}
            </span>
          </span>
          <p className="text-sm italic my-3 px-4 line-clamp-5">{description}</p>
        </div>
        <div className="w-full px-4">
          {current?.servicePackageUsed === name ? (
            <div className="flex items-center py-2 px-4 rounded-md justify-center bg-orange-700 text-white gap-2">
              <MdOutlineCheckCircle size={22} />
              Đã đăng ký
            </div>
          ) : (
            <Button
              onClick={handleSubcribe}
              className="bg-transparent text-emerald-700 border rounded-md border-emerald-700 py-2 w-full"
              disabled={isDisabled}
            >
              Đăng ký
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const Pricing = () => {
  const [pricings, setPricings] = useState([])
  const { current } = useSelector((s) => s.user)

  const fetchPricing = async () => {
    const response = await apiGetPricings({ page: 0, limit: 100 })
    if (response.data) setPricings(response.data)
  }
  useEffect(() => {
    fetchPricing()
  }, [])
  return (
    <div className="mx-auto w-main py-8">
      <header className="page-header category clearfix">
        <h1
          className="page-h1 text-2xl font-bold"
          style={{
            float: "none",
            marginTop: "50px",
            marginBottom: "30px",
            textAlign: "center",
            fontSize: "2em",
          }}
        >
          Giới thiệu bảng giá gói dịch vụ
        </h1>
      </header>
      <div className="container clearfix">
        <section
          className="section"
          style={{
            padding: "20px",
            border: 0,
            boxShadow: "0 0 30px 10px rgb(0 0 0 / 3%)",
          }}
        >
          <div className="section-content">
            <p style={{ lineHeight: "1.5" }}>
              Chào mừng bạn đến với trang web tìm kiếm dịch vụ cưới hỏi
              - sweetdream.com!
            </p>
            <p>ƯU ĐIỂM DỊCH VỤ:</p>
            <p style={{ marginBottom: "10px", lineHeight: "1.5" }}>
              <FaCheck
                style={{
                  display: "inline-block",
                  float: "left",
                  marginRight: "10px",
                  color: "green",
                }}
              />
              <strong>Quản Lý...:</strong> Người dùng có thể....
            </p>
            <p style={{ marginBottom: "10px", lineHeight: "1.5" }}>
              <FaCheck
                style={{
                  display: "inline-block",
                  float: "left",
                  marginRight: "10px",
                  color: "green",
                }}
              />
              <strong>Đăng Tin Dễ Dàng:</strong> Người dùng có thể...
            </p>
            <p style={{ marginBottom: "10px", lineHeight: "1.5" }}>
              <FaCheck
                style={{
                  display: "inline-block",
                  float: "left",
                  marginRight: "10px",
                  color: "green",
                }}
              />
              <strong>Quản Lý...:</strong> Người dùng có thể...
            </p>
            <p style={{ lineHeight: "1.5" }}>
              <FaCheck
                style={{
                  display: "inline-block",
                  float: "left",
                  marginRight: "10px",
                  color: "green",
                }}
              />
              <strong>Thống Kê...</strong> Người dùng có thể...
            </p>
          </div>
        </section>
      </div>
      <h1
        className="page-h1 text-2xl font-bold"
        style={{
          float: "none",
          marginTop: "50px",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "2em",
        }}
      >
        Bảng Giá Dịch Vụ
      </h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {pricings?.map((el) => (
          <PricingItem
            key={el.servicePackageId}
            {...el}
            isDisabled={!!current?.servicePackageUsed && current?.servicePackageUsed !== el.name} // Disable nếu đã đăng ký một gói khác
          />
        ))}
      </div>
    </div>
  )
}

export default Pricing
