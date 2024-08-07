import { apiGetDepositHistory } from "@/apis/payment"
import { Pagination, Title } from "@/components"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillDelete } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

const ManageDeposit = () => {
  const { setValue, watch } = useForm()
  const { current } = useSelector((s) => s.user)
  const { isShowModal } = useSelector((s) => s.app)
  const keyword = watch("keyword")
  const status = watch("status")
  const [histories, setHistories] = useState([])
  const [searchParams] = useSearchParams()
  const [update, setUpdate] = useState(false)
  const fetchDepositHistories = async (params) => {
    const response = await apiGetDepositHistory(params)
    if (response.data) setHistories(response)
    else setPosts([])
  }
  useEffect(() => {
    const { page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    if (page && Number(page)) searchParamsObject.page = Number(page) - 1
    else searchParamsObject.page = 0
    searchParamsObject.limit = 5
    fetchDepositHistories(searchParamsObject)
  }, [searchParams])
  return (
    <div>
      <Title title="Lịch sử nạp tiền"></Title>
      <div className="p-4">
        <div className="mt-6 w-full">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-2 border font-medium text-center">Ngày nạp</th>
                <th className="p-2 border font-medium text-center">
                  Mã giao dịch
                </th>
                <th className="p-2 border font-medium text-center">
                  Phương thức
                </th>
                <th className="p-2 border font-medium text-center">Số tiền</th>
                <th className="p-2 border font-medium text-center">
                  Loại tiền tệ
                </th>
                <th className="p-2 border font-medium text-center">
                  Trạng thái
                </th>
                <th className="p-2 border font-medium text-center">
                  Nội dung giao dịch
                </th>
                <th className="p-2 border font-medium text-center">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {histories?.data?.map((el) => (
                <tr className="border" key={el.id}>
                  <td className="p-2 text-center">
                    {moment(el.paymentDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">{el.id}</td>
                  <td className="p-2 text-center">
                    {el.paymentDestinationsName}
                  </td>
                  <td className="p-2 text-center">
                    {formatMoney(el.paidAmount)}
                  </td>
                  <td className="p-2 text-center">{el.paymentCurrency}</td>
                  <td className="p-2 text-center">
                    {+el.paymentStatus === 0 ? "Thành công" : "Thất bại"}
                  </td>
                  <td className="p-2 text-center">{el.paymentContent}</td>
                  <td className="p-2 text-center">{el.paymentLastMessage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Pagination totalCount={histories?.count || 1} />
        </div>
      </div>
    </div>
  )
}

export default ManageDeposit
