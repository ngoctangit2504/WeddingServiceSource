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
