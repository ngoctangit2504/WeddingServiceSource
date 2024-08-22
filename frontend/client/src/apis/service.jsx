import axios from "@/axios";

export const apiGetServiceType = () =>
    axios({
        url: "/service-type/getAll",
        method: "GET"
    })

export const apiCreateNewBooking = (data) =>
    axios({
        url: "/booking-service/add",
        method: "post",
        data,
    })

export const apiGetBookingServices = () =>
    axios({
        url: "/booking-service/booking-service-by-supplier-id",
        method: "GET"
    })

export const apiGetServiceByDeleted = (params) =>
    axios({
        url: "/service/getAllByDeleted",
        method: "GET",
        params,
    })
export const apiGetServiceByServiceType = (params) =>
    axios({
        url: "/service/getAllByServiceType",
        method: "GET",
        params,
    })
export const apiGetServiceBySuggested = (params) =>
    axios({
        url: "/service/suggest-by-follow-or-not",
        method: "GET",
        params,
    })
export const apiGetDetailService = (params) => {
    return axios({
        url: "/service/detail-service",
        method: "GET",
        params
    })
}

export const apiGetServices = (data) =>
    axios({
        url: "/guest/service/filters",
        method: "post",
        data,
    })

export const apiGetAlbumOfService = (params) => {
    return axios({
        url: "/guest/albByName",
        method: "GET",
        params
    })
}

export const apiGetServiceByPackageVIP = (params) => {
    return axios({
        url: "/guest/service/services-by-package-vip",
        method: "GET",
        params
    })
}

export const apiGetServiceByPackageVIP1AndVIP2 = (params) => {
    return axios({
        url: "/guest/service/services-by-package-VIP1-VIP2",
        method: "GET",
        params,
    })
}

export const apiGetServiceBySupplier = (params) => {
    return axios({
        url: "/service/getBySupplier",
        method: "GET",
        params
    })
}

export const apiDeleteServices = (params) =>
    axios({
        url: "/service/delete-by-ids",
        method: "DELETE",
        params
    })

export const apiDeleteService = (params) =>
    axios({
        url: "/service/delete-by-id",
        method: "delete",
        params
    })

export const apiCreateNewService = (data) =>
    axios({
        url: "/service/update-insert",
        method: "post",
        data,
    })
export const apiGetServiceBySupplierId = (supplierId, params) =>
    axios({
        url: `guest/service/${supplierId}`,
        method: "GET",
        params
    })
export const apiGetServiceTypeNameBySupplierId = (supplierId) =>
    axios({
        url: `guest/service-type-name/${supplierId}`,
        method: "GET",
    })
export const apiUpdateApprovedService = (params) =>
    axios({
        url: "/admin/setIsApprovedService",
        method: "patch",
        params,
    })
export const apiUpdateRejectedService = (params) =>
    axios({
        url: "/admin/setIsRejectedService",
        method: "patch",
        params,
    })
export const apiUpdateStatusBooking = (params) =>
    axios({
        url: "/booking-service/change/status-booking",
        method: "patch",
        params,
    })

export const apiUpdateServiceSelected = (serviceId) =>
    axios({
        url: `/service/update/service-selected/${serviceId}`,
        method: "patch",
    })