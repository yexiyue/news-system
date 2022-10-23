import { HeartTwoTone } from "@ant-design/icons"
import { PageHeader, Descriptions } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { INews } from "../NewsSandBox/news-manage/Drafts"

export const Detail=()=>{
  const params=useParams()
  const [newsInfo, setNewsInfo] = useState<INews>();
  useEffect(()=>{
    axios.get('/tourist-detail/'+params.id).then(res=>{
      return res
    }).then(
      (res)=>{
        axios.post('/tourist-detail/'+params.id,{view:res.data.data.view+1}).then(res=>{
          setNewsInfo(res.data.data)
        })
      }
    )
  },[params.id])

  const clickHandle=(id:number)=>()=>{
    axios.post('/tourist-detail/'+params.id,{star:newsInfo?.star!+1}).then(res=>{
      setNewsInfo(res.data.data)
    })
  }



  return <div>
  {newsInfo && (<>
    <PageHeader
      onBack={() => window.history.back()}
      title={newsInfo.title}
      subTitle={<div>
        <span style={{margin:'0 10px'}}>{newsInfo.Category.title}</span>
        <HeartTwoTone twoToneColor="#eb2f96" onClick={clickHandle(+params.id!)} />
      </div>}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="作者">
          {newsInfo.author}
        </Descriptions.Item>
        <Descriptions.Item label="发布时间">
          {newsInfo?.publishTime
            ? new Date(newsInfo?.publishTime!).toLocaleString("zh-Cn", {
                year: "2-digit",
                month: "long",
                day: "numeric",
                hour:'2-digit',
                minute:'2-digit'
              })
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="区域">
          {newsInfo.region}
        </Descriptions.Item>
        <Descriptions.Item label="访问数量">
          <span style={{color:'green'}}>{newsInfo.view}</span>
        </Descriptions.Item>
        <Descriptions.Item label="点赞数量">
        <span style={{color:'green'}}>{newsInfo.star}</span>
        </Descriptions.Item>
        <Descriptions.Item label="评论数量">
        <span style={{color:'green'}}>0</span>
        </Descriptions.Item>
      </Descriptions>
    </PageHeader>
    {/* 内容区域 */}
    <div dangerouslySetInnerHTML={{
      __html:newsInfo.article
    }} style={{
      /* border:"1px solid #ccc", */
      padding:"0 24px"
    }}>
    </div>
    </>
  )}
</div>
}