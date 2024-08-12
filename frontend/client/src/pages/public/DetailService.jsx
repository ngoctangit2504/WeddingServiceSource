import { customMoney, formatMoney, renderStarFromNumber } from "@/ultils/fn"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { AiOutlineHeart, AiOutlineUnorderedList } from "react-icons/ai"
import { GoLocation } from "react-icons/go"
import { BsPhoneVibrate } from "react-icons/bs"
import { createSearchParams, useParams } from "react-router-dom"
import Swal from "sweetalert2"


// import { apiGetDetailPost, apiGetPosts, apiGetRatings } from "@/apis/post"

import { apiGetDetailService } from "@/apis/service"
import { apiGetRatings } from "@/apis/rating"
import { apiGetAlbumOfService } from "@/apis/service"
import { formatVietnameseToString } from "@/ultils/fn"
import { Link } from "react-router-dom"
import moment from "moment"
import DOMPurify from "dompurify"
import { apiGetLngLatFromAddress } from "@/apis/app"
import { CgSpinner } from "react-icons/cg"
import { MdForwardToInbox } from "react-icons/md"
import {
  BoxFilter,
  Button,
  Comments,
  DetailImages,
  LongCard,
  Map,
  Rating,
  Report,
  InputForm
} from "@/components"
import TypeBox from "@/components/comment/TypeBox"
import { useSelector } from "react-redux"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import { MdOutlineReportProblem } from "react-icons/md"
import { modal } from "@/redux/appSlice"
import { Slide, toast } from "react-toastify"
import { apiAddWishlist, apiRemoveWishlist } from "@/apis/user"
import { apiCreateNewBooking } from "@/apis/service"
import { getWishlist } from "@/redux/action"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { Booking } from "@/components"



import { FaFacebookSquare } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import { RiStarFill } from 'react-icons/ri';


