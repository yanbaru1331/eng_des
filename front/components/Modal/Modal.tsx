import React, { useState } from "react";
import Button from "../Button";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { FormEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Modal= (props) => {
  const closeModal = () => {
    props.setShowFlag(false);
  };
  //prposで渡された値は変数を書く
  //ex showFlag={showModal} の時showModalじゃなくてshowFlag
  //そうしないとshowModalがわからなくて動かない
  const navigate = useNavigate();  
  const { userid } = useParams();
  //登録関数
  const submit:FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string || ""; 

    // 後でnumber型に変更してみる
    const depth = Number(form.get("depth") as string) || "";
    const itemNum = Number(form.get("itemNum") as string) || "";
    const maxScore = Number(form.get("score") as string) || "";
    const notPublished = Boolean(form.get("notPublished") as string) || "";
    const title = form.get("title") as string || "";
    const queryParams = new URLSearchParams({
      title: title
    });
    if (props.type === "edit"){ 
      //ここに登録
      console.log("edit");
      
      axios.post("http://localhost:3000/api/portfolio/page", {
        user_id: Number(userid),
        contact_address: email,
        published: notPublished,
        max_item: itemNum,
        max_depth: depth,
        max_score: maxScore
      },  {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log(res);
        navigate(`/userpage/${userid}/chart?${queryParams.toString()}`);
      })
    }
    else{
      //ここに更新処理　一旦書かない
      console.log("register");
    }
  }
  if (props.type === "edit" ||  props.type === "register"){
    //もし editならsend変数をeditに、registerならregisterにする処理を作成してください

  return (
    <>
      {props.showFlag ? (
        <form onSubmit={submit}>
        <h1>チャート作成画面</h1>

        <p>メインタイトル</p>
        {/* email型に変換=>コンタクトアドレス */}
        <input type="text" defaultValue="" name="title"/> 

        {/* ここに公開非公開を書く */}
        <p>公開</p>
        <input type="checkbox" defaultValue="false" name="notPublished" />

        <p>連絡先</p>
        {/* email型に変換=>コンタクトアドレス */}
        <input type="text" defaultValue=""  name="email"/>
        
        <p>段数</p>
        {/* select型の数値に変更 */}
        <input type="number" defaultValue="0" name="depth"/>

        <p>個数</p>
        {/* select型の数値に変更 */}
        <input type="number" defaultValue="0" name="itemNum"/>
        <p>最大点数</p>
        {/* select型の数値に変更 */}
        <input type="number" defaultValue="0" name="score" />
        <p></p>
        <Button type="submit" size="large">登録</Button>
      
      <Button onClick={closeModal}>閉じる</Button>
      </form>
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