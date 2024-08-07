import { Button, Pagination, SelectLib, Title } from "@/components"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import { formatMoney } from "@/ultils/fn"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillDelete, AiFillStar, AiOutlineEdit } from "react-icons/ai"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
// import UpdatePost from "./UpdatePost"
import useDebounce from "@/hooks/useDebounce"
import { useSelector } from "react-redux"
import clsx from "clsx"
import { apiDeleteService, apiGetServiceBySupplier, apiGetServices } from "@/apis/service"
import path from "@/ultils/path"
import { stars, statuses } from "@/ultils/constant"
import { apiCheckSupplierExited } from "@/apis/supplier"

const ManageService = ({ dispatch, navigate }) => {
  const { setValue, watch } = useForm()
  const { current } = useSelector((s) => s.user)
  const { isShowModal } = useSelector((s) => s.app)
  const keyword = watch("keyword")
  const status = watch("status")
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const [update, setUpdate] = useState(false)
  const fetchPosts = async (params) => {
    const response = await apiGetServices(params)
    if (response) setPosts(response)
    else setPosts([])
  }
  const debounceValue = useDebounce(keyword, 500)
  useEffect(() => {
    const formdata = new FormData();
    const { page, ...searchParamsObject } = Object.fromEntries([...searchParams]);

    // Adjust the page parameter
    if (page && Number(page)) formdata.append("page", Number(page) - 1);

    // Set status in searchParamsObject
    if (status) searchParamsObject.status = status.value;
    else delete searchParamsObject.status;

    // Add supplier_id with a value of null to the searchParamsObject
    searchParamsObject.supplier_id = null;

    // Append the json parameter with the updated searchParamsObject
    formdata.append("json", JSON.stringify(searchParamsObject));

    // Append size parameter
    formdata.append("size", 5);

    // Fetch posts if the modal is not shown
    !isShowModal && fetchPosts(formdata);
  }, [searchParams, update, debounceValue, status, isShowModal]);

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
  const handleCheckSupplier = async () => {
    try {
      const response = await apiCheckSupplierExited();
      if (response.success) {
        navigate(`/${path.SUPPLIER}/${path.CREATE_SERVICE}`);
      } else {
        navigate(`/${path.SUPPLIER}/${path.INFORMATION_SUPPLIER}`);
      }
    } catch (error) {
      console.error("Failed to check supplier status:", error);
    }
  }
  return (
    <section className="mb-[200px]">
      <Title title="Quản lý Dịch Vụ">
        <Button
          onClick={handleCheckSupplier}
        >
          Đăng tin mới
        </Button>
      </Title>
      <div className="p-4 mt-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Lọc theo:</span>
              <SelectLib
                placeholder="đánh giá"
                className="py-2"
                options={stars}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Lọc theo:</span>
              <SelectLib
                placeholder="trạng thái"
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
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="p-2 border font-medium text-center">Mã tin</th>
                <th className="p-2 border font-medium text-center">
                  Ảnh đại diện
                </th>
                <th className="p-2 border font-medium text-center">Tiêu đề</th>
                <th className="p-2 border font-medium text-center">Giá</th>
                <th className="p-2 border font-medium text-center">
                  Ngày tạo mới
                </th>
                <th className="p-2 border font-medium text-center">
                  Ngày cập nhật
                </th>
                <th className="p-2 border font-medium text-center">
                  Trạng thái
                </th>
                <th className="p-2 border bg-pink-500 text-white font-medium text-center">
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
                    {formatMoney(el.price) + " VNĐ"}
                  </td>
                  <td className="p-2 text-center">
                    {moment(el.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    {moment(el.modifiedDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    {statuses.find((n) => n.value === el.status)?.name}
                  </td>
                  <td className="p-2">
                    <span className="flex w-full justify-center text-emerald-700 items-center gap-2">
                      <span
                        onClick={() =>
                          dispatch(
                            modal({
                              isShowModal: true,
                              modalContent: <UpdatePost postId={el.id} />,
                            })
                          )
                        }
                        title="Chỉnh sửa"
                        className="text-lg text-pink-400 cursor-pointer px-1"
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

export default withBaseTopping(ManageService)
