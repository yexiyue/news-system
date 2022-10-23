import { Button } from "antd"
import { NewsPublish } from "../../../components/publish-manage/NewsPublish"
import { usePublish } from "../../../components/publish-manage/usePublish"


export const Published=()=>{
    
    const {dataSource,sunsetHandle}=usePublish(2)
    return <div>
        <NewsPublish dataSource={dataSource} button={
           (id)=> <Button type="primary" onClick={()=>sunsetHandle(id)}>下线</Button>
        }></NewsPublish>
    </div>
}