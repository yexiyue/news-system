import { Card, Col, PageHeader, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import axios from "axios";
import { useEffect, useState } from "react";
import { INews } from "../NewsSandBox/news-manage/Drafts";
import image from '../../assets/2056017.jpg'
import { useNavigate } from "react-router-dom";
export const News = () => {
  const [dataSource,setDataSource]=useState<INews[]>([])
  const navigate=useNavigate()
  useEffect(() => {
    axios.get("/tourist-news").then((res) => setDataSource(res.data.data));
  }, []);
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大标题"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper" style={{width:'95%',margin:'0 auto'}}>
        <Row gutter={16}>
          {dataSource.map(item=>{
            return <Col span={8} key={item.id}>
            <Card
              hoverable
              style={{ width:'80%',margin:'20px auto'}}
              cover={
                <img
                src={item.coverImage ?'/image/'+item.coverImage:image}
                />
              }
              onClick={()=>{
                navigate('/detail/'+item.id)
              }}
            >
              <Meta 
                title={item.title}
                description={<strong>{item.Category.title}</strong>}
              />
            </Card>
          </Col>
          })}
        </Row>
      </div>
    </div>
  );
};
