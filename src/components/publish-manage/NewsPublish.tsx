import {  Table } from "antd"
import {  ReactNode } from "react";
import { Link } from "react-router-dom";
import { INews } from "../../views/NewsSandBox/news-manage/Drafts"

export const NewsPublish=(props:{
  dataSource:INews[],
  button:(id:number)=>ReactNode
})=>{
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
                {props.button(item.id)}
            </div>
        }
    },
    ];
  return <div>
    <Table dataSource={props.dataSource} columns={columns}
        rowKey={(item)=>item.id}
        pagination={
            {
                pageSize:5
            }
        }
        />
  </div>
}