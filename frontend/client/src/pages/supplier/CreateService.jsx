import {
    Button,
    InputForm,
    Map,
    SelectLib,
    TextField,
    Title,
} from "@/components"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { useSelector } from "react-redux"
import clsx from "clsx"
import useDebounce from "@/hooks/useDebounce"
import {
    apiGetLngLatFromAddress,
    apiGetDistricts,
    apiGetWards,
} from "@/apis/app";
import { apiGetServiceType, apiCreateNewService } from "@/apis/service"
import { toast } from "react-toastify"
import { getBase64 } from "@/ultils/fn"
import path from "@/ultils/path"
import { ImBin } from "react-icons/im"
import { stringify } from "postcss"

const CreateService = ({ navigate }) => {
    const {
        formState: { errors },
        watch,
        register,
        getValues,
        reset,
        setValue,
        handleSubmit: validate,
    } = useForm()
    const { provinces } = useSelector((state) => state.app)
    const [postTypes, setPostTypes] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [center, setCenter] = useState(null)
    const [zoom, setZoom] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [imagesBase64, setImagesBase64] = useState([])
    const [imageHover, setImageHover] = useState()
    const [avtImgFile, setAvtImgFile] = useState(null);
    const [rotation, setRotation] = useState("");

    const province = watch("province")
    const district = watch("district")
    const ward = watch("ward")
    const serviceTypeId = watch("serviceTypeId")
    const images = watch("images")
    const address = watch("address")
    const street = watch("street")
    const information = watch("information")
    const fetLngLat = async (payload) => {
        const response = await apiGetLngLatFromAddress(payload)
        if (response.status === 200)
            setCenter([
                response.data?.features[0]?.properties?.lat,
                response.data?.features[0]?.properties?.lon,
            ])
        setRotation(response.data?.features[0]?.properties?.lat + "," + response.data?.features[0]?.properties?.lon);
        console.log("Lat center: ", response.data?.features[0]?.properties?.lat);
        console.log("lon center: ", response.data?.features[0]?.properties?.lon);

    }
    const convertFileToBase64 = async (file) => {
        const base64 = await getBase64(file)
        if (base64) setImagesBase64((prev) => [...prev, base64])
    }
    useEffect(() => {
        setImagesBase64([])
        if (images && images instanceof FileList)
            for (let file of images) convertFileToBase64(file)
    }, [images])


    // Update the avatar image file
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvtImgFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
        }
    };

    const fetchPostTypes = async () => {
        const response = await apiGetServiceType()
        setPostTypes(response.data || [])
    }
    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition((rs) => {
            if (rs && rs.coords) {
                const ps = [rs.coords.latitude, rs.coords.longitude]
                setCenter(ps)
            }
        })
        fetchPostTypes()
    }, [])

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
    const debounceValue = useDebounce(street, 800)
    useEffect(() => {
        const lengthAddress = Object.values({
            province: province?.province_name,
            street,
            ward: ward?.ward_name,
            district: district?.district_name,
        }).filter((el) => !el === false).length
        if (lengthAddress > 2) setZoom(14)
        else setZoom(12)
        const text = clsx(
            debounceValue,
            debounceValue && ",",
            ward?.ward_name,
            ward?.ward_name && ",",
            district?.district_name,
            district?.district_name && ",",
            province?.province_name
        )
        const textModified = text
            ?.split(",")
            ?.map((el) => el.trim())
            ?.join(", ")
        setValue("address", textModified)
        if (textModified)
            fetLngLat({
                text: textModified,
                apiKey: import.meta.env.VITE_MAP_API_KEY,
            })
    }, [province, district, ward, debounceValue])

    const removeFileFromFileList = (index, filesId) => {
        const dt = new DataTransfer()
        const input = document.getElementById(filesId)
        const { files } = input

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (index !== i) dt.items.add(file) // here you exclude the file. thus removing it.
        }
        setValue("images", dt.files)
        // input.files = dt.files
    }
    // Handle Submit Form
    const handleSubmit = async () => {
        const {
            street,
            ward,
            district,
            province,
            serviceTypeId,
            images,
            title,
            information,
            linkFacebook,
            linkWebsite,
            avtImgBase64,
            ...dto
        } = getValues()
        const payload = {
            title,
            information,
            address,
            linkWebsite,
            linkFacebook,
            rotation,
            serviceTypeId: serviceTypeId?.id,
            ...dto,
        }
        // setIsLoading(true)
        const formData = new FormData()
        formData.append("serviceDto", JSON.stringify(payload))
        if (images && images instanceof FileList) {
            for (let image of images) formData.append("albums", image)
        }

        if (avtImgFile) {
            formData.append("images", avtImgFile);
        }
        setIsLoading(true)
        const response = await apiCreateNewService(formData)
        setIsLoading(false)
        if (response.success) {
            toast.success("Tạo tin đăng thành công")
            navigate("/" + path.SUPPLIER + "/" + path.MANAGE_SERVICE)
        } else toast.error("Tạo tin đăng không thành công, hãy thử lại")
    }
    return (
        <section className="pb-[200px]">
            <Title title="Tạo mới dịch vụ">
                <Button onClick={validate(handleSubmit)} disabled={isLoading}>
                    Tạo mới
                </Button>
            </Title>
            <form className="p-4 grid grid-cols-12 gap-6">
                <div className="col-span-8">
                    <h1 className="text-lg font-semibold  text-main-blue">
                        1. Địa chỉ cho thuê
                    </h1>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <SelectLib
                            options={provinces.results?.map((el) => ({
                                ...el,
                                value: el.province_id,
                                label: el.province_name,
                            }))}
                            onChange={(val) => setValue("province", val)}
                            value={province}
                            className="col-span-1"
                            label="Tỉnh/Thành phố"
                            id="province"
                            register={register}
                            errors={errors}
                        />
                        <SelectLib
                            options={districts?.map((el) => ({
                                ...el,
                                value: el.district_id,
                                label: el.district_name,
                            }))}
                            onChange={(val) => setValue("district", val)}
                            value={district}
                            className="col-span-1"
                            label="Quận/Huyện"
                            id="district"
                            register={register}
                            errors={errors}
                        />
                        <SelectLib
                            options={wards?.map((el) => ({
                                ...el,
                                value: el.ward_id,
                                label: el.ward_name,
                            }))}
                            onChange={(val) => setValue("ward", val)}
                            value={ward}
                            className="col-span-1"
                            label="Phường/Xã"
                            id="ward"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label="Đường/Phố/Số nhà"
                            register={register}
                            errors={errors}
                            id="street"
                            fullWidth
                            placeholder="Nhập số nhà, đường, phố cụ thể"
                            inputClassName="border-gray-300"
                            textColor="text-black"
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label="Địa chỉ chính xác"
                            register={register}
                            errors={errors}
                            id="address"
                            fullWidth
                            inputClassName="border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
                            readOnly={true}
                            value={address}
                            validate={{ required: "Không được bỏ trống" }}
                            textColor="text-black"
                        />
                    </div>
                    <h1 className="text-lg font-semibold mt-6 text-main-blue">
                        2. Thông tin mô tả
                    </h1>
                    <div className="mt-6 relative z-10">
                        <SelectLib
                            options={postTypes?.map((el) => ({
                                ...el,
                                value: el.id,
                                label: el.name,
                            }))}
                            onChange={(val) => setValue("serviceTypeId", val)}
                            value={serviceTypeId}
                            className="col-span-1"
                            label="Loại tin đăng"
                            id="serviceTypeId"
                            register={register}
                            errors={errors}
                            validate={{ required: "Trường này không được bỏ trống." }}
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label="Tựa đề"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{ required: "Trường này không được bỏ trống." }}
                            fullWidth
                            placeholder="Tựa đề tin đăng"
                            inputClassName="border-gray-300"
                            textColor="text-black"
                        />
                    </div>
                    <div className="mt-4">
                        <TextField
                            label="Nội dung mô tả"
                            id="information"
                            onChange={(val) => setValue("information", val)}
                            placeholder="Điền mô tả về thông tin chỗ cho thuê"
                            value={information}
                        />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <InputForm
                            label="Link facebook"
                            register={register}
                            errors={errors}
                            id="linkFacebook"
                            fullWidth
                            inputClassName="border-gray-300"
                            wrapClassanme="col-span-1"
                            textColor="text-black"
                        />
                        <InputForm
                            label="Link website"
                            register={register}
                            errors={errors}
                            id="linkWebsite"
                            fullWidth
                            inputClassName="border-gray-300"
                            wrapClassanme="col-span-1"
                            textColor="text-black"
                        />
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        <label className="font-medium" htmlFor="avtImgBase64">
                            Chọn ảnh đại diện
                        </label>
                        <label
                            className="rounded-md px-4 py-2 flex items-center justify-center text-white bg-main-pink w-fit gap-2"
                            htmlFor="avtImgBase64"
                        >
                            <img
                                src={avtImgFile ? (avtImgFile instanceof File ? URL.createObjectURL(avtImgFile) : avtImgFile) : "/user.svg"}
                                alt="avtImg"
                                className="w-24 h-24 object-cover border rounded-full"
                            />
                        </label>
                        <input
                            {...register("avtImgBase64")}
                            hidden
                            type="file"
                            id="avtImgBase64"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        <label className="font-medium" htmlFor="images">
                            Chọn ảnh cho album
                        </label>

                        <input
                            multiple
                            {...register("images", {
                                required: "Trường này không được bỏ trống.",
                            })}
                            type="file"
                            id="images"
                        />
                        {errors?.images && (
                            <small className="text-xs text-red-500">
                                {errors.images?.message}
                            </small>
                        )}
                        <div className="grid grid-cols-4 gap-4">
                            {imagesBase64?.map((el, idx) => (
                                <div
                                    onMouseEnter={() => setImageHover(el)}
                                    onMouseLeave={() => setImageHover()}
                                    className="col-span-1 w-full relative"
                                    key={idx}
                                >
                                    <img src={el} alt="" className="w-full object-contain" />
                                    {imageHover === el && (
                                        <div
                                            onClick={() => removeFileFromFileList(idx, "images")}
                                            className="absolute inset-0 text-white cursor-pointer flex items-center justify-center bg-overlay-70"
                                        >
                                            <ImBin />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                    <div className="w-full relative z-10 h-[300px]">
                        {center && <Map address={address} zoom={zoom} center={center} />}
                    </div>
                    <div className="flex flex-col p-4 text-sm gap-2 rounded-md bg-orange-100 border border-orange-500 text-orange-600">
                        <h3 className="font-medium">Lưu ý khi đăng tin</h3>
                        <ul className="list-item pl-8">
                            <li className="list-disc">
                                Nội dung phải viết bằng tiếng Việt có dấu
                            </li>
                            <li className="list-disc">Tiêu đề tin không dài quá 100 kí tự</li>
                            <li className="list-disc">
                                Các bạn nên điền đầy đủ thông tin vào các mục để tin đăng có
                                hiệu quả hơn.
                            </li>
                            <li className="list-disc">
                                Để tăng độ tin cậy và tin rao được nhiều người quan tâm hơn, hãy
                                sửa vị trí tin rao của bạn trên bản đồ bằng cách kéo icon tới
                                đúng vị trí của tin rao.
                            </li>
                            <li className="list-disc">
                                Tin đăng có hình ảnh rõ ràng sẽ được xem và gọi gấp nhiều lần so
                                với tin rao không có ảnh. Hãy đăng ảnh để được giao dịch nhanh
                                chóng!
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default withBaseTopping(CreateService)
