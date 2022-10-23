import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal, Switch, Form } from "antd";
import axios from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { UserForm } from "../../../components/user-manage/UserForm";
import { useStore } from "../../../store";
const { confirm } = Modal;

interface RootObject {
  id: number;
  username: string;
  default: boolean;
  roleState: boolean;
  region: string;
  roleId: number;
  Role: Role;
}
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

export const UserList = observer(() => {
  //用户信息
  const {userInfo}=useStore()


  const [dataSource, setDataSource] = useState<RootObject[]>([]);
  //区域列表
  const [regionList, setRegionList] = useState<Region[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      //过滤筛选
      filters:[...regionList.map(item=>({text:item.title,value:item.value}))],
      onFilter:(value,item:RootObject)=>{
        return item.region===value
      },
      render: (region) => {
        return <strong>{region}</strong>;
      },
    },
    {
      title: "角色名称",
      render: (item) => {
        return item.Role.rolename;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (item: RootObject) => {
        return (
          <Switch
            checked={item.roleState}
            disabled={item.default}
            onChange={() => switchCheckHandle(item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item: RootObject) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* 删除 */}
            <Button
              onClick={() => MyConfirm(item.id)}
              style={{ marginRight: "20px" }}
              danger
              disabled={item.default}
              icon={<DeleteOutlined />}
              shape="circle"
            />
            {/* 更新 */}
            <Button
              disabled={item.default}
              onClick={()=>onClickHandle(item)}
              type="primary"
              icon={<UnorderedListOutlined />}
              shape="circle"
            />
          </div>
        );
      },
    },
  ];
  //更新相关
  const [isUpdateOpen,setIsUpdateOpen]=useState(false)
  const [updateForm]=Form.useForm()
  const [updateId,setUpdateId]=useState<number>()
  const [isUpdateDisabled,setIsUpdateDisabled]=useState(false)

  const onClickHandle=(item:RootObject)=>{
    setIsUpdateOpen(true)
    setUpdateId(item.id)
    //如果是超级管理员禁用区域表单
    if(item.roleId===1){
      setIsUpdateDisabled(true)
    }else{
      setIsUpdateDisabled(false)
    }
    updateForm.setFieldsValue(item)
  }

  const updateFormOK=()=>{
    updateForm.validateFields().then(async(values)=>{
      //重置表单数据
      updateForm.resetFields()
      setIsUpdateOpen(false)

      const res=await axios.put(`/user/${updateId}`,values)

      const newDataSource=[...dataSource]
      newDataSource.splice(newDataSource.findIndex(item=>item.id===updateId),1,res.data.data)
      setDataSource(newDataSource)

    }).catch((info) => {
      console.log("Validate Failed:", info);
    });
  }
  //开关改变用户状态
  const switchCheckHandle = async (item: RootObject) => {
    const newDataSource = [...dataSource];
    newDataSource.find((i) => i.id == item.id)!.roleState = !item.roleState;
    setDataSource(newDataSource);
    await axios.patch(`/user/${item.id}`, { roleState: item.roleState });
  };

  const deleteMethod = async (id: number) => {
    //删除用户
    await axios.delete(`/user/${id}`);
    const newDataSource = [...dataSource];
    newDataSource.splice(
      newDataSource.findIndex((item) => item.id === id),
      1
    );
    setDataSource(newDataSource);
  };

  const MyConfirm = (id: number) => {
    confirm({
      title: "确定要删除该用户吗?",
      icon: <ExclamationCircleOutlined />,
      content: "删除该用户将造成无法挽回的后果。",
      onOk: () => {
        deleteMethod(id);
      },
    });
  };
  //根据角色和区域发起请求
  useEffect(() => {
    if(userInfo.user){
      axios.get(`/user/${userInfo.user.roleId}/${userInfo.user.region}`).then((res) => setDataSource(res.data.data))
    }
  }, [userInfo.user]);

  //表单
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled,setIsDisabled]=useState(false)
  
  useEffect(() => {
    axios.get("/region").then((res) => setRegionList(res.data.data));
  }, []);
  useEffect(() => {
    axios.get("/role").then((res) => setRoleList(res.data.data));
  }, []);

  //添加用户方法
  const addFormOK = () => {
    form
      .validateFields()
      .then(async(values) => {
        //重置表单
        form.resetFields();
        setIsOpen(false);
        //校验成功创建用户
        const res=await axios.post('/user',values)
        const newDataSource=[...dataSource]
        newDataSource.push(res.data.data)
        setDataSource(newDataSource)
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
        pagination={{
          pageSize:5
        }}
      ></Table>
      {/* 创建表单 */}
      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsOpen(false)}
        onOk={addFormOK}
      >
        <UserForm
          form={form}
          regionList={regionList}
          roleList={roleList}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        ></UserForm>
      </Modal>

      {/* 更新用户 */}
      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
        }}
        onOk={updateFormOK}
      >
        <UserForm
          form={updateForm}
          regionList={regionList}
          roleList={roleList}
          isDisabled={isUpdateDisabled}
          isUpdate
          setIsDisabled={setIsUpdateDisabled}
        ></UserForm>
      </Modal>
    </div>
  );
});
