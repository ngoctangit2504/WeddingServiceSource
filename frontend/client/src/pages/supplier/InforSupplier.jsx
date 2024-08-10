import {
    Button,
    InputForm,
    Map,
    SelectLib,
    Title,
} from "@/components";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import withBaseTopping from "@/hocs/WithBaseTopping";
import { useSelector } from "react-redux";
import clsx from "clsx";
import useDebounce from "@/hooks/useDebounce";
import {
    apiGetLngLatFromAddress,
    apiGetDistricts,
    apiGetWards,
} from "@/apis/app";
import { apiAddInforSupplier, apiSupplierGetByUser } from "@/apis/supplier";
import { toast } from "react-toastify";
import { data } from "autoprefixer";
import { json } from "react-router-dom";

const InforSupplier = ({ navigate }) => {
    const {
        formState: { errors },
        watch,
        register,
        getValues,
        setValue,
        handleSubmit: validate,
    } = useForm();
    const { provinces } = useSelector((state) => state.app);
    const [supplierData, setSupplierData] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [center, setCenter] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [avtImgFile, setAvtImgFile] = useState(null);


    const province = watch("province");
    const district = watch("district");
    const ward = watch("ward");
    const street = watch("street");
    const address = watch("address");

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await apiSupplierGetByUser();
                if (response.data && response.data.length > 0) {
                    setSupplierData(response.data[0]);
                    setValue("name", response.data[0].name);
                    setValue("phoneNumberSupplier", response.data[0].phoneNumberSupplier);
                    setValue("emailSupplier", response.data[0].emailSupplier);
                    setValue("addressSupplier", response.data[0].addressSupplier);
                    if (response.data[0].logo) {
                        setAvtImgFile(response.data[0].logo);
                    }
                }
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu nhà cung cấp");
            }
        };
        fetchSupplierData();
    }, [setValue]);

    // Update the avatar image file
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvtImgFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
        }
    };

   

    // Lấy tọa độ từ địa chỉ
    const fetLngLat = async (payload) => {
        const response = await apiGetLngLatFromAddress(payload);
        if (response.status === 200) {
            setCenter([
                response.data?.features[0]?.properties?.lat,
                response.data?.features[0]?.properties?.lon,
            ]);
        }
    };

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
        window.navigator.geolocation.getCurrentPosition((rs) => {
            if (rs && rs.coords) {
                const ps = [rs.coords.latitude, rs.coords.longitude];
                setCenter(ps);
            }
        });
    }, []);

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

    const debounceValue = useDebounce(street, 800);
    useEffect(() => {
        const lengthAddress = Object.values({
            province: province?.province_name,
            street,
            ward: ward?.ward_name,
            district: district?.district_name,
        }).filter(Boolean).length;
        if (lengthAddress > 2) setZoom(14);
        else setZoom(12);
        const text = clsx(
            debounceValue,
            debounceValue && ",",
            ward?.ward_name,
            ward?.ward_name && ",",
            district?.district_name,
            district?.district_name && ",",
            province?.province_name
        );
        const textModified = text
            ?.split(",")
            ?.map((el) => el.trim())
            ?.join(", ");
        setValue("addressSupplier", textModified);
        if (textModified)
            fetLngLat({
                text: textModified,
                apiKey: import.meta.env.VITE_MAP_API_KEY,
            });
    }, [province, district, ward, debounceValue, setValue]);

    // Xử lý gửi form
    // const handleSubmitCreate = async (data) => {
    //     const { name, phoneNumberSupplier, emailSupplier, addressSupplier } = data;
    //     const payload = { name, phoneNumberSupplier, emailSupplier, addressSupplier };
    //     const formData = new FormData()
    //     formData.append("request", JSON.stringify(payload))
    //     if (avtImgBase64 && avtImgBase64 instanceof FileList && avtImgBase64.length > 0) {
    //         formData.append("supplierImage", avtImgBase64[0])
    //     }
    //     setIsLoading(true);
    //     const response = await apiAddInforSupplier(formData);
    //     setIsLoading(false);
    //     if (response.success == true) {
    //         toast.success("Tạo thông tin nhà cung cấp thành công");
    //         // navigate("/" + path.SUPPLIER + "/" + path.INFORMATION_SUPPLIER);
    //     } else {
    //         toast.error(response.message);
    //     }
    // };
    // const handleSubmitUpdate = async (data) => {

    // }
    const handleSubmit = async (data) => {
        const { name, phoneNumberSupplier, emailSupplier, addressSupplier } = data;
        const payload = { name, phoneNumberSupplier, emailSupplier, addressSupplier };

        if (supplierData?.id) {
            payload.id = supplierData.id; // Nếu có id, thêm vào payload để thực hiện cập nhật
        }

        const formData = new FormData();
        formData.append("request", JSON.stringify(payload));

        if (avtImgFile) {
            formData.append("supplierImage", avtImgFile);
        }


        setIsLoading(true);
        try {
            const response = await apiAddInforSupplier(formData);

            if (response.success) {
                toast.success(supplierData?.id ? "Cập nhật thông tin nhà cung cấp thành công" : "Thêm mới nhà cung cấp thành công");
                // Điều hướng sau khi cập nhật/thêm mới thành công nếu cần
                // navigate("/" + path.SUPPLIER + "/" + path.INFORMATION_SUPPLIER);
            } else {
                toast.error(response.message || (supplierData?.id ? "Cập nhật thất bại" : "Thêm mới thất bại"));
            }
        } catch (error) {
            console.error("Error submitting supplier information:", error);
            toast.error("Đã xảy ra lỗi trong quá trình xử lý");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <section className="pb-[200px]">
            <Title title="Thông tin nhà cung cấp">
                {
                    supplierData ? (
                        <Button onClick={validate(handleSubmit)} disabled={isLoading}>
                            Cập nhật
                        </Button>

                    ) : (
                        <Button onClick={validate(handleSubmit)} disabled={isLoading}>
                            Thêm mới
                        </Button>
                    )
                }
            </Title>
            <form className="p-4 grid grid-cols-12 gap-6">
                <div className="col-span-8">
                    <div className="mt-4">
                        <InputForm
                            textColor="#000000"
                            label="Tên nhà cung cấp"
                            register={register}
                            errors={errors}
                            id="name"
                            validate={{ required: "Trường này không được bỏ trống." }}
                            fullWidth
                            placeholder="Nhập tên nhà cung cấp"
                            inputClassName="border-gray-300"
                        />
                    </div>
                    <InputForm
                        textColor="#000000"
                        label="Số điện thoại"
                        register={register}
                        errors={errors}
                        id="phoneNumberSupplier"
                        validate={{ required: "Trường này không được bỏ trống." }}
                        fullWidth
                        inputClassName="border-gray-300"
                        type="number"
                    />
                    <InputForm
                        textColor="#000000"
                        label="Email"
                        register={register}
                        errors={errors}
                        id="emailSupplier"
                        validate={{ required: "Trường này không được bỏ trống." }}
                        fullWidth
                        inputClassName="border-gray-300"
                        type="email"
                    />
                    <div className="grid grid-cols-3 gap-4 mt-6 text-black">
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
                            textColor="#000000"
                            label="Đường/Phố/Số nhà"
                            register={register}
                            errors={errors}
                            id="street"
                            fullWidth
                            placeholder="Nhập số nhà, đường, phố cụ thể"
                            inputClassName="border-gray-300"
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            textColor="#000000"
                            label="Địa chỉ chính xác"
                            register={register}
                            errors={errors}
                            id="addressSupplier"
                            fullWidth
                            inputClassName="border-gray-300 bg-gray-200 focus:outline-none focus:ring-transparent focus:ring-offset-0 focus:border-transparent focus: ring-0 cursor-default"
                            readOnly={true}
                            validate={{ required: "Không được bỏ trống" }}
                        />
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        <label className="font-medium" htmlFor="avtImgBase64">
                            Chọn ảnh đại diện nhà cung cấp
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
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                    <div className="w-full relative z-10 h-[300px]">
                        {center && <Map address={addressSupplier} zoom={zoom} center={center} />}
                    </div>
                    <div className="flex flex-col p-4 text-sm gap-2 rounded-md bg-orange-100 border border-orange-500 text-orange-600">
                        <h3 className="font-medium">Lưu ý khi tạo nhà cung cấp</h3>
                        <ul className="list-item pl-8">
                            <li className="list-disc">
                                Tất cả thông tin phải chính xác 100% thực tế
                            </li>
                            <li className="list-disc">
                                Các bạn nên điền đầy đủ thông tin vào các mục để tin đăng có
                                hiệu quả hơn.
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default withBaseTopping(InforSupplier);
