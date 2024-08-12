import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Login from "./pages/public/Login"
import Home from "./pages/public/Home"
import Loading from './components/common/Loading.jsx';
import Modal from "./components/common/Modal"
import path from "./ultils/path"
import { getCurrent, getWishlist, getProvinces } from "./redux/action"
import Layout from "./pages/public/layout"
import LayoutMember from "./pages/member/LayoutMember"
import Wishlist from "./pages/member/Wishlist"
import Personal from "./pages/member/Personal"
import LayoutSupplier from "./pages/supplier/LayoutSupplier"
import VerifyOtpUpgradeRole from "./pages/member/VerifyOtpUpgradeRole"
import InforSupplier from "./pages/supplier/InforSupplier"
import Filter from "./pages/public/Filter"
import DetailService from "./pages/public/DetailService"
import Deposit from "./pages/supplier/Deposit"
import PaymentResult from "./pages/public/PaymentResult"
import HistoriesPayment from "./pages/supplier/HistoriesPayment"
import ManageDeposit from "./pages/supplier/ManageDeposit"
import ManageService from "./pages/supplier/ManageService"
import CreateService from "./pages/supplier/CreateService"
import Pricing from "./pages/public/Pricing"
import SupplierDetail from "./pages/supplier/SupplierDetail"
import Dashboard from "./pages/admin/Dashboard"
import LayoutAdmin from "./pages/admin/LayoutAdmin"
import ManageServices from "./pages/admin/ManageServices"
import ManageUser from "./pages/admin/ManageUser"
import ManagePricing from "./pages/admin/ManagePricing"
import CreatePricing from "./pages/admin/CreatePricing"
import ManagePayment from "./pages/admin/ManagePayment"
import ManageReport from "./pages/admin/ManageReport"


function App() {
  const { isLoading, isShowModal, modalContent } = useSelector(
    (state) => state.app
  )

  const { token } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProvinces())
  }, [])
  useEffect(() => {
    setTimeout(() => {
      dispatch(getCurrent())
      if (token) dispatch(getWishlist())
    }, 800)
  }, [token])

  return (
    <>
      {isShowModal && <Modal>{modalContent}</Modal>}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bottom-0 bg-overlay-70 flex justify-center items-center">
          <Loading />
        </div>
      )}
      <Routes>
        <Route path={path.LAYOUT} element={<Layout />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.VERIFY_PHONE} element={<VerifyOtpUpgradeRole />} />
          <Route path={path.LIST} element={<Filter />} />
          <Route path={path.DETAIL_POST__PID__TITLE} element={<DetailService />} />
          <Route path={path.INVALID} element={<Home />} />
          <Route path={path.PRICING} element={<Pricing />} />
          <Route path={path.SUPPLIER_DETAIL__SID__NAME} element={<SupplierDetail />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />
        {/* Member routes */}
        <Route path={path.MEMBER} element={<LayoutMember />}>
          <Route path={path.WISHLIST} element={<Wishlist />} />
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route>
        {/* Supplier routes */}
        <Route path={path.SUPPLIER} element={<LayoutSupplier />}>
          <Route path={path.INFORMATION_SUPPLIER} element={<InforSupplier />} />
          <Route path={path.DEPOSIT} element={<Deposit />} />
          <Route path={path.HISTORIES_PAYMENT} element={<HistoriesPayment />} />
          <Route path={path.MANAGE_DEPOSIT} element={<ManageDeposit />} />
          <Route path={path.MANAGE_SERVICE} element={<ManageService />} />
          <Route path={path.CREATE_SERVICE} element={<CreateService />} />
        </Route>

        {/* Admin routes */}
        <Route path={path.ADMIN} element={<LayoutAdmin />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_SERVICES_ALL} element={<ManageServices />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_PRICING} element={<ManagePricing />} />
          <Route path={path.CREATE_PRICING} element={<CreatePricing />} />
          <Route path={path.MANAGER_PAYMENT} element={<ManagePayment />} />
          <Route path={path.MANAGE_REPORT} element={<ManageReport />} />
        </Route>

        <Route path={path.PAYMENT_RESULT} element={<PaymentResult />} />

      </Routes>



      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
