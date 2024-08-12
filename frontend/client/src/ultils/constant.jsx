import {
  BsFilePerson,
  BsPostcard,
  BsFillPieChartFill,
  BsFillHouseGearFill,
  BsDropletHalf,
  BsCashCoin,
  BsStack,
} from "react-icons/bs"
import {
  AiFillDashboard,
  AiFillDollarCircle,
  AiFillMoneyCollect,
  AiOutlineDashboard,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai"
import path from "./path"
import { FcUpRight } from "react-icons/fc"
import {
  MdOutlineAttachMoney,
  MdHistory,
  MdReportGmailerrorred,
} from "react-icons/md"
import {
  RiFileEditLine,
  RiShareForwardFill,
  RiPriceTag2Line,
} from "react-icons/ri"

export const menuColors = [
  {
    'text-color': 'text-pink-400',
    'background-color': 'text-pink-800'
  }
];

export const menu = [];

export const targets = [
  {
    value: "1",
    name: "Nam",
    label: "Nam",
  },
  {
    value: "2",
    name: "Nữ",
    label: "Nữ",
  },
  {
    value: "0",
    name: "Tất cả",
    label: "Tất cả",
  },
]
export const supplierSidebar = [
  {
    id: 1834,
    name: "Thông tin nhà cung cấp ",
    path: `/${path.SUPPLIER}/${path.INFORMATION_SUPPLIER}`,
    icon: <BsPostcard size={20} />,
    type: "SINGLE",
  },
  {
    id: 1234,
    name: "Quản lý dịch vụ",
    path: `/${path.SUPPLIER}/${path.MANAGE_SERVICE}`,
    icon: <BsPostcard size={20} />,
    type: "SINGLE",
  },
  {
    id: 578,
    name: "Nạp tiền",
    path: `/${path.SUPPLIER}/${path.DEPOSIT}`,
    icon: <AiFillDollarCircle size={20} />,
    type: "SINGLE",
  },
  {
    id: 5738,
    name: "Lịch sử nạp tiền",
    path: `/${path.SUPPLIER}/${path.MANAGE_DEPOSIT}`,
    icon: <MdOutlineAttachMoney size={20} />,
    type: "SINGLE",
  },
  {
    id: 57438,
    name: "Lịch sử thanh toán",
    path: `/${path.SUPPLIER}/${path.HISTORIES_PAYMENT}`,
    icon: <MdHistory size={20} />,
    type: "SINGLE",
  },
  {
    id: 24242,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const adminSidebar = [
  {
    id: 5,
    name: "Thống kê",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <AiOutlineDashboard size={20} />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: "Quản lý dịch vụ bài viết",
    icon: <BsPostcard size={20} />,
    type: "SINGLE",
    path: `/${path.ADMIN}/${path.MANAGE_SERVICES_ALL}`,
  },
  {
    id: 4,
    name: "Quản lý thành viên",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <AiOutlineUser size={20} />,
    type: "SINGLE",
  },
  {
    id: 573238,
    name: "Quản lý giá gói dịch vụ",
    path: `/${path.ADMIN}/${path.MANAGE_PRICING}`,
    icon: <RiPriceTag2Line size={20} />,
    type: "SINGLE",
  },
  {
    id: 576538,
    name: "Quản lý thanh toán",
    path: `/${path.ADMIN}/${path.MANAGER_PAYMENT}`,
    icon: <RiPriceTag2Line size={20} />,
    type: "SINGLE",
  },
  {
    id: 5733238,
    name: "Quản lý báo cáo vi phạm",
    path: `/${path.ADMIN}/${path.MANAGE_REPORT}`,
    icon: <MdReportGmailerrorred size={20} />,
    type: "SINGLE",
  },
  {
    id: 2,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const memberSidebar = [
  {
    id: 1,
    name: "Thông tin cá nhân",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <BsFilePerson size={20} />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: "Danh sánh yêu thích",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <AiOutlineHeart size={20} />,
    type: "SINGLE",
  },

  {
    id: 2,
    name: "Tới Homepage",
    path: `/`,
    icon: <RiShareForwardFill size={20} />,
    type: "SINGLE",
  },
]
export const cities = [
  {
    image: "/hanoi.jpg",
    name: "Hà Nội",
    postCounter: 9845,
    id: 2,
  },
  {
    image: "/danang.jpg",
    name: "Đà nẵng",
    postCounter: 255,
    id: 1,
  },
  {
    image: "/hochiminh.jpg",
    name: "Hồ Chí Minh",
    postCounter: 742,
    id: 3,
  },
  {
    image: "/thuathienhue.jpg",
    name: "Thừa Thiên Huế",
    postCounter: 4747,
    id: 4,
  },
]
export const stars = [
  {
    name: "1 sao",
    label: "1 sao",
    value: 1,
  },
  {
    name: "2 sao",
    label: "2 sao",
    value: 2,
  },
  {
    name: "3 sao",
    label: "3 sao",
    value: 3,
  },
  {
    name: "4 sao",
    label: "4 sao",
    value: 4,
  },
  {
    name: "5 sao",
    label: "5 sao",
    value: 5,
  },
]
export const statuses = [
  {
    name: "Thành công",
    label: "Thành công",
    value: "APPROVED",
  },
  {
    name: "Đang xử lý",
    label: "Đang xử lý",
    value: "REVIEW",
  },
  {
    name: "Từ chối",
    label: "Từ chối",
    value: "REJECTED",
  },
]
export const areaOptions = [
  {
    value: "Dưới 20 m²",
    min: 0,
    max: 19.99,
    type: "AREA",
  },
  {
    value: "Từ 20 - 30 m²",
    min: 20,
    max: 30,
    type: "AREA",
  },
  {
    value: "Từ 30 - 50 m²",
    min: 30,
    max: 50,
    type: "AREA",
  },
  {
    value: "Từ 50 - 70 m²",
    min: 50,
    max: 70,
    type: "AREA",
  },
  {
    value: "Từ 70 - 90 m²",
    min: 70,
    max: 90,
    type: "AREA",
  },
  {
    value: "Trên 90 m²",
    min: 90.01,
    max: 999999999999,
    type: "AREA",
  },
]
export const distances = [
  {
    label: "Dưới 500m",
    name: "Dưới 500m",
    value: [0, 500],
  },
  {
    label: "Từ 500m - 1km",
    name: "Từ 500m - 1km",
    value: [500, 1000],
  },
  {
    label: "Từ 1km - 3km",
    name: "Từ 1km - 3km",
    value: [1000, 3000],
  },
  {
    label: "Từ 3km - 5km",
    name: "Từ 3km - 5km",
    value: [3000, 5000],
  },
  {
    label: "Trên 5km",
    name: "Trên 5km",
    value: [5000, 99999999],
  },
]
export const priceOptions = [
  {
    value: "Dưới 1 triệu",
    min: 0,
    max: 999999,
    type: "PRICE",
  },
  {
    value: "Từ 1 - 2 triệu",
    min: 1000000,
    max: 2000000,
    type: "PRICE",
  },
  {
    value: "Từ 2 - 3 triệu",
    min: 2000000,
    max: 3000000,
    type: "PRICE",
  },
  {
    value: "Từ 3 - 5 triệu",
    min: 3000000,
    max: 5000000,
    type: "PRICE",
  },
  {
    value: "Từ 5 - 7 triệu",
    min: 5000000,
    max: 7000000,
    type: "PRICE",
  },
  {
    value: "Từ 7 - 10 triệu",
    min: 7000000,
    max: 10000000,
    type: "PRICE",
  },
  {
    value: "Từ 10 - 15 triệu",
    min: 10000000,
    max: 15000000,
    type: "PRICE",
  },
  {
    value: "Trên 15 triệu",
    min: 15000000,
    max: 999999999999,
    type: "PRICE",
  },
]
// supplierData.js
export const suppliers = [
  { id: 1, value: 'Supplier A' },
  { id: 2, value: 'Supplier B' },
  { id: 3, value: 'Supplier C' },
  { id: 4, value: 'Supplier D' },
  { id: 5, value: 'Supplier E' },
];