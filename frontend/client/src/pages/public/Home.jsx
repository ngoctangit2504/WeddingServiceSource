import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import Navigation from "@/components/navigation/Navigation";
import Search from "@/components/search/Search";
import CustomSlider from "@/components/common/CustomSlider";
import Section from "@/components/common/Section";
import { apiGetServiceByPackageVIP } from "@/apis/service";
import ProvinceItem from "@/components/topProvince/ProvinceItem";
import { apiGetServiceByDeleted, apiGetServiceByServiceType } from "@/apis/service";
import Card from "@/components/posts/Card";
import { useDispatch, useSelector } from "react-redux"

const topProvinces = [
    {
        provinceName: "Hà Nội",
        image: "https://www.blissvn.com/Data/Sites/1/News/340/chup-anh-cuoi-ha-noi-mspace.jpg",
        totalPosts: 120,
    },
    {
        provinceName: "Hồ Chí Minh",
        image: "https://palatinostudio.com/wp-content/uploads/2021/04/chup-anh-cuoi-ha-noi-11-1.jpg",
        totalPosts: 150,
    },
    {
        provinceName: "Đà Nẵng",
        image: "https://bizweb.dktcdn.net/100/175/849/articles/tong-hop-cac-dia-diem-chup-anh-cuoi-dep-nhat-tai-ha-noi.jpg?v=1495178084687",
        totalPosts: 80,
    },
    {
        provinceName: "Hội An",
        image: "https://static.vinwonders.com/production/dia-diem-chup-anh-cuoi-dep-o-ha-noi-2.jpg",
        totalPosts: 60,
    },
    {
        provinceName: "Nha Trang",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7EPUAMVh5wHnNX1pVOxiie-i--OoaqvJSJQ&s",
        totalPosts: 90,
    },
]


const Home = () => {
    const dispatch = useDispatch()
    const [service, setSerivces] = useState()
    const [serviceVIP3, setServiceVIP3] = useState([])
    const [serviceByType, setServiceByType] = useState()
    const { wishlist } = useSelector((s) => s.user)

    const fetchHomeData = async () => {
        const response = await apiGetServiceByDeleted({ size: 8 })
        if (response?.data) setSerivces(response.data)
    }

    // const fetchServiceByVIP3Data = async () => {
    //     const packageIds = [3, 2, 1]; // Danh sách các packageId
    //     let response = null;

    //     for (const packageId of packageIds) {
    //       response = await apiGetServiceByPackageVIP({ packageId, size: 30 });

    //       if (response?.data && response.count > 0) {
    //         setServiceVIP3(response.data);
    //         break; // Dừng vòng lặp nếu có dữ liệu
    //       }
    //     }

    //     // Nếu không có dữ liệu từ bất kỳ packageId nào, bạn có thể xử lý lỗi hoặc thông báo ở đây
    //     if (!response?.data) {
    //       console.error('No data found for any packageId');
    //     }
    //   };
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
    
                // Xử lý dữ liệu cho VIP 2 và VIP 1
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
    
                if (packageId === 1) {
                    // Kết hợp dữ liệu từ VIP 1 với các dữ liệu đã có
                    allData = [...(dataVIP3 || []), ...response.data];
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
    



    const fetchServiceByTypeDate = async () => {
        const response = await apiGetServiceByServiceType({ size: 8 })
        if (response?.data) setServiceByType(response.data)
    }


    useEffect(() => {
        fetchHomeData()
        fetchServiceByTypeDate()
        fetchServiceByVIP3Data()
    }, [])

    return (
        <section className="pb-16">
            <Search />
            <div className="bg-pink-100">
                <Section
                    className="w-main mx-auto text-neutral-400"
                    title="BÀI VIẾT NỔI BẬT"
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
                title="Nhà Cung Cấp"
                contentClassName="grid grid-cols-4 gap-4"
            >
                {service?.map((el) => (
                    <Card
                        isLike={wishlist?.some((n) => n.id === el.id)}
                        {...el}
                        key={el.id}
                    />
                ))}
            </Section>
            <Section
                className="w-main mx-auto text-neutral-400"
                title="Nhà hàng tiệc cưới"
                contentClassName="grid grid-cols-4 gap-4"
            >
                {serviceByType?.map((el) => (
                    <Card
                        isLike={wishlist?.some((n) => n.id === el.id)}
                        {...el}
                        key={el.id}
                    />
                ))}
            </Section>
        </section>
    )
}
export default Home