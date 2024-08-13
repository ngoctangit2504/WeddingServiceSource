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
import { NavLink } from "react-router-dom"
import path from "@/ultils/path"

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
    const result = await Swal.fire({
      icon: "info",
      title: "Xác nhận thao tác",
      text: `Bạn có chắc muốn đăng ký gói dịch vụ ${name} không?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Đăng ký",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      if (current?.phoneNumberConfirmed) {
        try {
          const response = await apiSubcribePricing({ servicePackageId });

          if (response.success) {
            toast.success(response.message);
            dispatch(getCurrent());
          } else if (response.message === "Nhà cung cấp không tồn tại!") {
            window.location.href = `/${path.SUPPLIER}/${path.INFORMATION_SUPPLIER}`;
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
      } else {
        dispatch(modal({ isShowModal: true, modalContent: <VerifyPhone /> }));
      }
    }
  };


  // Đảm bảo giá trị boolean cho thuộc tính disabled
  // const isDisabled = current?.servicePackageUsed === name;
  return (
    <div className={clsx("col-span-1 h-full mb-[150px]")}>
      <h3
        className={clsx(
          "text-center p-4 border border-pink-500 bg-pink-700 text-white font-semibold rounded-t-md",
          current?.servicePackageUsed === name &&
          "bg-red-700 border-red-700"
        )}
      >
        {name}
      </h3>
      <div
        className={clsx(
          "flex rounded-b-md border h-[260px] border-emerald-500 flex-col gap-2 justify-between items-center py-3",
          current?.servicePackageUsed === name && " border-red-700"
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
            color: "#e91e63", // Bright pink for headings
          }}
        >
          Nâng Tầm Tin Đăng Của Bạn với Các Gói VIP
        </h1>
      </header>
      <div className="container clearfix">
        <section
          className="section"
          style={{
            padding: "20px",
            border: 0,
            boxShadow: "0 0 30px 10px rgb(0 0 0 / 3%)",
            background: 'url("https://matchthemes.com/demohtml/tilia/images/pages/img-about1.jpg") no-repeat center center',
            backgroundSize: 'cover',
            color: '#fff',
            backgroundColor: 'rgba(233, 30, 99, 0.9)', // Overlay pink color for a cohesive look
          }}
        >
          <div className="section-content">
            <p style={{ lineHeight: "1.5", fontSize: "1.2em", textAlign: "justify" }}>
              Chào mừng bạn đến với sweetdream.com - nền tảng dịch vụ cưới hỏi hàng đầu!
              Chúng tôi cung cấp các gói dịch vụ VIP để giúp tin đăng của bạn nổi bật
              trên trang chủ, thu hút được nhiều khách hàng hơn.
            </p>
            <p style={{ fontSize: "1.1em", marginTop: "20px" }}>ƯU ĐIỂM GÓI VIP:</p>
            <div className="benefit-item" style={{ color: "#ff80ab" }}>
              <FaCheck className="benefit-icon" />
              <strong>Tăng Hiển Thị:</strong> Đảm bảo tin đăng của bạn luôn xuất hiện trên trang chủ.
            </div>
            <div className="benefit-item" style={{ color: "#ff80ab" }}>
              <FaCheck className="benefit-icon" />
              <strong>Tiếp Cận Nhiều Khách Hàng Hơn:</strong> Gói VIP giúp bạn tiếp cận đúng đối tượng khách hàng.
            </div>
            <div className="benefit-item" style={{ color: "#ff80ab" }}>
              <FaCheck className="benefit-icon" />
              <strong>Tùy Chọn Linh Hoạt:</strong> Chọn gói VIP phù hợp với nhu cầu và ngân sách của bạn.
            </div>
            <div className="benefit-item" style={{ color: "#ff80ab" }}>
              <FaCheck className="benefit-icon" />
              <strong>Hỗ Trợ Tận Tình:</strong> Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn bất cứ lúc nào.
            </div>
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
          color: "#e91e63", // Same pink color for consistency
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
