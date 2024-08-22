import { apiGetBookingServices, apiUpdateStatusBooking } from "@/apis/service"
import { Pagination, Title, Button } from "@/components"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import path from "@/ultils/path"
import { statusesBooking } from "@/ultils/constant"
import { toast } from "react-toastify"


const ManageBooking = () => {
    const { setValue, watch } = useForm()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const status = watch("status")
    const updateStatus = watch("updateStatus")
    const [editBooking, setEditBooking] = useState()
    const [update, setUpdate] = useState(false)


    // Định nghĩa hàm render, được gọi khi cần cập nhật trạng thái (update).
    const render = () => {
        setUpdate(!update)
    }

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

    const handleChangeStatus = async () => {
        const response = await apiUpdateStatusBooking({ status: updateStatus, bookingId: editBooking.id })
        if (response) {
            toast.success(response.message);
            setEditBooking(null)
            fetchBookingHistories()
            render()
        } else toast.error(response.message);
    }

    useEffect(() => {
        fetchBookingHistories()
    }, [])

    return (
        <div>
            <Title title="Danh sách yêu cầu báo giá">
                <div className="flex items-center gap-4">
                    {editBooking && updateStatus && (
                        <Button
                            className="bg-blue-500"
                            onClick={() => handleChangeStatus()}
                        >
                            Cập nhật
                        </Button>
                    )}
                    {editBooking && (
                        <Button className="bg-orange-500" onClick={() => setEditBooking(null)}>
                            Hủy
                        </Button>
                    )}
                </div>
            </Title>
            <div className="p-4">
                <div className="mt-6 w-full">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="p-2 border font-medium text-center">ID</th>
                                <th className="p-2 border font-medium text-center">
                                    Tên Dịch Vụ
                                </th>
                                <th className="p-2 border font-medium text-center">
                                    Tên Người Dùng
                                </th>
                                <th className="p-2 border font-medium text-center">Số Điện Thoại</th>

                                <th className="p-2 border font-medium text-center">
                                    Email
                                </th>
                                <th className="p-2 border font-medium text-center">
                                    Ngày Tạo
                                </th>

                                <th className="p-2 border font-medium text-center">Ghi chú</th>
                                <th className="p-2 border font-medium text-center">Trạng thái</th>
                                <th className="p-2 border bg-pink-600 text-white font-medium text-center">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {bookings?.data?.map((el) => (
                                <tr className="border" key={el.id}>
                                    <td className="p-2 text-center">
                                        {el.id}
                                    </td>
                                    <td className="p-2 text-center">
                                        <a
                                            href={`/${path.DETAIL_POST}/${el.serviceId}/${el.titleService}`}
                                            target="_blank"
                                            className="hover:underline text-blue-500"
                                        >
                                            {el.titleService}
                                        </a>
                                    </td>
                                    <td className="p-2 text-center">{el.nameCustomer}</td>
                                    <td className="p-2 text-center">
                                        {el.phoneNumber}
                                    </td>
                                    <td className="p-2 text-center">
                                        {el.email}
                                    </td>

                                    <td className="p-2 text-center">{moment(el.createdDate).format("DD/MM/YYYY")}</td>

                                    <td className="p-2 text-center">{el.note}</td>
                                    <td className="p-2 text-center">
                                        {editBooking?.id === el.id ? (
                                            <select
                                                onChange={(e) =>
                                                    setValue("updateStatus", e.target.value)
                                                }
                                                value={updateStatus}
                                                className="form-select rounded-md"
                                                id="updateStatus"
                                            >
                                                <option value="PROCESS">Đang xử lý</option>
                                                <option value="SUCCESS">Đã liên hệ</option>
                                                <option value="FAILED">Lỗi liên hệ</option>
                                            </select>
                                        ) : (
                                            <span>
                                                {statusesBooking.find((n) => n.value === el.status)?.name}
                                            </span>
                                        )}

                                    </td>
                                    <td className="p-2">
                                        <span className="flex w-full justify-center text-emerald-700 items-center gap-2">
                                            <span
                                                onClick={() => {
                                                    setEditBooking(el)
                                                    setValue("updateStatus", el.status)
                                                }}
                                                title="Chỉnh sửa"
                                                className="text-lg text-rose-600 cursor-pointer px-1"
                                            >
                                                <AiOutlineEdit size={22} />
                                            </span>
                                            <span
                                                onClick={() => handleDeletePost(el.id)}
                                                className="text-lg text-rose-600 cursor-pointer px-1"
                                                title="Xóa"
                                            >
                                                <AiFillDelete size={22} />
                                            </span>
                                        </span>
                                    </td>

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
