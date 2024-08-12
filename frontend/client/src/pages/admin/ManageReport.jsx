import { apiDeleteReport, apiGetReports } from "@/apis/report"
import { Pagination, Title } from "@/components"
import path from "@/ultils/path"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { AiFillDelete } from "react-icons/ai"
import { useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"

const ManageReport = () => {
  const [update, setUpdate] = useState(false)
  const [counts, setCounts] = useState(0)
  const [searchParams] = useSearchParams()
  const [reports, setReports] = useState()
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const fetchReports = async (searchParamsObject) => {
    const response = await apiGetReports(searchParamsObject)
    if (response.data) {
      setReports(response.data)
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
    fetchReports(searchParamsObject)
  }, [update, searchParams])
  const handleDeleteReport = (id) => {
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
        const response = await apiDeleteReport({ ids: [id] })
        if (response.success) {
          toast.success(response.message)
          render()
        } else toast.error(response.message)
      }
    })
  }
  return (
    <>
      <Title title="Quản lý báo cáo vi phạm"></Title>
      <div className="p-4">
        <div className="mt-6 w-full">
          <table className="table-auto w-full">
            <thead>
              <tr className="border text-pink-700">
                <th className="p-2  border text-center">ID</th>
                <th className="p-2  border text-center">Tên người report</th>
                <th className="p-2  border text-center">Số điện thoại</th>
                <th className="p-2  border text-center">Nội dung</th>
                <th className="p-2  border text-center">Ngày report</th>
                <th className="p-2  border text-center">Bài đăng</th>
                <th className="p-2  border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports?.map((el) => (
                <tr className="border" key={el.reportId}>
                  <td className="p-2 text-center">{el.reportId}</td>
                  <td className="p-2 text-center">{el.name}</td>
                  <td className="p-2 text-center">{el.phoneNumber}</td>
                  <td className="p-2 text-center">{el.content}</td>
                  <td className="p-2 text-center">
                    {moment(el.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    <a
                      className="text-blue-500 hover:underline text-center"
                      href={`/${path.DETAIL_POST}/${el.idOfPost}/preview`}
                      target="_blank"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                  <td className="flex items-center justify-center gap-2 p-2">
                    <span
                      onClick={() => handleDeleteReport(el.reportId)}
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
    </>
  )
}

export default ManageReport
