import axios from "axios"
import { loadingState } from "../store/loading"
//开发环境
/* axios.defaults.baseURL='/api' */
//请求拦截器
axios.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token')
    if(config.url!=='/login' && config.url!=='/tourist-news'){
        config.headers={
        'Authorization':token
        }
    }
    return config
})
//显示与隐藏加载框
axios.interceptors.request.use((config)=>{
    loadingState.changeLoading(true)
    return config
})

axios.interceptors.response.use((response)=>{
    loadingState.changeLoading(false)
    return response
},error=>{
    loadingState.changeLoading(false)
    return Promise.reject(error)
})