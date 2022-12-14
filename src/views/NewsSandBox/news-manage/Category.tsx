import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputRef, Modal, Table } from "antd";
import { FormInstance } from "antd/lib/form";
import axios from "axios";
import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Category as CategoryItem } from "./WriteNews";
const { confirm } = Modal;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};




export const Category = () => {
  const [dataSource, setDataSource] = useState<CategoryItem[]>();
  useEffect(() => {
    axios.get("/category").then((res) => setDataSource(res.data.data));
  }, []);

  const handleSave=async(values:CategoryItem)=>{
    const newDataSource=[...dataSource!]
    newDataSource.splice(dataSource!.findIndex(item=>item.id===values.id),1,{...values,value:values.title})
    setDataSource(newDataSource)
    await axios.put(`/category/${values.id}`,{value:values.title})
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <strong>{id}</strong>;
      },
    },
    {
      title: "????????????",
      dataIndex: "title",
      onCell: (record: CategoryItem) => ({
        record,
        editable:true,
        dataIndex:'title',
        title: '????????????',
        handleSave,
      }),
    },

    {
      title: "??????",
      render: (item) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => MyConfirm(item.id)}
              style={{ marginRight: "20px" }}
              danger
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </div>
        );
      },
    },
  ];

  const MyConfirm = (id: number) => {
    confirm({
      title: "????????????????????????????",
      icon: <ExclamationCircleOutlined />,
      content: "????????????????????????????????????????????????",
      onOk() {
        axios.delete(`/category/${id}`);
        setDataSource(dataSource?.filter((i) => i.id !== id));
      },
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      await axios.post("/category", values);
      await axios.get("/category").then((res) => setDataSource(res.data.data));
      setIsOpen(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        ????????????
      </Button>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
        }}
      ></Table>
      <Modal
        title="????????????"
        cancelText="??????"
        okText="??????"
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item
            name="value"
            label="????????????"
            rules={[{ required: true, message: "?????????????????????" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
