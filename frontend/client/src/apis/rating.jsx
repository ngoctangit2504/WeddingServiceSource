import axios from "@/axios";

export const apiGetRatings = (params) =>
    axios({
        url: "/rating/list/group",
        method: "get",
        params,
    })
export const apiRatings = (data) =>
    axios({
        url: "/rating/new",
        method: "post",
        data,
    })