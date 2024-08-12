import { Button, Pagination, SelectLib, Title } from "@/components"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillDelete, AiFillStar, AiOutlineEdit } from "react-icons/ai"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import useDebounce from "@/hooks/useDebounce"
import { useSelector } from "react-redux"
import clsx from "clsx"
// import {
//   apiDeletePost,
//   apiGetPosts,
//   apiUpdateApprovedPost,
//   apiUpdateRejectedPost,
// } from "@/apis/post"

import { apiDeleteService, apiGetServices, apiUpdateRejectedService, apiUpdateApprovedService } from "@/apis/service"
import path from "@/ultils/path"
import { stars, statuses } from "@/ultils/constant"

const ManageServices = ({ dispatch, navigate }) => {
  const { setValue, watch } = useForm()
  const { current } = useSelector((s) => s.user)
  const keyword = watch("keyword")
  const status = watch("status")
  const updateStatus = watch("updateStatus")
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const [update, setUpdate] = useState(false)
  const [editPost, setEditPost] = useState()
  const fetchPosts = async (params) => {
    const response = await apiGetServices(params)
    if (response) setPosts(response)
    else setPosts([])
  }
  const debounceValue = useDebounce(keyword, 500)

  // Sử dụng useEffect để thực hiện các hành động sau khi component được render hoặc khi các dependencies thay đổi.
  useEffect(() => {
    // Tạo một đối tượng FormData để đóng gói dữ liệu form.
    const formdata = new FormData()

    // Lấy ra tất cả các thuộc tính từ mảng searchParams và chuyển thành đối tượng.
    const { page, ...searchParamsObject } = Object.fromEntries([
      ...searchParams,
    ])
    if (page && Number(page)) formdata.append("page", Number(page) - 1)
    if (status) searchParamsObject.status = status.value
    else delete searchParamsObject.status
    formdata.append("json", JSON.stringify(searchParamsObject))
    formdata.append("size", 5)

    // Gọi hàm fetchPosts để thực hiện việc lấy dữ liệu từ server với dữ liệu đã được đóng gói trong formdata.
    fetchPosts(formdata)
  }, [searchParams, update, debounceValue, status])

  // Định nghĩa hàm render, được gọi khi cần cập nhật trạng thái (update).
  const render = () => {
    setUpdate(!update)
  }
  const handleDeletePost = (pid) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận thao tác",
      text: "Bạn có chắc muốn xóa bài đăng này?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Quay lại",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        // Delete here
        const response = await apiDeleteService({ serviceId: pid })
        if (response.success) {
          toast.success(response.message)
          render()
        } else toast.error("Có lỗi hãy thử lại sau")
      }
    })
  }
  const handleChangeStatus = async () => {
    if (updateStatus === "APPROVED") {
      const response = await apiUpdateApprovedService({ listServiceId: editPost.id })
      if (response.success) {
        toast.success(response.message)
        render()
        setEditPost(null)
      } else toast.error(response.message)
    }
    if (updateStatus === "REJECTED") {
      const response = await apiUpdateRejectedService({ listServiceId: editPost.id })
      if (response.success) {
        toast.success(response.message)
        setEditPost(null)
        render()
      } else toast.error(response.message)
    }
  }
  return (
    <section className="mb-[200px]">
      <Title title="Quản lý tin đăng">
        <div className="flex items-center gap-4">
          {editPost && updateStatus && (
            <Button
              className="bg-blue-500"
              onClick={() => handleChangeStatus()}
            >
              Cập nhật
            </Button>
          )}
          {editPost && (
            <Button className="bg-orange-500" onClick={() => setEditPost(null)}>
              Hủy
            </Button>
          )}
          <Button
            onClick={() => navigate(`/${path.SUPPLIER}/${path.CREATE_SERVICE}`)}
          >
            Đăng tin mới
          </Button>
        </div>
      </Title>
      <div className="p-4 mt-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Lọc theo:</span>
              <SelectLib
                placeholder="Trạng thái"
                className="py-2"
                options={statuses}
                onChange={(val) => setValue("status", val)}
              />
            </div>
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setValue("keyword", e.target.value)}
            className="max-w-[500px] w-full outline-none border p-2 placeholder:text-sm"
            placeholder="Tìm kiếm tên, địa chỉ..."
          />
        </div>
        <div className="mt-6 w-full">
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th className="p-2 border font-medium text-center">Mã tin</th>
                <th className="p-2 border font-medium text-center">
                  Ảnh đại diện
                </th>
                <th className="p-2 border font-medium text-center">Tiêu đề</th>
                <th className="p-2 border font-medium text-center">Ngày tạo</th>
                <th className="p-2 border font-medium text-center">
                  Ngày cập nhật
                </th>
                <th className="p-2 border font-medium text-center">
                  Trạng thái
                </th>
                <th className="p-2 border bg-pink-600 text-white font-medium text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {posts?.data?.map((el) => (
                <tr className="border" key={el.id}>
                  <td className="p-2 text-center">{el.id}</td>
                  <td className="p-2 text-center">
                    <span className="flex items-center justify-center">
                      <img
                        src={el.image}
                        className="w-24 h-24 rounded-md border p-2 object-cover"
                        alt=""
                      />
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <a
                      href={`/${path.DETAIL_POST}/${el.id}/${el.title}`}
                      target="_blank"
                      className="hover:underline text-blue-500"
                    >
                      {el.title}
                    </a>
                  </td>
                  <td className="p-2 text-center">
                    {moment(el.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    {moment(el.modifiedDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    {editPost?.id === el.id ? (
                      <select
                        onChange={(e) =>
                          setValue("updateStatus", e.target.value)
                        }
                        value={updateStatus}
                        className="form-select rounded-md"
                        id="updateStatus"
                      >
                        <option value="APPROVED">Thành công</option>
                        <option value="REVIEW">Đang xử lý</option>
                        <option value="REJECTED">Đã từ chối</option>
                      </select>
                    ) : (
                      <span>
                        {statuses.find((n) => n.value === el.status)?.name}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <span className="flex w-full justify-center text-emerald-700 items-center gap-2">
                      <span
                        onClick={() => {
                          setEditPost(el)
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
          <Pagination totalCount={posts?.count || 1} />
        </div>
      </div>
    </section>
  )
}

export default withBaseTopping(ManageServices)
