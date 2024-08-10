import { apiGetTransationUser } from "@/apis/payment"
import { Pagination, Title } from "@/components"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

const HistoriesPayment = () => {
  const { setValue, watch } = useForm()
  const { current } = useSelector((s) => s.user)
  const { isShowModal } = useSelector((s) => s.app)
  const keyword = watch("keyword")
  const status = watch("status")
  const [searchParams] = useSearchParams()
  const [update, setUpdate] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [count, setCount] = useState(0)
  const fetchHistoriesPayment = async (params) => {
    const response = await apiGetTransationUser(params)
    if (response.body.data) {
      setTransactions(response.body.data)
      setCount(response.body.count)
    }
  }
  useEffect(() => {
    const { page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    if (page && Number(page)) searchParamsObject.page = Number(page) - 1
    else searchParamsObject.page = 0
    searchParamsObject.limit = 5
    fetchHistoriesPayment(searchParamsObject)
  }, [searchParams])
  return (
    <>
      <Title title="Lịch sử thanh toán"></Title>
      <div className="p-4">
        <div className="mt-6 w-full">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-2 border font-medium text-center">
                  Mã Giao Dịch
                </th>
                <th className="p-2 border font-medium text-center">
                  Gói dịch vụ
                </th>
                <th className="p-2 border font-medium text-center">
                  Số tiền
                </th>
                <th className="p-2 border font-medium text-center">
                  Ngày thanh toán
                </th>
                <th className="p-2 border font-medium text-center">
                  Ngày hết hạn
                </th>
                <th className="p-2 border font-medium text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions?.map((el) => (
                <tr className="border" key={el.transactionId}>
                  <td className="p-2 text-center">{el.transactionId}</td>

                  <td className="p-2 text-center">
                    {el.partServicePackage?.servicePackageName}
                  </td>

                  <td className="p-2 text-center">
                    {`${formatMoney(el.partServicePackage?.price)} đ`}
                  </td>

                  <td className="p-2 text-center">
                    {moment(el.purchaseDate).format("DD/MM/YYYY")}
                  </td>

                  <td className="p-2 text-center">
                    {moment(el.expirationDate).format("DD/MM/YYYY")}
                  </td>

                  <td className="p-2 text-center">
                    {!el.expired ? "Hoạt động" : "Hết hạn"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Pagination totalCount={count} />
        </div>
      </div>
    </>
  )
}

export default HistoriesPayment
