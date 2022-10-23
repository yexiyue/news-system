import {  PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  notification,
  PageHeader,
  Result,
  Select,
  Steps,
} from "antd";

import axios from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NewsEditor } from "../../../components/newsEditor/NewsEditor";
import { INews } from "./Drafts";
import style from "./WriteNews.module.css";
const { Step } = Steps;
const { Option } = Select;
export interface Category {
  id: number;
  title: string;
  value: string;
}
export const NewsUpdate = () => {
  const params=useParams()

  //获取新闻数据
  useEffect(() => {
    axios.get(`/draft/${params.id}`).then((res) => {
      const {categoryId,title,coverImage,article}=res.data.data as INews
      form.setFieldsValue({categoryId,title})
      setPreviewImage('/api/'+coverImage!)
      setEditorValue(article)
    });
  }, [params.id]);

  const [steps, setSteps] = useState(0);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    categoryId: number;
  }>();
  const [editorValue, setEditorValue] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/category").then((res) => setCategoryList(res.data.data));
  }, []);

  const toBase64 = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (ev) => {
      setPreviewImage(ev.target?.result! as string);
    };
  };

  const imageOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImageFile(e.target.files![0]);
    toBase64(e.target.files![0]);
  };
  const [form] = Form.useForm();

  const saveHandle = (auditState: number) => {
    const data = {
      title: formData?.title!,
      categoryId: formData?.categoryId + "",
      article: editorValue!,
      coverImage: imageFile!,
      auditState: auditState + "",
    };
    //发送文件用FormData
    const newsFormData = new FormData();
    const dataEntries = Object.entries(data);
    dataEntries.forEach((item) => {
      newsFormData.set(item[0], item[1]);
    });
    //发生数据
    axios.post(`/draft/${params.id}`, newsFormData).then((res) => {
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list", {
        replace: true,
      });
      notification.success({
        message: "通知",
        description: `更新成功,您可以到${
          auditState === 0 ? "草稿箱" : "审核列表"
        }中查看您的新闻`,
        placement: "topRight",
        duration: 3,
      });
    });
  };

  return (
    <div>
      {/* 标题 */}
      <PageHeader title="更细新闻" onBack={()=>window.history.back()} />
      {/* 步骤条 */}
      <Steps size="small" current={steps}>
        <Step title="基本信息" description="新闻标题,新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      {/* 内容区域 */}
      <div className={steps === 0 ? "" : style.hidden}>
        <Form
          style={{ margin: "30px 0" }}
          name="basic"
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: "请输入标题!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: "请选择分类!" }]}
          >
            <Select placeholder="请选择分类">
              {categoryList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className={style.coverImage}>
            <input
              type="file"
              id="coverImage"
              style={{ display: "none" }}
              onChange={imageOnChange}
            />
            <label className={style.iconBox} htmlFor="coverImage">
              <p>上传封面图片:</p>
              <div>
                <p>{<PlusOutlined />}</p>
                <p>Upload</p>
              </div>
            </label>
            {previewImage ? (
              <img className={style.image} src={previewImage!} alt="" />
            ) : (
              ""
            )}
          </div>
        </Form>
      </div>
      <div className={steps === 1 ? "" : style.hidden}>
        <NewsEditor
          content={editorValue}
          getEditorValue={(htmlStr: string) => {
            setEditorValue(htmlStr);
          }}
        ></NewsEditor>
      </div>
      <div className={steps === 2 ? "" : style.hidden}>
        <Result
          status="success"
          title="更新新闻完成"
          subTitle="请选择保存草稿箱或者提交审核"
          extra={[
            <Button type="primary" key="console" onClick={() => saveHandle(0)}>
              保存草稿箱
            </Button>,
            <Button key="buy" onClick={() => saveHandle(1)}>提交审核</Button>,
          ]}
        />
      </div>

      {/* 按钮区域 */}
      <div className={style.buttonBox}>
        {steps !== 2 ? (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (steps === 0) {
                form.validateFields().then((values) => {
                  setFormData(values);
                  setSteps((preValue) => preValue + 1);
                });
              } else {
                if (editorValue.trim() == "<p></p>" || editorValue == "") {
                  return message.error("文章内容不能为空");
                } else {
                  setSteps((preValue) => preValue + 1);
                }
              }
            }}
          >
            下一步
          </Button>
        ) : (
          ""
        )}
        {steps !== 0 ? (
          <Button
            size="small"
            onClick={() => setSteps((preValue) => preValue - 1)}
          >
            上一步
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
