import React, { memo, useEffect, useRef, useState } from "react"
import { Link, NavLink, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
// import avatarDefault from '@/assets/dfavatar.jpg'
import { logout } from "@/redux/userSlice"
import withBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import { menuColors } from "@/ultils/constant"
import clsx from "clsx"
import { modal, resetFilter } from "@/redux/appSlice"
import { AiOutlineHeart } from "react-icons/ai"
import Button from "../common/Button"
//import VerifyPhone from "../auth/VerifyPhone"
import Swal from "sweetalert2"
import { formatMoney } from "@/ultils/fn"
// import { apiValidManager } from "@/apis/user"
import { toast } from "react-toastify"
import Dropdown from "../dropdown/Dropdown"
import { apiGetServiceType } from "@/apis/service"
import { VerifyPhone } from ".."

const activedStyle =
  "text-sm flex gap-2 items-center px-4 py-3 rounded-l-full rounded-r-full border border-white"
const notActivedStyle =
  "text-sm flex gap-2 items-center px-4 py-3 rounded-l-full rounded-r-full border border-pink-400 hover:border-white"
const colors = menuColors[0];
const Navigation = ({ dispatch, location, navigate }) => {
  const [params] = useSearchParams()
  const [isShowOptions, setIsShowOptions] = useState(false)
  const { current, wishlist } = useSelector((state) => state.user)
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const timeoutRef = useRef(null);
  const [menu, setMenu] = useState([
    {
      path: "/danh-sach",
      name: "DỊCH VỤ CƯỚI",
      subname: "Dịch vụ cưới",
      id: "dichvucuoi",
      type: path.PHONGTRO,
      dropdownItems: [] // Khởi tạo dropdownItems là một mảng rỗng
    },
    {
      path: "/danh-sach/?type=" + path.CANHO,
      name: "KHUYỂN MÃI",
      id: "nhacanhochothue",
      type: path.CANHO,
      subname: "Nhà, Căn hộ cho thuê",
    },
    {
      path: "/danh-sach/?type=" + path.TIMOGHEP,
      name: "KINH NGHIỆM & Ý TƯỞNG",
      id: "timoghep",
      type: path.TIMOGHEP,
      subname: "Tìm ở ghép",
    },
    {
      path: "/" + path.PRICING,
      name: "BẢNG GIÁ GÓI",
      id: "banggiadichvu",
      type: path.PRICING,
      subname: "Bảng giá dịch vụ",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetServiceType();
        // Tìm mục menu có id là "dichvucuoi" và cập nhật dropdownItems từ dữ liệu API
        const updatedMenu = menu.map((item) => {
          if (item.id === "dichvucuoi") {
            return {
              ...item,
              dropdownItems: response.data.map((apiItem) => ({
                name: apiItem.name,
                path: `/${path.LIST}?service_type_id=${apiItem.id}`,
                iconURL: apiItem.iconURL
              })),
            };
          }
          return item;
        });
        // Cập nhật menu với dropdownItems từ API
        setMenu(updatedMenu);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Gọi API chỉ khi component được tạo

  const handleMouseEnter = (id) => {
    clearTimeout(timeoutRef.current);
    setHoveredMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 200);
  };

  const handleShowOptions = (e) => {
    e.stopPropagation()
    if (!isShowOptions) setIsShowOptions(true)
    else setIsShowOptions(false)
  }
  useEffect(() => {
    const handleOffOptionsExternalClick = (e) => {
      const optionsElm = document.getElementById("options")
      if (optionsElm && optionsElm?.contains(e.target)) setIsShowOptions(true)
      else setIsShowOptions(false)
    }
    window.addEventListener("click", handleOffOptionsExternalClick)

    return () => {
      window.removeEventListener("click", handleOffOptionsExternalClick)
    }
  }, [])
  const handleClickCreatePost = (pathname) => {
    if (current?.roles?.some((el) => el.name === "ROLE_SUPPLIER")) {
      navigate(pathname)
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Bạn phải xác minh SĐT mới được truy cập",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Đi xác minh",
        cancelButtonText: "Bỏ qua",
      }).then((rs) => {
        if (rs.isConfirmed) {
          dispatch(modal({ isShowModal: true, modalContent: <VerifyPhone /> }))
        }
      })
    }
  }
  const handleCheckUltilManager = async () => {
    const response = await apiValidManager()
    if (response.success) navigate(`/${path.SUPER_ADMIN}/${path.DASHBOARD}`)
    else toast.error(response.message)
    //  <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">

  }
  return (
    <div className="flex bg-white py-6 justify-center border-b-2 border-pink-200">
      <div className="w-main flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link className="text-3xl text-pink-300 font-bold" to={"/"}>
            SweetDream
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 justify-center items-center h-full">
              {!current && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/${path.LOGIN}`, { state: "LOGIN" })
                    }
                    state={"LOGIN"}
                    className="rounded-md bg-gray-100 text-sm font-medium px-6 py-2 text-pink-300"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/${path.LOGIN}`, { state: "REGISTER" })
                    }
                    state={"REGISTER"}
                    className="rounded-md bg-gray-100 text-sm font-medium px-6 py-2 text-pink-300"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
            {current && (
              <>
                {current?.roles?.some((el) => el.name === "ROLE_CUSTOMER") && (
                  <Link
                    to={`/${path.MEMBER}/${path.WISHLIST}`}
                    className="rounded-md flex items-center gap-2 text-pink-400 text-sm font-medium px-6 py-2"
                  >
                    <span className="relative">
                      {wishlist && wishlist.length > 0 && (
                        <span className="text-[8px] text-pink-400 w-3 h-3 flex items-center justify-center bg-red-500 border border-white absolute -top-2 -right-2 p-2 rounded-full">
                          {wishlist?.length || 0}
                        </span>
                      )}
                      <AiOutlineHeart size={22} />
                    </span>
                    <span>Yêu thích</span>
                  </Link>
                )}

                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-3 w-3 top-0 right-0 rounded-full bg-red-600 opacity-75"></span>
                  <span className="rounded-full absolute inline-flex h-3 w-3 top-0 right-0 bg-red-700"></span>
                  <Button
                    onClick={() =>
                      handleClickCreatePost(
                        `/${path.SUPPLIER}/${path.INFORMATION_SUPPLIER}`
                      )
                    }
                    className="text-white rounded-md flex items-center gap-2 border  bg-gradient-to-r to-main-pink from-main-rose text-sm font-medium px-6 py-2"
                  >
                    Trở Thành Nhà Cung Cấp
                  </Button>
                </div>


                {current?.roles?.some((el) => el.name === "ROLE_SUPPLIER") && (
                  <Link
                    to={`/${path.SUPPLIER}/${path.DEPOSIT}`}
                    className="text-emerald-800-300 rounded-md flex items-center gap-2 border  bg-gradient-to-r to-main-yellow from-main-orange text-sm font-medium px-6 py-2"
                  >
                    Nạp tiền
                  </Link>
                )}

                <div
                  onClick={handleShowOptions}
                  className="flex relative cursor-pointer items-center gap-2"
                >
                  {isShowOptions && (
                    <div
                      id="options"
                      className="absolute flex flex-col min-w-[150px] w-fit z-50 top-full right-0 bg-white rounded-md border text-gray-800"
                    >
                      {current?.roles?.some(
                        (el) => el.name === "ROLE_CUSTOMER"
                      ) && (
                          <Link
                            to={`/${path.MEMBER}/${path.PERSONAL}`}
                            className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium"
                          >
                            Thông tin cá nhân
                          </Link>
                        )}
                      {current?.roles?.some(
                        (el) => el.name === "ROLE_SUPPLIER"
                      ) && (
                          <Link
                            to={`/${path.SUPPLIER}/${path.INFORMATION_SUPPLIER}`}
                            className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium"
                          >
                            Quản lý dịch vụ
                          </Link>
                        )}
                      {current?.roles?.some(
                        (el) => el.name === "ROLE_ADMIN"
                      ) && (
                          <Link
                            to={`/${path.ADMIN}/${path.DASHBOARD}`}
                            className="p-3 hover:bg-gray-100 whitespace-nowrap hover:text-emerald-600 font-medium"
                          >
                            Admin
                          </Link>
                        )}
                      <span
                        onClick={() => dispatch(logout())}
                        className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium"
                      >

                        Đăng xuất
                      </span>
                    </div>
                  )}
                  <span className="text-sm flex flex-col text-pink-400">
                    <span className="font-bold">{current?.userName}</span>
                    <span>{`TK chính: ${formatMoney(
                      +current?.balance
                    )} VND`}</span>
                  </span>
                  <img
                    src={current?.profileImage || "/user.svg"}
                    alt="avatar"
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 -ml-4 text-pink-300 relative">
          {menu.map((el) => (
            <div
              key={el.id}
              onMouseEnter={() => handleMouseEnter(el.id)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <NavLink
                to={el.path}
                onClick={() => dispatch(resetFilter(true))}
                className={({ isActive }) =>
                  clsx(
                    params.get("type") === el.type ? activedStyle : notActivedStyle,
                    !params.get("type") && isActive && activedStyle
                  )
                }
              >
                <span>{el.name}</span>
              </NavLink>
              {el.dropdownItems && hoveredMenu === el.id && (
                <Dropdown
                  items={el.dropdownItems}
                  onMouseEnter={() => handleMouseEnter(el.id)}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withBaseTopping(memo(Navigation))
