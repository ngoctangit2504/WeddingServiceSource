import axios from "@/axios"

export const apiPayment = (data) =>
  axios({
    url: "/payment",
    method: "post",
    data,
  })
export const apiGetDepositHistory = (params) =>
  axios({
    url: "/payment/history",
    method: "get",
    params,
  })
export const apiGetTransationUser = (params) =>
  axios({
    url: "/supplier/transaction/service-package",
    method: "get",
    params,
  })
export const apiGetTransationAdmin = (params) =>
  axios({
    url: "/admin/transaction/service-package",
    method: "get",
    params,
  })

  export const apiGetBankMethod = () =>
  axios({
    url: "/bank",
    method: "get",
  })

  export const apiGetBankMethodById = (id) =>
  axios({
    url: `/bank/${id}`,
    method: "get",
  })

  export const apiAddBankMethod = (data) =>
  axios({
        method: "post",
        url: `/bank`,
        data,
    })


    export const apiUpdateBankMethod = (id, data) =>
    axios({
        method: "put",
        url: `/bank/${id}`,
        data,
    })
  export const apiDeleteBankMethod = (ids) =>
    axios({
        url: `/bank`,
        method: "delete",
        data: ids,
    })