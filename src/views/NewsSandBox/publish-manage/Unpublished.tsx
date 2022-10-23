import { Button } from "antd"
import { observer } from "mobx-react"
import { NewsPublish } from "../../../components/publish-manage/NewsPublish"
import { usePublish } from "../../../components/publish-manage/usePublish"

export const Unpublished=observer(()=>{
    const {dataSource,publishHandle}=usePublish(1)
    return <div>
        <NewsPublish dataSource={dataSource} button={
            (id)=><Button type="primary" onClick={()=>publishHandle(id)}>发布</Button>
        }></NewsPublish>
    </div>
})