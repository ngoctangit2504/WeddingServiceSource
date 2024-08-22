import React, { useEffect, useState, useCallback } from "react";
import Search from "@/components/search/Search";
import CustomSlider from "@/components/common/CustomSlider";
import Section from "@/components/common/Section";
import { apiGetServiceByPackageVIP } from "@/apis/service";
import ProvinceItem from "@/components/topProvince/ProvinceItem";
import { apiGetServiceByDeleted, apiGetServiceBySuggested, apiGetServiceByPackageVIP1AndVIP2 } from "@/apis/service";
import { apiCheckTransactionServicePackageIsExpired } from "@/apis/supplier"
import Card from "@/components/posts/Card";
import { useDispatch, useSelector } from "react-redux"
import { VideoPlayer } from "@/components";
import { ImageSlider } from "@/components";
import { ServiceTypeGrid, Pagination } from "@/components";
import { useSearchParams } from "react-router-dom"



const Home = () => {
    const dispatch = useDispatch()
    const [service, setSerivces] = useState()
    const [serviceFollow, setServiceFollow] = useState()
    const [serviceVIP3, setServiceVIP3] = useState([])
    const [serviceVIP1And2, setServiceVIP1And2] = useState([])
    const [countServiceVIP1And2, setCountServiceVIP1And2] = useState(0)
    const [serviceSuggested, setServiceSuggested] = useState([])
    const { wishlist } = useSelector((s) => s.user)
    const [searchParams] = useSearchParams()
    const [update, setUpdate] = useState(false)


    const render = useCallback(() => {
        setUpdate(!update)
      }, [update])

    const fetchHomeData = async () => {
        const response = await apiGetServiceByDeleted({ size: 8 })
        if (response?.data) setSerivces(response.data)
    }

    const fetchServicesVip1And2 = async (searchParamsObject) => {
        const response = await apiGetServiceByPackageVIP1AndVIP2(searchParamsObject);
        if(response.data){
            setServiceVIP1And2(response.data)
            setCountServiceVIP1And2(response.count)
        }
    }

    const fetchServiceByVIP3Data = async () => {
        const packageIds = [3, 2, 1]; // Danh sách các packageId
        let response = null;
        let allData = []; // Mảng lưu trữ tất cả dữ liệu tìm thấy
        let dataVIP3 = null; // Dữ liệu của VIP 3

        for (const packageId of packageIds) {
            response = await apiGetServiceByPackageVIP({ packageId, size: 30 });

            if (response?.data) {
                // Xử lý dữ liệu cho VIP 3
                if (packageId === 3) {
                    if (response.count >= 5) {
                        // Nếu số lượng dữ liệu từ VIP 3 đủ lớn, lưu và dừng kiểm tra thêm
                        setServiceVIP3(response.data);
                        return; // Dừng hàm nếu đã tìm thấy dữ liệu đủ cho VIP 3
                    } else {
                        // Lưu dữ liệu nếu số lượng nhỏ hơn 5 và tiếp tục kiểm tra các gói khác
                        dataVIP3 = response.data;
                    }
                }

                // Xử lý dữ liệu cho VIP 2
                if (packageId === 2) {
                    if (response.count >= 5) {
                        // Nếu số lượng dữ liệu từ VIP 2 đủ lớn, kết hợp với dữ liệu từ VIP 3 nếu có
                        allData = [...(dataVIP3 || []), ...response.data];
                        setServiceVIP3(allData);
                        return; // Dừng hàm nếu đã tìm thấy dữ liệu đủ cho VIP 2
                    } else {
                        // Lưu dữ liệu nếu số lượng nhỏ hơn 5 và tiếp tục kiểm tra gói VIP 1
                        allData = [...(dataVIP3 || []), ...response.data];
                    }
                }

                // Xử lý dữ liệu cho VIP 1
                if (packageId === 1) {
                    // Kết hợp dữ liệu từ VIP 1 với các dữ liệu đã có
                    allData = [...allData, ...response.data];
                    setServiceVIP3(allData);
                    return; // Dừng hàm sau khi đã xử lý gói VIP 1
                }
            }
        }

        // Nếu không có dữ liệu từ bất kỳ packageId nào, bạn có thể xử lý lỗi hoặc thông báo ở đây
        if (allData.length === 0) {
            console.error('No data found for any packageId');
        }
    };

    const fetchServiceBySuggested = async () => {
        const response = await apiGetServiceBySuggested({ size: 8 })
        if (response?.data) setServiceSuggested(response.data)
    }

    const checkTransactionServicePackageIsExpired = async () => {
        try {
            const response = await apiCheckTransactionServicePackageIsExpired();
            if (response.status === 200) {
                console.log("Transaction package is valid.");
            } else {
                console.log("Transaction package has expired or not found.");
            }
        } catch (error) {
            console.error("Error checking transaction service package:", error);
        }
    };

    useEffect(() => {
        const { page, ...searchParamsObject } = Object.fromEntries([
            ...searchParams,
        ])
        if (page && Number(page)) searchParamsObject.page = Number(page) - 1
        else searchParamsObject.page = 0
        searchParamsObject.size = 8
        fetchServicesVip1And2(searchParamsObject)
    }, [update, searchParams])


    useEffect(() => {
        fetchHomeData()
        fetchServiceBySuggested()
        checkTransactionServicePackageIsExpired()
        fetchServiceByVIP3Data()
    }, [])


    const images = [
        "https://matchthemes.com/demohtml/tilia/images/pages/img-about1.jpg",
        "https://matchthemes.com/demohtml/tilia/images/pages/portfolio1-page.jpg",
        "https://matchthemes.com/demohtml/tilia/images/home/slider-1.jpg",
        "https://matchthemes.com/demohtml/tilia/images/home/slider-2.jpg",
    ];

    return (
        <section className="pb-16">
            <Search />
            <div className="bg-pink-100">
                <Section
                    className="w-main mx-auto text-neutral-400"
                    title="DỊCH VỤ NỔI BẬT"
                >
                    <CustomSlider count={4}>
                        {serviceVIP3.map((el, idx) => (
                            <ProvinceItem key={idx} {...el} />
                        ))}
                    </CustomSlider>

                </Section>
            </div>
            <Section
                className="w-main mx-auto text-neutral-400"
                title="Gợi ý dành riêng cho bạn"
                contentClassName="grid grid-cols-4 gap-4"
            >
                {serviceSuggested?.map((el) => (
                    <Card
                        isLike={wishlist?.some((n) => n.id === el.id)}
                        {...el}
                        key={el.id}
                    />
                ))}
            </Section>

            <Section
                className="w-full h-screenflex items-center justify-center bg-[#f9f5f3] mt-20 mb-16" // Full height and center content
                contentClassName="flex justify-center"
            >
                <div>
                    <ImageSlider images={images} />
                </div>
            </Section>


            {/* Dịch vụ khác */}
            <Section
                className="w-main mx-auto text-neutral-400"
                title="Dịch vụ khác"
                contentClassName="grid grid-cols-1 gap-4"
            >
                <div className="grid grid-cols-4 gap-4 mt-6 w-full">
                    {serviceVIP1And2?.map((el) => (
                        <Card
                            isLike={wishlist?.some((n) => n.id === el.id)}
                            id={el.id}
                            image={el.image}
                            title={el.title}
                            address={el.address}
                            createdDate={el.createdDate}
                            key={el.id}
                        />
                    ))}
                </div>

                <div className="mt-6 col-span-4">
                    <Pagination totalCount={countServiceVIP1And2 || 1} />
                </div>
            </Section>

            <Section
                className="w-main mx-auto text-neutral-400"
                title="Các dịch vụ tiệc cưới"
                contentClassName="grid grid-cols-1 gap-4"
            >
                <ServiceTypeGrid />
            </Section>

            <Section
                className="w-full h-screenflex items-center justify-center bg-[#f9f5f3] mt-20 mb-16" // Full height and center content
                contentClassName="flex justify-center"
            >
                <VideoPlayer
                    videoSrc="https://www.youtube.com/embed/3UdRzxr8hhM?rel=0&autoplay=1"
                    title="Happy Ending"
                />
            </Section>
        </section>
    )
}
export default Home