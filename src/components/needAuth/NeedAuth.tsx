import { PropsWithChildren } from "react";
import {Navigate} from 'react-router-dom'
export const NeedAuth=(props:PropsWithChildren)=>{
    return <>
        {localStorage.getItem('token')?props.children:<Navigate to={'/login'}></Navigate>}
    </>
}