const DetailPost = ({ navigate, location, dispatch }) => {
  const { pid } = useParams()
  const { isShowModal } = useSelector((s) => s.app)
  const [seeMore, setSeeMore] = useState(false)
  const [post, setPost] = useState()
  const [rating, setRating] = useState({})
  const [center, setCenter] = useState([])
  const [posts, setPosts] = useState([])
  const [albums, setAlbums] = useState([])
  const SUPPLIER_DETAIL_PATH = `/${path.SUPPLIER_DETAIL__SID__NAME.replace(':supplierId', post?.supplierId).replace(':supplierName', formatVietnameseToString(post?.supplierName))}`;


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const { current, wishlist } = useSelector((s) => s.user)

  const fetchDetailPost = async () => {
    const response = await apiGetDetailService({ serviceId: pid })
    if (response) setPost(response.data)
  }

  const getAlbum = async () => {
    try {
      const response = await apiGetAlbumOfService({ serviceId: pid });
      if (response && response.data) {
        setAlbums(response.data);
      } else {
        setAlbums([]);
        console.log("No data available");
      }
    } catch (error) {
      setAlbums([]);
      console.error("Error fetching album:", error);
    }
  };

  // const getPosts = async (address) => {
  //   const formdata = new FormData()
  //   formdata.append("json", JSON.stringify({ address, status: "APPROVED" }))
  //   formdata.append("size", 5)
  //   const response = await apiGetAlbumOfService(formdata)
  //   if (response) setPosts(response.data)
  //   else setPosts([])
  // }

  const handleSendPriceQuote = async (data) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận thao tác",
      text: "Bạn có chắc muốn gửi thông tin nhận báo giá dịch vụ này?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Quay lại",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const requestBody = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          notes: data.content,
          serviceId: pid
        }
        const response = await apiCreateNewBooking(requestBody);
        if (response.success) {
          toast.success(response.message)
          render()
        } else toast.error("Có lỗi hãy thử lại sau")
      }
    })
  };

  const fetchRating = async () => {
    const response = await apiGetRatings({ postId: pid })
    if (response) setRating(response.data)
    else setRating({})
  }
  const fetLngLat = async (payload) => {
    const response = await apiGetLngLatFromAddress(payload)
    if (response.status === 200)
      setCenter([
        response.data?.features[0]?.properties?.lat,
        response.data?.features[0]?.properties?.lon,
      ])
  }

  useEffect(() => {
    fetchDetailPost();
    if (!isShowModal) {
      fetchRating();
      getAlbum();
    }
  }, [pid, isShowModal]);

  useEffect(() => {
    if (post?.addressService) {
      fetLngLat({
        text: post?.addressService,
        apiKey: import.meta.env.VITE_MAP_API_KEY,
      })
      //    getPosts(post?.addressService?.split(",")[post?.addressService?.split(",")?.length - 1])
    }
  }, [post])
  const handleAddWishlist = async () => {
    if (!current) return toast.warn("Bạn phải đăng nhập trước.")
    const response = await apiAddWishlist({ postId: pid, wishlistName: "POST" })
    if (response.wishlistId) {
      toast.success("Thêm bài đăng yêu thích thành công")
      dispatch(getWishlist())
    } else toast.error(response.message)
  }
  const handleRemoveWishlist = async () => {
    const wishlistId = wishlist?.find((el) => +el.id === +pid)?.wishListItemId
    const response = await apiRemoveWishlist(wishlistId)
    if (response.success) {
      toast.success(response.message)
      dispatch(getWishlist())
    } else toast.error(response.message)
  }

  return (
    <div className="w-main mt-6 m-auto pb-[200px]">
      <div className="max-w-screen-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <img
              src={post?.logo} // Thay đổi đường dẫn đến logo của bạn
              alt="Logo"
              className="h-16 w-auto"
            />
            <div className="ml-4">
              <Link to={SUPPLIER_DETAIL_PATH} className="text-2xl font-bold">
                {post?.supplierName}
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <GoLocation className="text-gray-400 mr-3" />
              <p className="text-base text-gray-600">{post?.phoneNumberSupplier}</p>
            </div>

            <div className="flex items-center mt-3 justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <AiOutlineGlobal className="text-gray-400 mr-1" />
                  <a
                    href={post?.linkWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-500 hover:underline"
                  >
                    {post?.linkWebsite}
                  </a>
                </div>
                <div className="flex items-center">
                  <FaFacebookSquare className="text-gray-400 mr-1" />
                  <a
                    href={post?.linkFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-500 hover:underline"
                  >
                    Facebook
                  </a>
                </div>
              </div>
              <Button
                onClick={() =>
                  dispatch(
                    modal({
                      isShowModal: true,
                      modalContent: <Booking id={pid} />,
                    })
                  )
                }
                className="bg-pink-500"
              >
                <MdForwardToInbox size={22} />
                Nhận báo giá
              </Button>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center">
                {rating?.averageStarPoint ? (
                  <span className="flex items-center">
                    {renderStarFromNumber(rating?.averageStarPoint)?.map(
                      (el, idx) => (
                        <span key={idx}>{el}</span>
                      )
                    )}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <p className="text-base text-gray-600 ml-4">
                (1 đánh giá)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <ul className="flex space-x-6 border-t border-b py-4">
          <li className="text-base font-semibold text-gray-700 cursor-pointer hover:text-blue-500 transition duration-300">
            Thông tin
          </li>
          <li className="text-base font-semibold text-gray-700 cursor-pointer hover:text-blue-500 transition duration-300">
            Dịch vụ
          </li>
          <li className="text-base font-semibold text-gray-700 cursor-pointer hover:text-blue-500 transition duration-300">
            Khuyến mãi
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-4 h-[410px] relative grid-rows-2 gap-3 mt-6">
        {albums[0] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={0} images={albums?.imageURL} />
                  ),
                })
              )
            }
            src={albums[0]?.imageURL}
            alt="avatar"
            className="col-span-2 w-full h-full row-span-2 object-cover cursor-pointer rounded-l-md"
          />
        )}
        {albums[1] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={1} images={albums?.imageURL} />
                  ),
                })
              )
            }
            src={albums[1]?.imageURL}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer"
          />
        )}
        {albums[2] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={2} images={albums?.imageURL} />
                  ),
                })
              )
            }
            src={albums[2]?.imageURL}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer rounded-tr-md"
          />
        )}
        {albums[3] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={3} images={albums?.imageURL} />
                  ),
                })
              )
            }
            src={albums[3]?.imageURL}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer"
          />
        )}
        {albums[4] && (
          <img
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <DetailImages currentImage={4} images={albums?.imageURL} />
                  ),
                })
              )
            }
            src={albums[4]?.imageURL}
            alt="avatar"
            className="col-span-1 w-full h-full row-span-1 object-cover cursor-pointer rounded-br-md"
          />
        )}
        <div
          onClick={() =>
            dispatch(
              modal({
                isShowModal: true,
                modalContent: <DetailImages images={albums?.imageURL} />,
              })
            )
          }
          className="absolute cursor-pointer bottom-6 right-8 bg-white borer-2 rounded-md border-emerald-800 gap-2 flex items-center justify-center px-4 py-2"
        >
          <AiOutlineUnorderedList />
          <span className="text-emerald-800 font-medium">
            Hiện thị tất cả ảnh
          </span>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-4 mt-6">
        <div className="col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl flex-auto flex items-center gap-3 text-pink-700 font-bold line-clamp-2">
              {rating?.averageStarPoint ? (
                <span className="flex items-center">
                  {renderStarFromNumber(rating?.averageStarPoint)?.map(
                    (el, idx) => (
                      <span key={idx}>{el}</span>
                    )
                  )}
                </span>
              ) : (
                ""
              )}

              <span>{post?.title}</span>
            </h1>
            {!wishlist?.some((n) => +n.id === +pid) ? (
              <span
                onClick={handleAddWishlist}
                className="flex-none block text-black p-1 cursor-pointer"
              >
                <FaRegHeart size={22} />
              </span>
            ) : (
              <span
                onClick={handleRemoveWishlist}
                className="flex-none block text-red-500 p-1 cursor-pointer"
              >
                <FaHeart size={22} />
              </span>
            )}
          </div>
          <span>
            Chuyên mục:{" "}
            <span className="font-semibold cursor-pointer">
              {`${post?.serviceTypeName} ${post?.addressService?.split(",")[post?.addressService?.split(",")?.length - 1]
                }`}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <GoLocation color="#1266DD" size={16} />
            <span>{post?.addressService}</span>
          </span>
          <div className="grid grid-cols-3">
            <span className="flex items-center gap-2">
              🕓<span>{moment(post?.createdDate).fromNow()}</span>
            </span>
          </div>
          <div>
            <Button
              onClick={() =>
                dispatch(
                  modal({
                    isShowModal: true,
                    modalContent: <Report id={pid} />,
                  })
                )
              }
              className="bg-orange-500"
            >
              <MdOutlineReportProblem size={22} />
              Báo cáo tin đăng
            </Button>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold my-3">Thông tin</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.information),
              }}
              className={clsx(!seeMore && "line-clamp-4")}
            ></p>
            <span
              className="text-emerald-500 hover:underline cursor-pointer"
              onClick={() => setSeeMore(!seeMore)}
            >
              Xem chi tiết
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold my-3">Bản đồ</h2>
            <span>
              Địa chỉ: <span>{post?.addressService}</span>
            </span>
            <div className="w-full h-[250px]">
              {center.length > 0 && (
                <Map center={center} address={post?.addressService} zoom={16} />
              )}
              {center.length === 0 && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rmd">
                  <span className="text-main-blue text-3xl animate-spin">
                    <CgSpinner />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="w-full flex flex-col gap-2 items-center justify-center border-2 rounded-md text-black p-4">
            <h1 className="text-xl font-bold">Yêu Cầu Báo Giá</h1>
            <InputForm
              register={register}
              errors={errors}
              id="name"
              validate={{
                required: "Trường này không được bỏ trống."
              }}
              placeholder="Tên"
              fullWidth
            />
            <InputForm
              register={register}
              errors={errors}
              id="email"
              validate={{
                required: "Trường này không được bỏ trống."
              }}
              placeholder="E-mail"
              fullWidth
            />
            <InputForm
              register={register}
              errors={errors}
              id="phoneNumber"
              validate={{
                required: "Trường này không được bỏ trống."
              }}
              placeholder="Điện thoại"
              fullWidth
            />
            <textarea
              placeholder="Bạn hãy mô tả thêm ghi chú"
              id="content"
              rows="5"
              className="form-textarea w-full rounded-md border-gray-200"
              {...register("content", { required: "Không thể bỏ trống." })}
            ></textarea>
            {errors["content"] && (
              <small className="text-xs text-red-500">
                {errors["content"]?.message}
              </small>
            )}
            <div className="mt-6 mb-6">
              <span className="">Khi bạn click vào "Nhận báo giá", nghĩa là bạn đã đồng ý với các điều khoản sử dụng của SweetDream. </span>
            </div>

            <Button onClick={handleSubmit(handleSendPriceQuote)}>Nhận Báo Giá</Button>
          </div>
          <BoxFilter
            className="flex justify-center items-center text-xl font-semibold"
            title="Dịch vụ liên quan"
            containerClassName="bg-white w-full"
          >
            {posts
              ?.filter((el, idx) => idx < 4)
              ?.map((el) => (
                <LongCard
                  containerClassName="rounded-none border-b w-full"
                  hideImage
                  key={el.id}
                  {...el}
                />
              ))}
          </BoxFilter>
        </div>
      </div>
      <div className="mt-6 bg-red-500 w-full">
        <Rating {...rating} name={post?.title} pid={post?.serviceId} />
      </div>
      <div className="mt-6">
        <h1 className="font-bold text-lg tracking-tight mb-3">
          Trao đổi và bình luận
        </h1>
        <div className="flex flex-col gap-4">
          {current ? (
            <TypeBox pid={post?.serviceId} />
          ) : (
            <span className="mb-4">
              Hãy để lại góp ý của bạn.{" "}
              <span
                onClick={() =>
                  navigate({
                    pathname: "/" + path.LOGIN,
                    search: createSearchParams({
                      redirect: location.pathname,
                    }).toString(),
                  })
                }
                className="cursor-pointer text-blue-500 hover:underline"
              >
                Đi tới đăng nhập!
              </span>
            </span>
          )}
          <Comments />
        </div>
      </div>
    </div>
  )
}
export default WithBaseTopping(DetailPost)
