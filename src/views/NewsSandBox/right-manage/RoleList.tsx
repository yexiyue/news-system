import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal, Tree } from "antd";
import axios from "axios";
import { Key, useEffect, useState } from "react";
const { confirm } = Modal;
interface IRoleData {
  id: number;
  rights: { key: string }[];
  roleType: number;
  rolename: string;
}

export const RoleList = () => {
  const [dataSource, setDataSource] = useState<IRoleData[]>([]);
  const [treeData, setTreeData] = useState([]);
  const [currentRight, setCurrentRight] = useState<string[]>([]);
  const [currentId,setCurrentId]=useState<number>()
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <strong>{id}</strong>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "rolename",
    },
    {
      title: "操作",
      render: (item: IRoleData) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => MyConfirm(item.id)}
              style={{ marginRight: "20px" }}
              danger
              icon={<DeleteOutlined />}
              shape="circle"
            />
            <Button
              onClick={() => {
                showModal();
                setCurrentRight(item.rights.map((i) => i.key));
                setCurrentId(item.id)
              }}
              type="primary"
              icon={<UnorderedListOutlined />}
              shape="circle"
            />
          </div>
        );
      },
    },
  ];

  const deleteMethod = async (id: number) => {
    await axios.delete(`/role/${id}`);
    const newDataSource = [...dataSource];
    newDataSource.splice(
      newDataSource.findIndex((item) => item.id === id),
      1
    );
    setDataSource(newDataSource);
  };

  const MyConfirm = (id: number) => {
    confirm({
      title: "确定要删除该角色吗?",
      icon: <ExclamationCircleOutlined />,
      content: "删除该角色将造成无法挽回的后果。",
      onOk: () => {
        deleteMethod(id);
      },
    });
  };
  //获取角色数据
  useEffect(() => {
    axios.get("/role").then((res) => setDataSource(res.data.data));
  }, []);
  //获取权限数据
  useEffect(() => {
    axios.get("/right/without").then((res) => setTreeData(res.data.data));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async() => {
    setIsModalOpen(false);
    //更新数据
    await axios.put(`/role/${currentId}`,{rights:currentRight})
    //从服务端拿数据更新
    axios.get("/role").then((res) => setDataSource(res.data.data));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkedHandle=(checkedKeys)=>{
    setCurrentRight(checkedKeys.checked)
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
      ></Table>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
        onCheck={checkedHandle}
        checkStrictly
        treeData={treeData} 
        checkable 
        checkedKeys={currentRight}></Tree>
      </Modal>
    </div>
  );
};
