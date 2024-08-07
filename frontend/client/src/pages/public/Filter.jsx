import { apiGetServiceByDeleted, apiGetServices } from "@/apis/service"
import {
    apiGetDistricts,
    apiGetWards,
} from "@/apis/app";
import {
    BoxFilter,
    Button,
    LongCard,
    Pagination,
    SelectLib,
} from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { resetFilter } from "@/redux/appSlice"
import {
    areaOptions,
    distances,
    priceOptions,
    targets,
} from "@/ultils/constant"
import path from "@/ultils/path"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { createSearchParams, useSearchParams } from "react-router-dom"

const Filter = ({ location, navigate, dispatch }) => {
    const { provinces, isResetFilter } = useSelector((s) => s.app)
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { setValue, watch, register } = useForm()
    const [posts, setPosts] = useState()
    const [searchParams] = useSearchParams()
    const [provinceDetail, setProvinceDetail] = useState(null)
    const setCustomValue = (id, val) =>
        setValue(id, val, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })

    // Filter POST API
    const getPosts = async (formdata) => {
        const response = await apiGetServices(formdata)
        if (response) setPosts(response)
        else setPosts([])
    }


    const province = watch("province")
    const target = watch("target")
    const district = watch("district")
    const ward = watch("ward")
    const address = watch("address")

    // Lấy dữ liệu các Quận/Huyện dựa trên mã Tỉnh/Thành phố
    const getDataDistricts = async (provinceCode) => {
        const response = await apiGetDistricts(provinceCode);
        if (response.status === 200) {
            setDistricts(response.data.results);
        }
    };

    // Lấy dữ liệu các Phường/Xã dựa trên mã Quận/Huyện
    const getDataWards = async (districtCode) => {
        const response = await apiGetWards(districtCode);
        if (response.status === 200) {
            setWards(response.data.results);
        }
    };

    useEffect(() => {
        const text = clsx(
          ward?.ward_name,
          ward?.ward_name && ",",
          district?.district_name,
          district?.ndistrict_nameame && ",",
          province?.province_name
        )
        const textModified = text
          ?.split(",")
          ?.map((el) => el.trim())
          ?.join(", ")
        setCustomValue("address", textModified)
      }, [province, district, ward])

    useEffect(() => {
        if (!province) {
            setValue("district", "");
            setValue("ward", "");
            setDistricts([]);
            setWards([]);
        } else {
            getDataDistricts(province.province_id);
            setValue("district", "");
            setValue("ward", "");
        }
    }, [province, setValue]);

    useEffect(() => {
        if (!district) {
            setValue("ward", "");
            setWards([]);
        } else {
            getDataWards(district.district_id);
            setValue("ward", "");
        }
    }, [district, setValue]);


    const handleFilterRange = (type, value) => {
        const params = Object.fromEntries([...searchParams])
        if (type === "ADDRESS") {
            if (params.supplierName) {
                params.supplierName = searchParams.getAll("supplierName")
            } else delete params.supplierName
            params.address = value
        }
        navigate({
            pathname: location.pathname,
            search: createSearchParams(params).toString(),
        })
    }

    useEffect(() => {
        const formdata = new FormData()
        const { type, page, ...searchParamsObject } = Object.fromEntries([
            ...searchParams,
        ])

        formdata.append(
            "json",
            JSON.stringify({ ...searchParamsObject, status: "APPROVED" })
        )
        if (page && Number(page)) formdata.append("page", Number(page) - 1)
        formdata.append("size", 5)
        getPosts(formdata)
        dispatch(resetFilter(false))
    }, [searchParams])
    return (
        <section className="w-main mx-auto my-6 grid grid-cols-12 gap-4">
            <div className="col-span-9 flex flex-col">
                <div className="w-full flex justify-between items-center pb-4 border-b">
                    <span>{`Kết quả: ${posts?.count || 0} bài đăng`}</span>
                    <div>
                        <span>Hiển thị:</span>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2 mt-4">
                    {posts?.data?.map((el) => (
                        <LongCard {...el} key={el.id} />
                    ))}
                </div>
                <div className="my-8 flex items-center justify-end">
                    <Pagination totalCount={posts?.count} />
                </div>
            </div>
            <div className="flex flex-col gap-4 col-span-3">
                <BoxFilter title="ĐỊA ĐIỂM, VỊ TRÍ">
                    <div className="p-2 flex flex-col gap-2">
                        <SelectLib
                            className="col-span-2 text-sm"
                            onChange={(val) => setCustomValue("province", val)}
                            value={province}
                            options={provinces.results?.map((el) => ({
                                ...el,
                                value: el.province_id,
                                label: el.province_name,
                            }))}
                            placeholder="Tỉnh / Thành phố"
                        />
                        <SelectLib
                            className="col-span-2 text-sm"
                            onChange={(val) => setCustomValue("district", val)}
                            value={district}
                            options={districts?.map((el) => ({
                                ...el,
                                value: el.district_id,
                                label: el.district_name,
                            }))}
                            placeholder="Quận / Huyện"
                            disabled={!provinceDetail?.districts}
                        />
                        <SelectLib
                            className="col-span-2 text-sm"
                            onChange={(val) => setCustomValue("ward", val)}
                            value={ward}
                            options={wards?.map((el) => ({
                                ...el,
                                value: el.ward_id,
                                label: el.ward_name,
                            }))}
                            placeholder="Phường / Xã"
                            disabled={!district?.codename}
                        />
                        <div className="w-full flex gap-3 justify-end items-center">
                            <Button
                                onClick={() => handleFilterRange("ADDRESS", address)}
                                className="py-1 bg-transparent border border-emerald-600 text-emerald-600"
                            >
                                Thêm
                            </Button>
                        </div>
                    </div>
                </  BoxFilter>
                <BoxFilter title="KHÁC">
                    <div className="flex flex-col gap-2 p-2">
                        <SelectLib
                            className="text-sm"
                            onChange={(val) => setCustomValue("target", val)}
                            value={target}
                            options={targets}
                            placeholder="Đối tượng"
                        />
                        Other
                    </div>
                </BoxFilter>
            </div>
        </section>
    )
}

export default WithBaseTopping(Filter)
