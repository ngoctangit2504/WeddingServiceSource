import axios from "axios"
const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
})
instance.interceptors.request.use(
  function (config) {
    const data = window.localStorage.getItem("persist:sweetdreams")
    const tokenObj = data && JSON.parse(data)
    if (tokenObj?.token?.length > 6)
      config.headers = {
        authorization: `Bearer ${JSON.parse(tokenObj.token)}`,
      }
    return config
  },
  function (error) {
    return error
  }
)

instance.interceptors.response.use(
  function (response) {
    return response?.data
  },
  function (error) {
    return error.response?.data
  }
)

export default instance
