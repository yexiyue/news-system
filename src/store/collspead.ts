import { makeAutoObservable } from "mobx";

class CollapsedStore{
  public collapsed:boolean=localStorage.getItem('collapsed')==='false'?false:true
  constructor(){
    makeAutoObservable(this,{},{autoBind:true})
  }
  changeCollapsed=()=>{
    this.collapsed=!this.collapsed
    localStorage.setItem('collapsed',this.collapsed+'')
  }
}

export const collapsedState=new CollapsedStore