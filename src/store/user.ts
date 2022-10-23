import { makeAutoObservable } from "mobx";
interface UserInfo {
  id: number;
  username: string;
  password: string;
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
  rights: Right[];
}
interface Right {
  key: string;
}

class UserStore {
  public user={} as UserInfo
  public token=localStorage.getItem('token')
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  initUserInfo(user:UserInfo){
    this.user=user
  }
  get rights(){
    return this.user.Role?.rights?.map(item=>item.key)
  }
  setToken(token:string){
    this.token=token
  }
}

export const user=new UserStore()