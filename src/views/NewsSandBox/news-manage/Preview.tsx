import { PageHeader, Button, Descriptions } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { INews } from "./Drafts";

export const NewsPreview = () => {
  const params = useParams();
  const [newsInfo, setNewsInfo] = useState<INews>();
  useEffect(() => {
    axios.get(`/draft/${params.id}`).then((res) => setNewsInfo(res.data.data));
  }, [params.id]);
  return (
    <div>
      {newsInfo && (<>
        <PageHeader
          onBack={() => window.history.back()}
          title={newsInfo.title}
          subTitle={newsInfo.Category.title}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {new Date(newsInfo.createTime!).toLocaleString("zh-CN", {
                month: "long",
                year: "2-digit",
                day: "numeric",
                hour:'2-digit',
                minute:'2-digit'
              })}
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
            <Descriptions.Item label="审核状态">
              {newsInfo.auditState === 0 ? (
                <span style={{ color: "blue" }}>未审核</span>
              ) : newsInfo.auditState === 1 ? (
                <span style={{ color: "orange" }}>审核中</span>
              ) : newsInfo.auditState === 2 ? (
                <span style={{ color: "green" }}>已通过</span>
              ) : (
                <span style={{ color: "red" }}>未通过</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="发布状态">
              {newsInfo.publishState === 0 ? (
                <span style={{ color: "blue" }}>未发布</span>
              ) : newsInfo.publishState === 1 ? (
                <span style={{ color: "orange" }}>待发布</span>
              ) : newsInfo.publishState === 2 ? (
                <span style={{ color: "green" }}>已发布</span>
              ) : (<span style={{ color: "red" }}>已下线</span>)}
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
  );
};
