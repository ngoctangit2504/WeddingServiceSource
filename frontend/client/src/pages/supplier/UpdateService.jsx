import {
    apiGetServiceType,
    apiCreateNewService,
    apiGetDetailService,
    apiGetAlbumOfService,
} from "@/apis/service";
import {
    Button,
    InputForm,
    MdEditor,
} from "@/components";
import { modal } from "@/redux/appSlice";
import { getBase64 } from "@/ultils/fn";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImBin } from "react-icons/im";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UpdateService = ({ serviceId }) => {
    const {
        formState: { errors },
        watch,
        register,
        getValues,
        reset,
        setValue,
        handleSubmit,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [detailPost, setDetailPost] = useState(null);
    const [postTypes, setPostTypes] = useState([]);
    const [imagesBase64, setImagesBase64] = useState([]);
    const [avtImgFile, setAvtImgFile] = useState(null);
    const [imageHover, setImageHover] = useState(null);
    const dispatch = useDispatch();

    const images = watch("images");

    const fetchPostById = async () => {
        try {
            const response = await apiGetDetailService({ serviceId });
            if (response.success) setDetailPost(response.data);
        } catch (error) {
            toast.error("Failed to fetch service details.");
        }
    };

    const fetchAlbumService = async () => {
        try {
            const response = await apiGetAlbumOfService({ serviceId });
            if (response) {
                const imageUrls = response.data.map(item => item.imageURL);
                setImagesBase64(imageUrls);
            } else {
                toast.error("Failed to fetch album images.");
            }
        } catch (error) {
            toast.error("Failed to fetch album images.");
        }
    };

    const fetchPostTypes = async () => {
        try {
            const response = await apiGetServiceType();
            setPostTypes(response.data || []);
        } catch (error) {
            toast.error("Failed to fetch post types.");
        }
    };

    // const convertFileToBase64 = async (file) => {
    //     try {
    //         const base64 = await getBase64(file);
    //         if (base64) setImagesBase64((prev) => [...prev, base64]);
    //     } catch (error) {
    //         toast.error("Failed to convert file to base64.");
    //     }
    // };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    

    // useEffect(() => {
    //     if (images && images instanceof FileList) {
    //         // setImagesBase64([]);
    //         for (let file of images) convertFileToBase64(file);
    //     }
    // }, [images]);

    useEffect(() => {
        if (images && images instanceof FileList) {
            // Chuyển đổi FileList thành Array
            const filesArray = Array.from(images);
    
            const convertFilesToBase64 = async () => {
                try {
                    // Lấy danh sách base64 từ các file mới
                    const base64Promises = filesArray.map(file => convertFileToBase64(file));
                    const base64Array = await Promise.all(base64Promises);
    
                    // Thêm các hình ảnh mới vào danh sách hiện tại
                    setImagesBase64(prevImages => [...prevImages, ...base64Array]);
                } catch (error) {
                    console.error("Error converting files to base64", error);
                    toast.error("Failed to convert files to base64.");
                }
            };
    
            convertFilesToBase64();
        }
    }, [images]);
    


    useEffect(() => {
        fetchPostTypes();
        fetchPostById();
        fetchAlbumService();
    }, [serviceId]);

    useEffect(() => {
        if (detailPost && postTypes.length) {
            reset({
                address: detailPost.addressService,
                post_type: detailPost.serviceTypeName,
                title: detailPost.title,
                description: detailPost.information,
                linkFacebook: detailPost.linkFacebook,
                linkWebsite: detailPost.linkWebsite,
            });
            setAvtImgFile(detailPost.image);
        }
    }, [detailPost, postTypes, reset]);

    const handleUpdate = async (data) => {
        try {
            setIsLoading(true);
            const avtImgBase64 = avtImgFile ? await getBase64(avtImgFile) : null;
            const updatedData = {
                ...data,
                avtImgBase64,
                imagesBase64: imagesBase64.length > 0 ? imagesBase64 : null,
            };
            const response = await apiCreateNewService(updatedData);
            if (response.success) {
                toast.success("Service updated successfully!");
                dispatch(modal({ isShowModal: false, modalContent: null }));
            } else {
                toast.error("Failed to update service.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the service.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvtImgFile(file);
        }
    };

    const removeFileFromFileList = (index) => {
        setImagesBase64((prev) => prev.filter((_, idx) => idx !== index));
    };

    // Clean up created URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            imagesBase64.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagesBase64]);

    return (
        <section
            onClick={(e) => e.stopPropagation()}
            className="w-4/5 mx-auto max-h-screen overflow-y-auto relative bg-white p-4"
        >
            <div className="p-4 flex items-center justify-between border-b">
                <h1 className="text-2xl font-bold tracking-tight">{`Cập nhật dịch vụ #${serviceId}`}</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={handleSubmit(handleUpdate)} disabled={isLoading}>
                        Cập nhật
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch(modal({ isShowModal: false, modalContent: null }))
                        }
                        className="bg-main-yellow"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <form className="p-4 grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div className="mt-4">
                        <InputForm
                            label="Địa chỉ cho thuê"
                            register={register}
                            errors={errors}
                            id="address"
                            fullWidth
                            validate={{ required: "Không được bỏ trống" }}
                        />
                    </div>
                    <div className="mt-6 relative flex flex-col gap-2 z-10">
                        <label htmlFor="" className="font-semibold">
                            Thể loại
                        </label>
                        <select
                            className="form-select border-gray-200 rounded-md"
                            {...register("post_type", {
                                required: "Trường này không được bỏ trống.",
                            })}
                        >
                            {postTypes?.map((el) => (
                                <option key={el.code} value={el.code}>
                                    {el.name}
                                </option>
                            ))}
                        </select>
                        {errors["post_type"] && (
                            <small className="text-xs text-red-500">
                                {errors["post_type"]?.message}
                            </small>
                        )}
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label="Tựa đề"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{ required: "Trường này không được bỏ trống." }}
                            fullWidth
                            inputClassName="border-gray-300"
                        />
                    </div>
                    <div className="mt-4">
                        <MdEditor
                            id="description"
                            errors={errors}
                            validate={{ required: "Trường này không được bỏ trống." }}
                            register={register}
                            label="Nội dung mô tả"
                            height={400}
                            setValue={setValue}
                            value={getValues("description")}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <InputForm
                            label="Link Facebook"
                            register={register}
                            errors={errors}
                            id="linkFacebook"
                            fullWidth
                            inputClassName="border-gray-300"
                            wrapClassName="col-span-1"
                            textColor="text-black"
                        />
                        <InputForm
                            label="Link Website"
                            register={register}
                            errors={errors}
                            id="linkWebsite"
                            fullWidth
                            inputClassName="border-gray-300"
                            wrapClassName="col-span-1"
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
                            {imagesBase64.length > 0 ? (
                                imagesBase64.map((el, idx) => (
                                    <div
                                        onMouseEnter={() => setImageHover(el)}
                                        onMouseLeave={() => setImageHover(null)}
                                        key={idx}
                                        className="col-span-1 w-full relative"
                                    >
                                        <img
                                            src={el}
                                            alt={`Preview ${idx}`}
                                            className="w-full object-contain"
                                        />
                                        {imageHover === el && (
                                            <span
                                                onClick={() => removeFileFromFileList(idx)}
                                                className="absolute top-0 right-0 bg-main-pink text-white p-1 cursor-pointer"
                                            >
                                                <ImBin size={15} />
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Không có ảnh nào để hiển thị.</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default UpdateService;
