import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import Navigation from "@/components/navigation/Navigation";
import Search from "@/components/search/Search";
import CustomSlider from "@/components/common/CustomSlider";
import Section from "@/components/common/Section";
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
    const [serviceByType, setServiceByType] = useState()
    const { wishlist } = useSelector((s) => s.user)

    const fetchHomeData = async () => {
        const response = await apiGetServiceByDeleted({ size: 8 })
        if (response?.data) setSerivces(response.data)
    }

    const fetchServiceByTypeDate = async () => {
        const response = await apiGetServiceByServiceType({ size: 8 })
        if (response?.data) setServiceByType(response.data)
    }


    useEffect(() => {
        fetchHomeData()
        fetchServiceByTypeDate()
    }, [])

    return (
        <section className="pb-16">
            <Search />
            <div className="bg-pink-100">
                <Section
                    className="w-main mx-auto text-neutral-400"
                    title="TỈNH / THÀNH PHỐ NỔI BẬT"
                >
                    <CustomSlider count={4}>
                        {topProvinces.map((el, idx) => (
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