import { loadingState } from './loading';
import { collapsedState } from './collspead';
import { createContext, useContext } from 'react';
import { user } from './user';

const store={
    userInfo:user,
    collapsedState,
    loadingState
}

const context=createContext(store)

export const useStore=()=>{
    return useContext(context)
}