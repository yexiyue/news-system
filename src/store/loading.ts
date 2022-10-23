import { makeAutoObservable } from "mobx";

class LoadingStore{
  public loading:boolean=false
  constructor(){
    makeAutoObservable(this,{},{autoBind:true})
  }
  changeLoading=(loading:boolean)=>{
    this.loading=loading
  }
}

export const loadingState=new LoadingStore