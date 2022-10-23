import { Button } from "antd"
import { NewsPublish } from "../../../components/publish-manage/NewsPublish"
import { usePublish } from "../../../components/publish-manage/usePublish"

export const Sunset=()=>{
    const {dataSource,deleteHandle,publishHandle}=usePublish(3)
    return <div>
        <NewsPublish dataSource={dataSource} button={
            (id)=><>
            <Button  danger style={{margin:'0 20px'}} onClick={()=>deleteHandle(id)}>删除</Button>
            <Button type="primary" onClick={()=>publishHandle(id)}>上线</Button>
            </>
        }></NewsPublish>
    </div>
}