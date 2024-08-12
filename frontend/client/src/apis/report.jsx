import axios from "@/axios";


export const apiAddReport = (data) => 
    axios({
        url: "/guest/report/add",
        method: "POST",
        data
    })
