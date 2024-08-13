import { apiGetBookingServices } from "@/apis/service"
import { Pagination, Title } from "@/components"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillDelete } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

const ManageBooking = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchBookingHistories = async () => {
        try {
            const response = await apiGetBookingServices()
            if (response.data) {
                setBookings(response)
            } else {
                setBookings([])
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi lấy danh sách đặt chỗ.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookingHistories()
    }, [])

    return (
        <div>
            <Title title="Danh sách yêu cầu báo giá"></Title>
            <div className="p-4">
                <div className="mt-6 w-full">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="p-2 border font-medium text-center">ID</th>
                                <th className="p-2 border font-medium text-center">
                                    Tên Người Dùng
                                </th>
                                <th className="p-2 border font-medium text-center">
                                    Email
                                </th>
                                <th className="p-2 border font-medium text-center">Số Điện Thoại</th>
                                <th className="p-2 border font-medium text-center">
                                    Ngày Tạo
                                </th>
                                <th className="p-2 border font-medium text-center">
                                    Tên Dịch Vụ
                                </th>
                                <th className="p-2 border font-medium text-center">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {bookings?.data?.map((el) => (
                                <tr className="border" key={el.id}>
                                    <td className="p-2 text-center">
                                        {el.id}
                                    </td>
                                    <td className="p-2 text-center">{el.nameCustomer}</td>
                                    <td className="p-2 text-center">
                                        {el.email}
                                    </td>
                                    <td className="p-2 text-center">
                                        {el.phoneNumber}
                                    </td>
                                    <td className="p-2 text-center">{moment(el.createdDate).format("DD/MM/YYYY")}</td>
                                    <td className="p-2 text-center">
                                        {el.titleService}
                                    </td>
                                    <td className="p-2 text-center">{el.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6">
                    <Pagination totalCount={bookings?.count || 1} />
                </div>
            </div>
        </div>
    )
}

export default ManageBooking
