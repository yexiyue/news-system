import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Drawer, List, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import axios from "axios";
import { observer } from "mobx-react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../store";
import { INews } from "../news-manage/Drafts";
import * as Echarts from 'echarts'
import { Category } from "../news-manage/WriteNews";
export const Home = observer(() => {

    const [isOpen,setIsOpen]=useState(false)

    const {userInfo}=useStore()
    const [viewListData,setViewListData]=useState<INews[]>([])
    const [starListData,setStarListData]=useState<INews[]>([])
    const [categoryList,setCategoryList]=useState<({
        _count:number
    } &Category)[]>([])

    const [myCategoryList,setMyCategoryList]=useState<({
      _count:number
  } &Category)[]>([])
    useEffect(()=>{
        axios.get('/most-view').then(res=>setViewListData(res.data.data))
        axios.get('/most-star').then(res=>setStarListData(res.data.data))
    },[])

    useEffect(()=>{
      axios.get(`/category-list?author=${userInfo.user.username}`).then(res=>setMyCategoryList(res.data.data))
      
        axios.get('/category-list').then(res=>setCategoryList(res.data.data))
    },[])
    const ref=useRef() as MutableRefObject<HTMLDivElement>
    const drawerRef=useRef() as MutableRefObject<HTMLDivElement>

    /* 渲染柱状图 */
    const renderBar=()=>{
      var myChart = Echarts.init(ref.current);
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: categoryList.map(item=>item.title),
          axisLabel:{
            interval:0,
            rotate:45
          }
        },
        yAxis: {
            minInterval: 1
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: categoryList.map(item=>item._count)
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.onresize=()=>{
        myChart.resize()
      }
    }

    /* 饼状图 */
    const colorRandom=()=>{
      return '#'+Math.ceil((Math.random()*0xffffff)).toString(16)
    }
    colorRandom()
    const [pieChart,setPieChart]=useState()

    const renderPai=async()=>{
      let myChart;
      let colors
      if(!pieChart){
        myChart=Echarts.init(drawerRef.current)
        colors=myCategoryList.map(()=>colorRandom())
        setPieChart(myChart)
      }else{
        myChart=pieChart
      }
      
      const option = {
        legend: { show: false },
        series: [
            {
                name: '当前用户新闻分类图示',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: true,
                itemStyle: { borderColor: '#fff', borderWidth: 2 },
                color: colors,
                label: {
                    formatter: function (e) {
                        let {
                            data: { value, name},
                        } = e;
                        return `{x|}{a|${name}}\n{b|${value}个}`;
                    },
                    minMargin: 5,
                    lineHeight: 15,
                    rich: {
                        x: { width: 10, height: 10, backgroundColor: 'inherit', borderRadius: 5 },
                        a: { fontSize: 14, color: 'inherit', padding: [0, 20, 0, 8] },
                        b: { fontSize: 12, align: 'left', color: '#666666', padding: [8, 0, 0, 18] },
                        c: { fontSize: 12, align: 'left', color: '#666666', padding: [8, 0, 0, 8] },
                    },
                },
                data: myCategoryList.map(item=>{
                  return {
                    value:item._count,
                    name:item.title,
                  }
                }),
            },
        ],
    };
      myChart.setOption(option)
    }


    useEffect(()=>{
      renderBar()
      //销毁
      return ()=>{
        window.onresize=null
      }
    },[categoryList])
  return (
    <div className="site-card-wrapper">
      {/* 抽屉 */}
       <Drawer width='600px' title="个人新闻分类" placement="right" onClose={()=>setIsOpen(false)} open={isOpen}>
        {/* 饼状图 */}
        <div  ref={drawerRef} style={{height:'500px',width:'100%',marginTop:'30px'}}></div>
      </Drawer>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewListData}
              rowKey={item=>item.id}
              renderItem={(item:INews) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starListData}
              rowKey={item=>item.id}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={()=>{
                
                setIsOpen(true)
                setTimeout(()=>{
                  renderPai()
                },0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={userInfo.user.username}
              description={<div>
                <strong>{userInfo.user.region} </strong>
                <em>{userInfo.user.Role.rolename}</em>
              </div>}
            />
          </Card>
        </Col>
      </Row>
      {/* 柱状图 */}
      <div ref={ref} style={{height:'400px',width:'100%',marginTop:'30px'}}></div>
    </div>
  );
});
