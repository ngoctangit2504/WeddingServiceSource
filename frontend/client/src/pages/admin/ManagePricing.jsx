import { apiDeletePricing, apiGetPricings } from "@/apis/pricing"
import { Button, Pagination, Title } from "@/components"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai"
import UpdatePricing from "./UpdatePricing"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import { Link, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import path from "@/ultils/path"


const ManagePricing = ({ dispatch }) => {
  const [pricings, setPricings] = useState()
  const [update, setUpdate] = useState(false)
  const [counts, setCounts] = useState(0)
  const [searchParams] = useSearchParams()
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const fetchPricings = async (searchParamsObject) => {
    const response = await apiGetPricings(searchParamsObject)
    if (response.data) {
      setPricings(response.data)
      setCounts(response.count)
    }
  }
  useEffect(() => {
    const { page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    if (page && Number(page)) searchParamsObject.page = Number(page) - 1
    else searchParamsObject.page = 0
    searchParamsObject.limit = 5
    fetchPricings(searchParamsObject)
  }, [update, searchParams])
  const handleDeletePricing = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận thao tác",
      text: "Bạn có chắc muốn xóa?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Quay lại",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeletePricing(id)
        if (response.success) {
          toast.success(response.message)
          render()
        } else toast.error(response.message)
      }
    })
  }

  return (
    <section className="mb-[200px]">
      <Title title="Quản lý bảng giá dịch vụ">
        <Link
          className="px-4 py-2 text-white rounded-md bg-pink-500"
          to={`/${path.ADMIN}/${path.CREATE_PRICING}`}
        >
          Tạo mới dịch vụ
        </Link>
      </Title>      
      <div className="p-4">
        <div className="mt-6 w-full">
          <table className="table-auto w-full">
            <thead>
              <tr className="border text-emerald-700">
                <th className="p-2  border text-center">ID</th>
                <th className="p-2  border text-center">Tên dịch vụ</th>
                <th className="p-2  border text-center">Số ngày áp dụng</th>
                <th className="p-2  border text-center">Giá</th>
                <th className="p-2  border text-center">Ngày tạo</th>
                <th className="p-2  border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pricings?.map((el) => (
                <tr className="border" key={el.servicePackageId}>
                  <td className="p-2 text-center">{el.servicePackageId}</td>
                  <td className="p-2 text-center">{el.name}</td>
                  <td className="p-2 text-center">{el.durationDays}</td>
                  <td className="p-2 text-center">{el.price}</td>
                  <td className="p-2 text-center">
                    {moment(el.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="flex items-center justify-center gap-2 p-2">
                    <span
                      onClick={() =>
                        dispatch(
                          modal({
                            isShowModal: true,
                            modalContent: (
                              <UpdatePricing render={render} editPricing={el} />
                            ),
                          })
                        )
                      }
                      className="text-lg text-main-red cursor-pointer px-1"
                    >
                      <AiOutlineEdit />
                    </span>
                    <span
                      onClick={() => handleDeletePricing(el.servicePackageId)}
                      className="text-lg text-main-red cursor-pointer px-1"
                    >
                      <AiFillDelete />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </section>
  )
}

export default WithBaseTopping(ManagePricing)
