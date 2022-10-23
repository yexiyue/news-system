import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, notification, Popover, Switch, Table, Tag } from "antd"
import axios from "axios"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../../../store"
import { INews } from "../news-manage/Drafts"

export const AuditList=observer(()=>{
    const navigate=useNavigate()
    const {userInfo}=useStore()
    const [dataSource,setDataSource]=useState<INews[]>()
    useEffect(()=>{
        axios.get('/audit?author='+userInfo.user.username).then(res=>{
            setDataSource(res.data.data)
        })
    },[userInfo.user.username])

    const TagList=[
        '',
        <Tag color="orange">审核中</Tag>,
        <Tag color="green">已通过</Tag>,
        <Tag color="red">未通过</Tag>
    ]
    const btn1 = (
        <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            navigate('/news-manage/draft')
        }}>
          确认
        </Button>
      );
    const revokeHandle=async(item:INews)=>{
        await axios.post(`/push_audit/${item.id}`,{auditState:0})
        notification.info({
            message: "通知",
            description: `更新成功,您可以点击确认到草稿箱中查看您的新闻`,
            placement: "topRight",
            key,
            btn:btn1,
            duration: 3,
        })
        setDataSource(dataSource?.filter(i=>i.id!==item.id))
    }
    const key = `open${Date.now()}`;
    const btn = (
        <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            navigate('/publish-manage/published')
        }}>
          确认
        </Button>
      );
    const publishHandle=async(item:INews)=>{
        await axios.post(`/push_audit/${item.id}`,{publishState:2,publishTime:new Date()})
        notification.info({
            message: "通知",
            description: `发布成功,您可以点击确认到【发布管理/已发布】中查看您的新闻`,
            placement: "topRight",
            btn,
            key,
            duration:3
        })
        setDataSource(dataSource?.filter(i=>i.id!==item.id))
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
            title: '审核状态',
            render:(item:INews)=>{
                return TagList[item.auditState]
            }
        },
        {
            title:'操作',
            render:(item:INews)=>{
                const ButtonList=[
                    '',
                    <Button type="primary" onClick={()=>{
                        revokeHandle(item)
                    }}>撤销</Button>,
                    <Button onClick={()=>publishHandle(item)} danger >发布</Button>,
                    <Button onClick={()=>navigate('/news-manage/update/'+item.id)}>修改</Button>
                ]
                return <div style={{display:'flex',justifyContent:'center'}}>
                    {ButtonList[item.auditState]}
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