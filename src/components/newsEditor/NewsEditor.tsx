import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {  Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import style from './newsEditor.module.css'
import { useEffect, useState } from 'react'

export const NewsEditor=(props:{
  content?:string
  getEditorValue:(str:string)=>void
})=>{
  const [editorState,setEditorState]=useState<EditorState>()
  const handleEditorChange=(value)=>{
    setEditorState(value)
  }

  useEffect(()=>{
    if(props.content){
      const html=props.content
      const contentBlock=htmlToDraft(html)
      if(contentBlock){
        const contentState=ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState=EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  },[props.content])
  return <div>
    <Editor
    editorState={editorState}
    wrapperClassName={style.wrapper}
    editorClassName={style.demoEditor}
    onEditorStateChange={handleEditorChange}
    onBlur={()=>{
      //draft转html
      const strValue=draftToHtml(convertToRaw(editorState!.getCurrentContent()))
      props.getEditorValue(strValue)
    }}
    />
  </div>
}