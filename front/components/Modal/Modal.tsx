import React, { useState } from "react";
import Button from "../Button";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { FormEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";

class Relations {
  parentId: number;
  childId: number;
  depth: number;
}
class tmpLeaf {
  name: string;
  chartId: number;
  score: number;
}


const Modal= (props) => {
  const closeModal = () => {
    props.setShowFlag(false);
  };
  //prposで渡された値は変数を書く
  //ex showFlag={showModal} の時showModalじゃなくてshowFlag
  //そうしないとshowModalがわからなくて動かない
  const navigate = useNavigate();  
  const { userid } = useParams();

  const reverseChartId = (chartId: number, maxItem:number) => {
    if (chartId === 0) return 0;
    else if (chartId <= maxItem) return 1;
    else if (chartId <= (1/6)*maxItem*(maxItem+1)*(2*maxItem+1)) return 2;
    else return 3;
  }

  const leaves = (leafNum:number, chartNum:number, maxItem:number) => {
    const leafItems:tmpLeaf[] = [];
    for (let index = leafNum; index < chartNum; index++) {
    for (let i = 0; i < maxItem; i++) {
      leafItems.push({
        name: `leaf${index}-${i}`,
        score: 1,
        chartId: index,
      });
    }
  }
    return leafItems;
}

  //リレーションを作成する関数
  const createClosureTable = (maxDepth:number, maxItem:number) => {
    let  branchFactor = maxItem; // 子ノードの数
    const closureTable: Relations[] = [];
    let currentId = 0; // ノードに振られる番号
  
    const createChildren = (parentId: number, currentDepth: number) => {

  
      const startChildId = currentId + 1; // 次の子ノードのID
      const endChildId = startChildId + branchFactor-1; // 最後の子ノードのID
  
      // 自分自身のエントリーを追加
      closureTable.push({
        parentId: parentId,
        childId: parentId,
        depth: reverseChartId(parentId, maxItem), 
      });
      if (currentDepth >= maxDepth-1) return;  
      // 子ノードを作成し、親子関係をテーブルに追加
      for (let childId = startChildId; childId <= endChildId; childId++) {
        if(reverseChartId(childId, maxItem) < maxDepth){
        closureTable.push({
          parentId: parentId,
          childId: childId,
          depth: reverseChartId(childId,maxItem),
        })
      }
  
        currentId = childId; // 子ノードのIDを更新
      }
  
      // 子ノードごとに再帰的に処理
      for (let childId = startChildId; childId <= endChildId; childId++) {
        createChildren(childId, currentDepth + 1);
      }
    };
  
    // ルートノードを作成し、子ノードを生成する
    // closureTable.push({
    //   parentId: 0,
    //   childId: 0,
    //   depth: 0,
    // });
  
    createChildren(0, 0); // ルートノードから再帰的に子ノードを生成
  
    return closureTable;
  };
  
  //葉を作成する関数
  const leafAndChart = (maxItem:number, maxDepth:number) => {
    if (maxDepth === 1){
      const chartNum = 1;
      const leafNum = 0
      return [chartNum, leafNum];
    }
    else if(maxDepth === 2){
      const chartNum = 1+maxItem;
      const leafNum = 1;
      return [chartNum, leafNum];
    }
    else if (maxDepth === 3){
      const chartNum = 1 + maxItem+maxItem*maxItem;
      const leafNum = 1+maxItem;
      return [chartNum, leafNum];
    }
    else return [1 + maxItem+maxItem*maxItem, 1+maxItem]
    
  }
  //ダミーデータを作成する関数
  const dummyData = (maxDepth:number, maxItem:number) => {

    const [chartNum, leafNum] = leafAndChart(maxItem, maxDepth);
    const charts  = Array.from({length: chartNum}, (_, index) => ({name: "test"+index}))

    console.log("charts = "+charts);
    const postData = {
      userId: 8,
      charts: charts,
      relations: createClosureTable(maxDepth, maxItem),
      leaves: leaves(leafNum, chartNum,maxItem),
    };

    return postData;
  }
  //登録関数
  //awaitで非同期処理->その処理を行うまで次の処理を行わない
  const submit:FormEventHandler<HTMLFormElement> = async(event) => {
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

    const d = Number(form.get("depth") as string);
    const i = Number(form.get("itemNum") as string);
    if (props.type === "edit"){ 
      //ここに登録
      console.log("edit");
      
      // await axios.post("http://localhost:3000/api/portfolio/page", {
      //   user_id: Number(userid),
      //   contact_address: email,
      //   published: notPublished,
      //   max_item: itemNum,
      //   max_depth: depth,
      //   max_score: maxScore
      // },  {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }).then((res) => {
      //   console.log(res);
      //   navigate(`/userpage/${userid}/chart?${queryParams.toString()}`);
      // })

      
      const postData = await dummyData(d,i);
      console.log('Sending Data:', postData);
  
      await axios.put("http://localhost:3000/api/portfolio/chart", postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
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