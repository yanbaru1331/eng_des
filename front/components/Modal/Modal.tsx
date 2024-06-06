import React, { useState } from "react";
import Button from "../Button";

const Modal= (props) => {
  const closeModal = () => {
    props.setShowFlag(false);
  };
  //prposで渡された値は変数を書く
  //ex showFlag={showModal} の時showModalじゃなくてshowFlag
  //そうしないとshowModalがわからなくて動かない
  
  
  //入力フォームの各入力値
  //editの時は初期値を参照できるようにしておく
  const [title, setTitle] = useState(""); 
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");


  //登録関数
  const submit = () => {
    if (props.type === "edit"){
      //ここに登録
      console.log("edit");
    }
    else{
      //ここに更新処理
      console.log("register");
    }
  }
  if (props.type === "edit" ||  props.type === "register"){
    //もし editならsend変数をeditに、registerならregisterにする処理を作成してください

  return (
    <>
      {props.showFlag ? (
        <div>
        <h1>ポートフォリオ作成画面</h1>

        
        <p>タイトル</p>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        
        <p>日付</p>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <p>内容</p>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <p></p>
        <Button type="submit" size="large" onClick={submit}></Button>

      <Button onClick={closeModal}>閉じる</Button>
      </div>
      ) : (
        //showflagがfalseの時は何も表示しない処理
        <></>
      )}
    </>
  );
}
  return(
    <></>
  )
}

export default Modal;