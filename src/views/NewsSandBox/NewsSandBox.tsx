import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SideMenu } from "../../components/newsSandBox/SideMenu";
import { TopHeader } from "../../components/newsSandBox/TopHeader";
import { Layout, Spin } from "antd";
import {observer} from 'mobx-react'
import './NewsSandBox.css'
import axios from "axios";
import { useStore } from "../../store";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { LoadingOutlined } from "@ant-design/icons";

const {  Content } = Layout;

export const NewsSandBox = observer(() => {
  //开始进度条
  NProgress.start()
  const navigate = useNavigate();
  const location = useLocation();
  const store=useStore()
  //重定向到首页
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home");
    }
  }, [location.pathname]);

  //获取用户信息
  useEffect(()=>{
    axios.get('/login',{
      headers:{
        'Authorization':localStorage.getItem('token')
      }
    }).then(res=>store.userInfo.initUserInfo(res.data.data))
  },[])
  //进度条
  useEffect(()=>{
    //关闭进度条
    NProgress.done()
  })
  return (
    <Layout>
        {/* 侧边菜单 */}
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        {/* 头部 */}
        <TopHeader></TopHeader>
        {/* 主体内容 */}
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <Spin tip="Loading..." spinning={store.loadingState.loading} indicator={<LoadingOutlined></LoadingOutlined>}>
          <Outlet></Outlet>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
});
