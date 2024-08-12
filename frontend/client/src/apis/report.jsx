import axios from "@/axios";


export const apiAddReport = (data) =>
    axios({
        url: "/guest/report/add",
        method: "POST",
        data
    })
export const apiGetReports = (params) =>
    axios({
        url: "/admin/report/getAll",
        method: "get",
        params,
    })
export const apiDeleteReport = (params) =>
    axios({
        url: "/admin/report/delete",
        method: "delete",
        params,
    })
