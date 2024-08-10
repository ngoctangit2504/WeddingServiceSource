import axios from "@/axios"

export const apiCreatePricing = (data) =>
  axios({
    url: "/admin/service/add-service-package",
    method: "post",
    data,
  })
export const apiGetPricings = (params) =>
  axios({
    url: "/guest/service/service-package",
    method: "get",
    params,
  })
export const apiUpdatePricing = (data, id) =>
  axios({
    url: "/admin/service/update-service-package/" + id,
    method: "put",
    data,
  })
export const apiDeletePricing = (id) =>
  axios({
    url: "/admin/service/delete-service-package/" + id,
    method: "delete",
  })
export const apiSubcribePricing = (params) =>
  axios({
    url: "/supplier/service/purchase-package-service",
    method: "post",
    params,
  })
