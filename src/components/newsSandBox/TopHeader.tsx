import { Avatar, Dropdown, Layout, Menu, Space } from "antd";
const { Header } = Layout;
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from "@ant-design/icons";
import {   useState } from "react";
import { useNavigate } from "react-router-dom";
import {observer} from 'mobx-react'
import { useStore } from "../../store";

export const TopHeader = observer(() => {
  /* const [collapsed, setCollapsed] = useState(false); */
  //用户store
  const {userInfo,collapsedState}=useStore()
  
  //改变折叠事件
  /* const changeCollapsed = () => setCollapsed((preValue) => !preValue); */
  const navigate=useNavigate()
  //下拉菜单
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: userInfo.user?.Role?.rolename,
        },
        {
          key: "2",
          danger: true,
          label: "退出登录",
        },
      ]}
      onClick={(info)=>{
        if(info.key==='2'){
          localStorage.removeItem('token')
          navigate('/login',{replace:true})
        }
      }}
    />
  )
  

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {collapsedState.collapsed ? (
        <MenuUnfoldOutlined onClick={collapsedState.changeCollapsed}></MenuUnfoldOutlined>
      ) : (
        <MenuFoldOutlined onClick={collapsedState.changeCollapsed}></MenuFoldOutlined>
      )}
      <div style={{ float: "right" }}>
        <span>欢迎 <span style={{color:"#1890ff"}}>{userInfo?.user?.username}</span> 回来</span>
        <Dropdown overlay={menu}>
          <Space>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
});
