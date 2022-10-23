import { Button, Table, Modal, notification} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined,ExclamationCircleOutlined, VerticalAlignTopOutlined} from '@ant-design/icons'
import { useEffect, useState } from "react";
import { Category } from "./WriteNews";
import { observer } from "mobx-react";
import { useStore } from "../../../store";
import { Link, useNavigate } from "react-router-dom";
const {confirm}=Modal
export interface INews {
  id: number;
  author: string;
  categoryId: number;
  region: string;
  roleId: number;
  auditState: number;
  publishState: number;
  createTime: string;
  title: string;
  article: string;
  star: number;
  view: number;
  publishTime?: any;
  coverImage?: string;
  Category:Category
}
export const Draft=observer(()=>{
    const navigate=useNavigate()
    const [dataSource,setDataSource]=useState<INews[]>([])
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    useEffect(() => {
        axios.get("/category").then((res) => setCategoryList(res.data.data));
    }, []);

    const key = `open${Date.now()}`;
    const btn = (
        <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            navigate("/audit-manage/list", {
                replace: true,
            });
        }}>
          确认
        </Button>
      );
    const pushAudit=(item:INews)=>{
        axios.post(`/push_audit/${item.id}`,{auditState:1}).then((res) => {
            
            notification.success({
              message: "通知",
              description: `更新成功,您可以点击确认到审核列表中查看您的新闻`,
              placement: "topRight",
              key,
              btn,
              duration: 3,
            });
          });
        setDataSource([...dataSource.filter(news=>news.id!==item.id)])
    }

    const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        render:(id)=>{
            return <strong>{id}</strong>
        }
    },
    {
        title: '新闻标题',
        dataIndex: 'title',
        render:(title,item:INews)=>{
            return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
        }
    },
    {
        title: '作者',
        dataIndex: 'author',
    },
    {
        title: '新闻分类',
        dataIndex: 'categoryId',
        render:(categoryId)=>{
            return categoryList.find(item=>item.id===categoryId)?.title
        }
    },
    {
        title:'操作',
        render:(item)=>{
            return <div style={{display:'flex',justifyContent:'center'}}>
                {/* 删除按钮 */}
                <Button onClick={()=>MyConfirm(item.id)} style={{marginRight:'20px'}} danger icon={<DeleteOutlined />} shape="circle"/>
                {/* 编辑按钮 */}
                <Button onClick={()=>navigate(`/news-manage/update/${item.id}`)} type="primary" style={{marginRight:'20px'}} icon={<EditOutlined />} shape="circle"/>
                {/* 提交审核 */}
                <Button onClick={()=>pushAudit(item)} type="primary" icon={<VerticalAlignTopOutlined />} shape="circle"/>
            </div>
        }
    },
    ];

    //获取草稿箱数据
    const {userInfo}=useStore()
    useEffect(()=>{
        axios.post('/draft',{author:userInfo.user.username}).then(res=>{
            setDataSource(res.data.data)
        })
    },[userInfo.user.username])
    
    //删除确认框
    const MyConfirm=(id:number)=>{
        confirm({
            title: '你想要删除该文章吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(id)
            }
        })
    }

    const deleteMethod=async(id:number)=>{
        axios.delete(`/draft/${id}`)
        setDataSource(dataSource.filter(item=>item.id!==id))
    }

    return <div>
        <Table dataSource={dataSource} columns={columns}
        rowKey={(item)=>item.id}
        pagination={
            {
                pageSize:5
            }
        }
        />
    </div>
})