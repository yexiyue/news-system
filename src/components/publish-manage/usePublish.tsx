import { Button, notification } from "antd"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "../../store"
import { INews } from "../../views/NewsSandBox/news-manage/Drafts"

export const usePublish=(publishState:number)=>{
  const navigate=useNavigate()
  const {userInfo}=useStore()
  const [dataSource,setDataSource]=useState<INews[]>([])
  
  useEffect(()=>{
      axios.get(`/publish-list?author=${userInfo.user.username}&publishState=${publishState}`).then(res=>setDataSource(res.data.data))
  },[userInfo.user.username])

  const key = `open${Date.now()}`;
  const btn = (
      <Button type="primary" size="small" onClick={() => {
          notification.close(key)
          navigate('/publish-manage/published')
      }}>
        确认
      </Button>
    );
    const btn1 = (
      <Button type="primary" size="small" onClick={() => {
          notification.close(key)
          navigate('/publish-manage/sunset')
      }}>
        确认
      </Button>
    );
  const publishHandle=async(id:number)=>{
    await axios.post(`/push_audit/${id}`,{publishState:2,publishTime:new Date()})
    notification.info({
      message: "通知",
      description: `上线成功,您可以点击确认到【发布管理/已发布】中查看您的新闻`,
      placement: "topRight",
      btn,
      key,
      duration:3
  })
    setDataSource(dataSource.filter(i=>i.id!==id))
  }

  const sunsetHandle=async(id:number)=>{
    await axios.post(`/push_audit/${id}`,{publishState:3,publishTime:new Date()})
    notification.info({
      message: "通知",
      description: `发布成功,您可以点击确认到【发布管理/已下线】中查看您的新闻`,
      placement: "topRight",
      btn:btn1,
      key,
      duration:3
  })
    setDataSource(dataSource.filter(i=>i.id!==id))
  }

  const deleteHandle=async(id:number)=>{
    await axios.delete(`/draft/${id}`)
    notification.info({
      message: "通知",
      description: `您已经删除了您的新闻`,
      placement: "topRight",
      duration:3
  })
    setDataSource(dataSource.filter(i=>i.id!==id))
  }
  return {
    dataSource,
    publishHandle,
    sunsetHandle,
    deleteHandle
  }
}