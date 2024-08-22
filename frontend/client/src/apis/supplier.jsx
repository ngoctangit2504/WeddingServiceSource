import axios from "@/axios";

export const apiAddInforSupplier = (data) =>
    axios({
        url: "/supplier/add",
        method: "post",
        data,
    })

export const apiSupplierGetByUser = () =>
    axios({
        url: "/supplier/getByUser",
        method: "GET"
    })
export const apiSuppliers = () =>
    axios({
        url: "/supplier/getAll",
        method: "GET"
    })
export const apiCheckSupplierExited = () => {
    return axios({
        url: "/supplier/supplier-is-exit-by-userId",
        method: "GET"
    })
}

export const apiGetSupplierById = (id) =>
    axios({
        url: `guest/get/${id}`,
        method: "GET",
    })
export const apiUnfollowSupplier = (id) =>
    axios({
        url: `user/unfollow-supplier/${id}`,
        method: "POST"
    })
export const apifollowSupplier = (id) =>
    axios({
        url: `user/follow-supplier/${id}`,
        method: "POST"
    })

export const apiCheckUserIsFollowingSupplier = (id) =>
    axios({
       url: `user/check-user-is-follow-supplier/${id}`,
       method: "GET" 
    })

export const apiCheckTransactionServicePackageIsExpired = () =>
    axios({
        url: "supplier/transaction/is-expired",
        method: "patch"
    })