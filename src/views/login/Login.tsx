import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Button, Form ,message} from "antd";

import style from "./Login.module.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "../../store";
export const Login = observer(() => {
  const {userInfo}=useStore()

  const navigate=useNavigate()
  //成功回调
  const onFinish = async (values: any) => {
    try {
      const res = await axios.post("/login", values);
      if(res.status===200){
        localStorage.setItem('token',res.data.data.token)
        userInfo.setToken(res.data.data.token)
        message.success('登录成功')
        navigate('/home',{replace:true})
      }
    } catch (error:any) {
      const res=error.response
      if(res.status==401){
        message.warn('该用户不存在')
      }
      if(res.status==402){
        message.error('密码错误')
      }
      if(res.status==403){
        message.error('该用户没有权限')
      }
    }
  };

  const particlesInit = useCallback(async (engine) => {
    /* console.log(engine); */
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await container;
  }, []);

  return (
    <div className={style.box}>
      <Particles
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 3,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: false,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: false,
        }}
      />
      <Form
        name="normal_login"
        className={style.form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <p className={style.title}>全球新闻发布管理系统</p>
        <Form.Item
          className={style.item}
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          className={style.item}
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
