import { LoadingOutlined } from "@ant-design/icons"
import { Spin, Alert } from "antd"
import axios from "axios"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import {HashRouter} from 'react-router-dom'
import { NeedAuth } from "../components/needAuth/NeedAuth"
import { useStore } from "../store"
import { Login } from "../views/login/Login"
import { Detail } from "../views/news/Detail"
import { News } from "../views/news/News"
import { NewsSandBox } from "../views/NewsSandBox/NewsSandBox"
import { NoPermission } from "../views/NewsSandBox/noPermission/NoPermission"
import { routers } from "./routers"

export const IndexRouter=observer(()=>{
    const [rightsList,setRightsList]=useState<string[]>([])
    const {userInfo}=useStore()
    useEffect(()=>{
        if(userInfo.token){
            axios.get('/login',{
                headers:{
                'Authorization':userInfo.token
                }
            }).then(res=>{
                setRightsList(res.data.data.Role.rights.map(item=>item.key.replace(/\//i,'')))
            })
        }
    },[userInfo.token,userInfo.user.roleId])
    
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" index element={<Login></Login>}></Route>
                {/* 游客系统 */}
                <Route path="/news" index element={<News></News>}></Route>
                <Route path="/detail/:id" index element={<Detail></Detail>}></Route>
                <Route path="/" element={
                    /* 需要权限 */
                    <NeedAuth>
                        <NewsSandBox></NewsSandBox>
                    </NeedAuth>
                }>
                    {/* 子路由 */}
                    {rightsList.map(item=><Route key={item} path={item} element={routers[item]}></Route>)}
                    {/* 匹配之外的  无权限或403 notFound*/}
                    <Route path="*" element={<NoPermission></NoPermission>}></Route>
                </Route>
                
            </Routes>
        </HashRouter>
    )
})