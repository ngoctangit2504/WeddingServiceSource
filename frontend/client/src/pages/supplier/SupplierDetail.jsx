import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Tabs } from "antd";
import { apiGetSupplierById } from "@/apis/supplier";
import { BsFillPeopleFill, BsFillStarFill, BsShopWindow } from "react-icons/bs";
import Card from "@/components/posts/Card";
import { useSelector } from "react-redux";
import { apiGetServiceBySupplierId, apiGetServiceTypeNameBySupplierId } from "@/apis/service";
import { apiGetServices } from "@/apis/service";

const { TabPane } = Tabs;

const SupplierDetail = () => {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [services, setServices] = useState([]);
  const [countServices, setCountServices] = useState(0);
  const [serviceType, setServiceType] = useState([])
  const [isLiked, setIsLiked] = useState(false);
  const { wishlist } = useSelector((s) => s.user);
  const [serviceByType, setServiceByType] = useState([]);


  const fetchSupplierDetail = async () => {
    const response = await apiGetSupplierById(supplierId);
    if (response.success) {
      setSupplier(response.data);
    }
  };

  const fetchServiceByServiceType = async (serviceTypeName) => {
    const formdata = new FormData();

    // Chuyển đổi supplierId thành kiểu number (nếu cần thiết)
    const supplierIdLong = parseInt(supplierId, 10);

    var searchParams = {
      supplier_id: supplierIdLong,
      service_type: serviceTypeName,
    };

    formdata.append("json", JSON.stringify(searchParams))
    formdata.append("size", 20)

    const response = await apiGetServices(formdata);
    if (response) setServiceByType(response.data);
    else setServiceByType([])
  }

  const fetchServiceTypeName = async () => {
    const response = await apiGetServiceTypeNameBySupplierId(supplierId)
    if (response.success) {
      setServiceType(response.data);
    }
  };

  const fetchSupplierServices = async () => {
    const response = await apiGetServiceBySupplierId(supplierId, { size: 100 });
    if (response?.data) setServices(response.data);
    setCountServices(response?.count)
  };

  const handleTabClick = (key) => {
    if (key !== "1") {
      const selectedServiceType = serviceType[key - 2];
      if (selectedServiceType) {
        fetchServiceByServiceType(selectedServiceType.serviceTypeName);
      }
    }
  };
  const handleFollowClick = async () => {
    if (isLiked) {
      await apiUnfollowSupplier(supplierId);
      setIsLiked(false);
    } else {
      await apiFollowSupplier(supplierId);
      setIsLiked(true);
    }
  };

  useEffect(() => {
    fetchSupplierDetail();
    fetchServiceTypeName();
  }, [supplierId]);

  useEffect(() => {
    fetchSupplierServices();
  }, []);


  if (!supplier) return <div>Loading...</div>;

  return (
    <div className="view-shop">
      <div className="flex justify-center">
        <div className="w-4/5 mt-8 mb-20">
          <div className="flex items-center p-6 bg-rose-300 rounded-md shadow-lg">
            <div className="w-2/5 bg-rose-200 p-6 rounded-lg mr-12">
              <div className="flex items-center">
                <img
                  src={supplier.logo || ""}
                  alt={supplier.name}
                  className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
                />
                <h2 className="ml-6 text-2xl text-white font-semibold capitalize">
                  {supplier.name}
                </h2>
              </div>
              <div className="flex mt-6">
                <button
                  className="w-1/2 py-3 mr-2 bg-white text-rose-700 font-bold rounded-lg uppercase hover:bg-rose-600 hover:text-white transition-colors"
                  onClick={handleFollowClick}
                >
                  {isLiked ? "Hủy theo dõi" : "Theo dõi"}
                </button>
                <button className="w-1/2 py-3 bg-white text-rose-700 font-bold rounded-lg uppercase hover:bg-rose-600 hover:text-white transition-colors">
                  Chat
                </button>
              </div>
            </div>
            <div className="flex-1 text-lg font-semibold text-white space-y-4">
              <div className="flex items-center">
                <BsShopWindow className="text-2xl mr-4" />
                Dịch Vụ: <span className="text-yellow-400 ml-2">{countServices}</span>
              </div>
              <div className="flex items-center">
                <BsFillPeopleFill className="text-2xl mr-4" />
                Người Theo Dõi: <span className="text-yellow-400 ml-2">{supplier?.follower}</span>
              </div>
              <div className="flex items-center">
                <BsFillStarFill className="text-2xl mr-4" />
                Đánh Giá: <span className="text-yellow-400 ml-2">4.8</span>
              </div>
            </div>
          </div>
          <div className="mt-16 mx-4">
            <Tabs defaultActiveKey="1" onTabClick={handleTabClick}>
              <TabPane tab="TẤT CẢ DỊCH VỤ" key="1">
                <Row gutter={[24, 24]}>
                  {services?.map((el) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={el.id}>
                      <Card
                        isLike={wishlist?.some((n) => n.id === el.id)}
                        {...el}
                      />
                    </Col>
                  ))}
                </Row>
              </TabPane>
              {serviceType.map((cate, idx) => {
                return (
                  <TabPane tab={cate.serviceTypeName} key={idx + 2}>
                    <Row gutter={[24, 24]}>
                      {serviceByType.map((item) => (
                        <Col span={6} className="item-col" key={item.id}>
                          <Card {...item} />
                        </Col>
                      ))}
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
