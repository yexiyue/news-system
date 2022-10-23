import { Input, Select ,Form, FormInstance} from "antd"
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
const {Option}=Select
interface Role {
    id: number;
    rolename: string;
    roleType: number;
  }
  
  interface Region {
    id: number;
    title: string;
    value: string;
  }
export const UserForm=observer((props:{
  form:FormInstance<any>,
  regionList:Region[],
  roleList:Role[],
  isDisabled:boolean,
  isUpdate?:boolean,
  setIsDisabled:React.Dispatch<React.SetStateAction<boolean>>
})=>{

  /* const [isDisabled,setIsDisabled]=useState(false) */
  //监听props.isUpdateDisabled变化，动态设置表单禁用状态
  /* useEffect(()=>{
    setIsDisabled(props.isUpdateDisabled!)
    console.log('2222')
  },[props.isUpdateDisabled]) */

  const {userInfo}=useStore()

  const checkRegionDisabled=(item:Region)=>{
    if(props.isUpdate){
      //更新
      if(userInfo.user.roleId===1){
        return false
      }else{
        if(item.value!==userInfo.user.region)return true
      }
    }else{
      //创建
      if(userInfo.user.roleId===1){
        return false
      }else{
        if(item.value!==userInfo.user.region)return true
      }
    }
  }

  const checkRoleDisabled=(item:Role)=>{
    if(props.isUpdate){
      //更新
      if(userInfo.user.roleId===1){
        return false
      }else{
        if(item.id!==3)return true
      }
    }else{
      //创建
      if(userInfo.user.roleId===1){
        return false
      }else{
        if(item.id!!==3)return true
      }
    }
  }

  return <Form
  form={props.form}
  layout="vertical"
  name="form_in_modal"
  initialValues={{ modifier: "public" }}
>
  <Form.Item
    name="username"
    label="用户名"
    rules={[
      {
        required: true,
        message: "请输入用户名！",
      },
    ]}
  >
    <Input type="text"/>
  </Form.Item>
  <Form.Item name="password" label="密码" rules={[
    {
      required:true,
      message:'请输入密码！'
    }
  ]}>
    <Input type="text" />
  </Form.Item>

  <Form.Item name="region" label="区域" rules={[{
    required:true,
    message:'请选择区域'
  }]}>
  <Select disabled={props.isDisabled}>
    {props.regionList.map(item=><Option disabled={checkRegionDisabled(item)} key={item.id} value={item.value}>{item.value}</Option>)}
  </Select>
  </Form.Item>

  <Form.Item name="roleId" label="角色" rules={[{
    required:true,
    message:'请选择角色'
  }]}>
    <Select onChange={(id)=>{
      if(id===1){
          props.setIsDisabled(true)
          props.form.setFieldValue('region',"全球")
      }else{
          props.setIsDisabled(false)
      }
    }}>
      {props.roleList.map(item=><Option disabled={checkRoleDisabled(item)} key={item.id}  value={item.id}>{item.rolename}</Option>)}
    </Select>
  </Form.Item>
</Form>
})