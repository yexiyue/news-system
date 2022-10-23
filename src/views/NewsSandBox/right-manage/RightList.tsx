import { Button, Table, Tag ,Modal, Popover, Switch} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import { useEffect, useState } from "react";
import { ListData } from "../../../components/newsSandBox/SideMenu";
const {confirm}=Modal
export const RightList=()=>{

    const [dataSource,setDataSource]=useState<ListData[]>([])
      
    const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render:(id)=>{
            return <strong>{id}</strong>
        }
    },
    {
        title: '权限名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '权限路径',
        dataIndex: 'key',
        key: 'key',
        render:(key)=>{
            return <Tag color="orange">{key}</Tag>
        }
    },
    {
        title:'操作',
        render:(item)=>{
            return <div style={{display:'flex',justifyContent:'center'}}>
                <Button onClick={()=>MyConfirm(item.id)} style={{marginRight:'20px'}} danger icon={<DeleteOutlined />} shape="circle"/>
                <Popover content={<div style={{textAlign:'center'}}><Switch checked={item.pagepermission} onChange={()=>switchChangeHandle(item)}></Switch></div>} title="页面配置项" trigger={item.pagepermission!=undefined ?"click":""}>
                    <Button type="primary" disabled={item.pagepermission==undefined} icon={<EditOutlined />} shape="circle"/>
                </Popover>
                
            </div>
        }
    },
    ];

    const switchChangeHandle=(item)=>{
        const data=item.pagepermission==1 ? 0 : 1
        /* const newDataSource=[...dataSource]
        if(item.grade==1){
            newDataSource.find(i=>i.id===item.id)!.pagepermission=data
        }else{
            newDataSource.find(i=>i.id==item.rightId)!.children!.find(i=>i.id===item.id)!.pagepermission=data
        } */
        item.pagepermission=data
        setDataSource([...dataSource])
        axios.patch(`/right/${item.id}`,{pagepermission:data})
    }

    useEffect(()=>{
        axios.get('/right/without').then(res=>{
            res.data.data.forEach(item=>{
                if(item.children.length===0){
                    delete item.children
                }
            })
            setDataSource(res.data.data)
        })
    },[])
    
    const MyConfirm=(id:number)=>{
        confirm({
            title: '你想要删除权限吗?',
            icon: <ExclamationCircleOutlined />,
            content: '删除权限将无法挽回！',
            onOk() {
                deleteMethod(id)
            }
        })
    }

    //递归删除item项
    const deleteItem=(list:ListData[],id:number)=>{
        if(list.findIndex(item=>item.id===id)!==-1){
            list.splice(list.findIndex(item=>item.id===id),1)
        }else{
            list.forEach(item=>{
                if(item.children?.length!>=0){
                    deleteItem(item.children!,id)
                }
                //如果删除完children长度为零则直接删除
                if(item.children && item.children.length===0){
                    delete item.children
                }
            })
        }
    }

    const deleteMethod=async(id:number)=>{
        const newDataSource=[...dataSource]
        deleteItem(newDataSource,id)
        setDataSource(newDataSource)
        const res=await axios.delete(`/right/${id}`)
        console.log(res)
    }

    return <div>
        <Table dataSource={dataSource} columns={columns} 
        pagination={
            {
                pageSize:3
            }
        }
        />
    </div>
}