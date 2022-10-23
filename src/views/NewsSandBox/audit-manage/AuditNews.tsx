import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { Button, notification, Table } from "antd"
import axios from "axios"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../../../store"
import { INews } from "../news-manage/Drafts"

export const AuditNews=observer(()=>{
    const navigate=useNavigate()
    const {userInfo}=useStore()
    const [dataSource,setDataSource]=useState<INews[]>()
    useEffect(()=>{
        if(userInfo.user.roleId===1){
            axios.get('/audit-list').then(res=>setDataSource(res.data.data))
        }else{
            axios.get(`/audit-list?roleId=${3}&region=${userInfo.user.region}`).then(res=>setDataSource(res.data.data))
        }
    },[userInfo.user])

    const key = `open${Date.now()}`;
    const btn = (
        <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            navigate('/audit-manage/list')
        }}>
          确认
        </Button>
      );
    const auditHandle=async (item:INews,auditState:number)=>{
        const data={auditState:auditState,publishState:0}
        if(auditState===2){
            data.publishState=1
        }
        await axios.post(`/push_audit/${item.id}`,data)
        setDataSource(dataSource?.filter(i=>i.id!==item.id))
        notification.info({
            message: "通知",
            description: `更新成功,您可以点击确认到【审核管理/审核列表】中查看您的新闻`,
            placement: "topRight",
            key,
            btn,
            duration: 3,
        })
    }

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item:INews)=>{
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
        },
        {
            title:'作者',
            dataIndex:'author'
        },
        {
            title: '新闻分类',
            render:(item:INews)=>{
                return item.Category.title
            }
        },
        {
            title:'操作',
            render:(item:INews)=>{
                return <div style={{display:'flex',justifyContent:'center'}}>
                    <Button onClick={()=>auditHandle(item,2)} style={{margin:'0 20px'}} type="primary" shape="circle" icon={<CheckOutlined />}></Button>
                    <Button onClick={()=>auditHandle(item,3)} type="primary" shape="circle" danger icon={<CloseOutlined />}></Button>
                </div>
            }
        },
        ];
    return <div>
        <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{
            pageSize:5
        }}></Table>
    </div>
})