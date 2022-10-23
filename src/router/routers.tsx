import { AuditList } from "../views/NewsSandBox/audit-manage/AuditList";
import { AuditNews } from "../views/NewsSandBox/audit-manage/AuditNews";
import { Home } from "../views/NewsSandBox/home/Home";
import { Category } from "../views/NewsSandBox/news-manage/Category";
import { Draft } from "../views/NewsSandBox/news-manage/Drafts";
import { NewsUpdate } from "../views/NewsSandBox/news-manage/NewsUpdate";
import { NewsPreview } from '../views/NewsSandBox/news-manage/Preview'
import { WriteNews } from "../views/NewsSandBox/news-manage/WriteNews";
import { Published } from "../views/NewsSandBox/publish-manage/Published";
import { Sunset } from "../views/NewsSandBox/publish-manage/Sunset";
import { Unpublished } from "../views/NewsSandBox/publish-manage/Unpublished";
import { RightList } from "../views/NewsSandBox/right-manage/RightList";
import { RoleList } from "../views/NewsSandBox/right-manage/RoleList";
import { UserList } from "../views/NewsSandBox/user-manage/UserList";
//本地路由映射
export const routers = {
  'home': <Home></Home>,
  "user-manage/list": <UserList></UserList>,
  "right-manage/role/list": <RoleList></RoleList>,
  "right-manage/right/list": <RightList></RightList>,
  "news-manage/add":<WriteNews></WriteNews>,
  "news-manage/draft":<Draft></Draft>,
  "news-manage/category":<Category></Category>,
  "news-manage/preview/:id":<NewsPreview></NewsPreview>,
  "news-manage/update/:id":<NewsUpdate></NewsUpdate>,
  "audit-manage/audit":<AuditNews></AuditNews>,
  "audit-manage/list":<AuditList></AuditList>,
  "publish-manage/unpublished":<Unpublished></Unpublished>,
  "publish-manage/published":<Published></Published>,
  "publish-manage/sunset":<Sunset></Sunset>
};
