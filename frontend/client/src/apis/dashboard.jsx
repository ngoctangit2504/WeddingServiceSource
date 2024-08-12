
import axios from "@/axios"

export const apiTransactionStatus = () =>
    axios({
        url: "/admin/transaction/status",
        method: "get",
    })

export const apiPostStatus = () =>
    axios({
        url: "/admin/post/status",
        method: "get",
    })

export const apiPaymentTransactionStatus = () =>
    axios({
        url: "/admin/payment/status",
        method: "get",
    })


export const apiUserStatus = () =>
    axios({
        url: "/admin/user/status",
        method: "get",
    })