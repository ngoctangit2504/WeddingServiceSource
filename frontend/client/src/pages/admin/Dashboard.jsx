import { Title } from "@/components"
import { Fragment, useState, useEffect } from "react"
import { PieChart } from 'react-minimal-pie-chart';
import { Line } from 'react-chartjs-2';
import axios from "axios"
import { apiTransactionStatus, apiPostStatus, apiPaymentTransactionStatus, apiUserStatus, } from "@/apis/dashboard"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { data } from "autoprefixer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {

  const [postStatusPercent, setPostStatusPercent] = useState([]);
  const [userStatusPercent, setUserStatusPercent] = useState([]);
  const [orderLabelData, setOrderLabelData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const [paymentTransactionLabelData, setPaymentTransactionLabelData] = useState([]);
  const [paymentTransactionData, setPaymentTransactionData] = useState([]);


  
  const dataCircleChart = [
    { value: postStatusPercent[0], color: '#3cb371' }, // Approved color
    { value: postStatusPercent[1], color: '#ff0000' }, // Rejected color
    { value: postStatusPercent[2], color: '#0096889c' }, // Review color
    { value: 100 - postStatusPercent[0] - postStatusPercent[1] - postStatusPercent[2], color: '#5858580f' }, // Background color
  ];

  const dataUserCircleChart = [
    // { value: userStatusPercent[0], color: '#ff0000' }, // totalAccount
    { value: userStatusPercent[1], color: '#3cb371' }, // percent user
    // { value: userStatusPercent[2], color: '#3cb371' }, // totalUser
    { value: userStatusPercent[3], color: '#0000ff' }, // percentManage
    // { value: userStatusPercent[4], color: '#ee82ee' }, //  totalManage
    // { value: userStatusPercent[5], color: '#6a5acd' }, // percentUltiManage
    // { value: userStatusPercent[6], color: '#0096889c' }, // totalUltimange
    { value: 100 - userStatusPercent[1] - userStatusPercent[3] , color: '#5858580f' }, // Background color
  ];

  const dataLineChart = {
    labels: orderLabelData,
    datasets: [
      {
        label: 'Doanh thu',
        data: orderData,
        borderColor: '#3b82f6',
        backgroundColor: '#1e40af',
      }
    ],
  };

  const dataLineChartPaymentTransaction = {
    labels: paymentTransactionLabelData,
    datasets: [
      {
        label: 'Doanh thu',
        data: paymentTransactionData,
        borderColor: '#3b82f6',
        backgroundColor: '#1e40af',
      }
    ],
  };

  var [callApi, setcallApi] = useState(true);

  useEffect(() => {
    // Gọi API và cập nhật state khi component được render
    apiPostStatus()
      .then(data => {
        const { percentApproved, percentRejected, percentReview } = data;
        console.log("percentApproved: " + percentApproved);
        // Update state
        setPostStatusPercent([percentApproved, percentRejected, percentReview]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error as needed
      });

    apiUserStatus()
      .then(data => {
        const { totalAccount, percentUser, totalUser, percentManage, totalManage, percentUltiManage, totalUltiManage } = data;
        console.log(data);
        setUserStatusPercent([totalAccount, percentUser, totalUser, percentManage, totalManage, percentUltiManage, totalUltiManage]);
      })
      .catch(error => {
        console.log('Error fetching data: ', error);
      });

    apiTransactionStatus().then((orderStatus) => {
      setOrderData(orderStatus.map(entry => entry.total))
      setOrderLabelData(orderStatus.map(entry => 'Tháng ' + entry.month))
    })

    apiPaymentTransactionStatus().then((orderStatus) => {
      setPaymentTransactionData(orderStatus.map(entry => entry.total))
      setPaymentTransactionLabelData(orderStatus.map(entry => 'Tháng ' + entry.month))
    })
  }, [callApi]);


  //   apiTransactionStatus().then((transactionStatusPayment) => {
  //     setTransactionPaymentData(transactionStatusPayment)
  //   })

  // }, [callApi]);


  const reLoad = () => {
    setcallApi(!callApi)
  }

return (
  <div>
    <Title title="Thống kê"></Title>
    <div className="grid grid-cols-2 grid-rows-2">
      <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
        <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
          <h1 className="text-2xl font-bold text-[#73879E] px-2">Trạng thái bài viết dịch vụ</h1>
        </div>
        <div className="grid grid-cols-2 w-full px-2">
          <PieChart className="px-4"
            data={dataCircleChart}
            style={{ width: '240px', height: '240px' }} // Adjust the size as needed
            startAngle={-90}
            animate
          />
          <div className="flex flex-col pt-5">
            <span className="text-sm font-semibold text-[white] rounded-full bg-[#37d4b29c] px-3 py-2 mb-2 text-center min-w-[6rem]">Đang sử lý</span>
            <span className="text-sm font-semibold text-[black] border rounded-full bg-[#3cb371] px-3 py-2 mb-2 text-center min-w-[6rem]">Chấp nhận</span>
            <span className="text-sm font-semibold text-[black] border rounded-full bg-[#ff0000] px-3 py-2 mb-2 text-center min-w-[6rem]">Từ chối</span>
          </div>
        </div>
        <div className="flex space-x-2 ml-7">
          <div className="flex-1 border border-[#E6E9ED] rounded-full bg-[#37d4b29c] flex items-center justify-center">
            <span className="py-2 text-center text-[white] text-sm font-semibold">{postStatusPercent[2]}%</span>
          </div>
          <div className="flex-1 border border-[#E6E9ED] rounded-full bg-[#3cb371] flex items-center flex items-center justify-center">
            <span className="py-2 text-center text-[white] text-sm font-semibold">{postStatusPercent[0]}%</span>
          </div>
          <div className="flex-1 border border-[#E6E9ED] rounded-full bg-[#ff0000] flex items-center flex items-center justify-center">
            <span className="py-2 text-center text-[white] text-sm font-semibold">{postStatusPercent[1]}%</span>
          </div>
        </div>
      </div>
      <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
        <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
          <h1 className="text-2xl font-bold text-[#73879E] px-2">Trạng thái tài khoản người dùng</h1>
        </div>
        <div className="grid grid-cols-2 w-full px-2">
          <PieChart className="px-4"
            data={dataUserCircleChart}
            style={{ width: '240px', height: '240px' }} // Adjust the size as needed
            startAngle={-90}
            animate
          />
          <div className="flex flex-col pt-5">
            <span className="text-sm font-semibold text-[white] rounded-full bg-[#3cb371] px-3 py-2 mb-2 text-center min-w-[6rem]">Thành viên</span>
            <span className="text-sm font-semibold text-[black] border rounded-full bg-[#0000ff] px-3 py-2 mb-2 text-center min-w-[6rem]">Nhà cung cấp</span>
          </div>
        </div>
        <div className="flex space-x-2 ml-7">
          <div className="flex-1 border border-[#E6E9ED] rounded-full bg-[#3cb371] flex items-center justify-center">
            <span className="py-2 text-center text-[white] text-sm font-semibold">{userStatusPercent[2]} account</span>
          </div>
          <div className="flex-1 border border-[#E6E9ED] rounded-full bg-[#0000ff] flex items-center flex items-center justify-center">
            <span className="py-2 text-center text-[white] text-sm font-semibold">{userStatusPercent[4]} account</span>
          </div>
        </div>
      </div>
      <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
        <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
          <h1 className="text-2xl font-bold text-[#73879E] px-2">Doanh thu dịch vụ gói dịch vụ</h1>
        </div>
        <div>
          <Line data={dataLineChart} />
        </div>
      </div>
      <div className="mx-2 my-2 border border-[#E6E9ED] rounded-md shadow">
        <div className="border-b-2 border-[#E6E9ED] mx-4 py-2">
          <h1 className="text-2xl font-bold text-[#73879E] px-2">Doanh thu nạp tiền vào hệ thống</h1>
        </div>
        <div>
          <Line data={dataLineChartPaymentTransaction} />
        </div>
      </div>
    </div>
  </div>
)
}

export default Dashboard
