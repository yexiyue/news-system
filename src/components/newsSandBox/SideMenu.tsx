import { Layout, Menu } from 'antd';
import {
  UserOutlined,
} from "@ant-design/icons";
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useEffect, useState } from 'react';
import style from './SideMenu.module.css'
import { observer } from 'mobx-react';
import { useStore } from '../../store';
const { Sider } = Layout;


export interface ListData{
  children?: ListData[]
  grade: number
  id:number
  key:string
  pagepermission:number|null
  rightId:number
  title:string
}


export const SideMenu = observer(() => {
  const {userInfo,collapsedState}=useStore()
  
  const [menu,setMenu]=useState([])
  //图标映射
  const iconMap={
    "/home":<UserOutlined />,
    "/user-manage":<span className='iconfont icon-yonghuguanli'></span>,
    "/user-manage/list":<span className='iconfont icon-yonghuliebiao'></span>,
    "/right-manage/role/list":<span className='iconfont icon-role-list'></span>,
    "/right-manage/right/list":<span className='iconfont icon-quanxianliebiao'></span>,
    "/right-manage":<span className='iconfont icon-quanxianguanli'></span>,
    "/news-manage":<span className='iconfont icon-a-14xinwenguanli'></span>,
    "/news-manage/add":<span className='iconfont icon-xinwen'></span>,
    "/news-manage/draft":<span className='iconfont icon-caogaoxiang'></span>,
    "/news-manage/category":<span className='iconfont icon-fenlei'></span>,
    "/audit-manage":<span className='iconfont icon-shenheguanli'></span>,
    "/audit-manage/audit":<span className='iconfont icon-xinwen1'></span>,
    "/audit-manage/list":<span className='iconfont icon-liebiao'></span>,
    "/publish-manage":<span className='iconfont icon-fabuguanli'></span>,
    "/publish-manage/unpublished":<span className='iconfont icon-daifabu'></span>,
    "/publish-manage/published":<span className='iconfont icon-shangxian'></span>,
    "/publish-manage/sunset":<span className='iconfont icon-xiaxian'></span>,
  }
  
  //选择菜单，跳转
  const navigate=useNavigate()
  const menuSelectHandle=(info:{key:string})=>{
    navigate(info.key)
  }
  //渲染菜单栏
  function changeFormat(list:ListData[],keys:string[]){
    //根据用户拥有的权限动态渲染
    return list.map(item=>{
      if(!item.children?.length || item.children.length===0){
        if(keys.includes(item.key))return {
          key:item.key,
          label:item.title,
          icon:iconMap[item.key]
        }
      }
      if(keys.includes(item.key))return {
        key:item.key,
        label:item.title,
        icon:iconMap[item.key],
        children:changeFormat(item.children!,keys)
      }
    })
  }
  //获取数据
  useEffect(()=>{
    //服务端返回全部权限列表
    axios.get('/right').then(res=>{
        if(userInfo.rights?.length>=0){
          setMenu(changeFormat(res.data.data,userInfo.rights))
        }
    })
  },[userInfo.rights])
  //让菜单默认展开为当前页面路径
  const location=useLocation()
  const openKeys=[location.pathname]
  const selectKeys=[location.pathname.match(/^\/([\w-]+)(?=\/)/i)! ? location.pathname.match(/^\/([\w-]+)(?=\/)/i)![0]:'']

  return (
    
    <Sider trigger={null}  collapsible collapsed={collapsedState.collapsed}>
      <div className={style.box}>
        <div className="logo">
          全球新闻发布管理系统
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={openKeys}
          defaultOpenKeys={selectKeys}
          onSelect={menuSelectHandle}
          items={menu}
          className={style.menu}
        />
      </div>
    </Sider>
  );
});
