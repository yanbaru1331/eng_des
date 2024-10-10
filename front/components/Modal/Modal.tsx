import React, { useEffect, useState } from "react";
import Button from "../Button";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useMemo } from 'react';
import { FormEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";

class Relations {
  parent_index: number;
  child_index: number;
  depth: number;
}
class tmpLeaf {
  name: string;
  chart_index: number;
  score: number;
}


const Modal = (props) => {

  const closeModal = () => {
    props.setShowFlag(false);
  };
  //prposで渡された値は変数を書く
  //ex showFlag={showModal} の時showModalじゃなくてshowFlag
  //そうしないとshowModalがわからなくて動かない
  const navigate = useNavigate();
  const { userid } = useParams();
  const [maxScore, setMaxScore] = useState(1);
  const [scoreStandards, setScoreStandards] = useState(Array.from({ length: maxScore + 1 }, () => ""))

  const [mainTitle, setMainTitle] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const createDisabled = useMemo(() => {
    return !(mainTitle !== "" && contactAddress !== "" && !scoreStandards.includes(""));
  },
    [mainTitle, contactAddress, scoreStandards],
  );

  const reverseChartId = (chartId: number, maxItem: number) => {
    if (chartId === 0) return 0;
    else if (chartId <= maxItem) return 1;
    else if (chartId <= (1 / 6) * maxItem * (maxItem + 1) * (2 * maxItem + 1)) return 2;
    else return 3;
  }

  const leaves = (leafNum: number, chartNum: number, maxItem: number) => {
    const leafItems: tmpLeaf[] = [];
    for (let index = leafNum; index < chartNum; index++) {
      for (let i = 1; i < maxItem + 1; i++) {
        leafItems.push({
          name: `左から：${index}番のチャート-右回り：${i}番目`,
          score: 1,
          chart_index: index,
        });
      }
    }
    return leafItems;
  }

  //リレーションを作成する関数
  const createClosureTable = (maxDepth: number, maxItem: number) => {
    let branchFactor = maxItem; // 子ノードの数
    const closureTable: Relations[] = [];
    let currentId = 0; // ノードに振られる番号

    const createChildren = (parentId: number, currentDepth: number) => {


      const startChildId = currentId + 1; // 次の子ノードのID
      const endChildId = startChildId + branchFactor - 1; // 最後の子ノードのID

      // 自分自身のエントリーを追加
      closureTable.push({
        parent_index: parentId,
        child_index: parentId,
        depth: reverseChartId(parentId, maxItem),
      });
      if (currentDepth >= maxDepth - 1) return;
      // 子ノードを作成し、親子関係をテーブルに追加
      for (let childId = startChildId; childId <= endChildId; childId++) {
        if (reverseChartId(childId, maxItem) < maxDepth) {
          closureTable.push({
            parent_index: parentId,
            child_index: childId,
            depth: reverseChartId(childId, maxItem),
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
  const leafAndChart = (maxItem: number, maxDepth: number) => {
    if (maxDepth === 1) {
      const chartNum = 1;
      const leafNum = 0
      return [chartNum, leafNum];
    }
    else if (maxDepth === 2) {
      const chartNum = 1 + maxItem;
      const leafNum = 1;
      return [chartNum, leafNum];
    }
    else if (maxDepth === 3) {
      const chartNum = 1 + maxItem + maxItem * maxItem;
      const leafNum = 1 + maxItem;
      return [chartNum, leafNum];
    }
    else return [1 + maxItem + maxItem * maxItem, 1 + maxItem]

  }
  //ダミーデータを作成する関数
  const dummyData = (maxDepth: number, maxItem: number, userId: number) => {

    const [chartNum, leafNum] = leafAndChart(maxItem, maxDepth);

    const charts: {name:string}[] = [];
    let sameLevelChartsNum:number = 1;
    for (let index = 1; index < maxDepth + 1; index++) {
      for (let i = 1; i < sameLevelChartsNum + 1; i++) {
        charts.push({
          name: `上から：${index}番-左から：${i}番目のチャート`
        });
      }
      sameLevelChartsNum = index ^ maxDepth;
    }
    // const charts = Array.from({ length: chartNum }, (_, index) => ({ name: "test" + index }))

    console.log("charts = " + charts);
    const postData = {
      user_id: Number(userid),
      charts: charts,
      relations: createClosureTable(maxDepth, maxItem),
      leaves: leaves(leafNum, chartNum, maxItem),
    };

    return postData;
  }

  const handleStandardChange = (index: number, value: string) => {
    const updatedStandards = [...scoreStandards];
    updatedStandards[index] = value;
    setScoreStandards(updatedStandards);
  };
  const updateMaxScore = (e) => {
    setMaxScore(Number(e.target.value));
    setScoreStandards(Array.from({ length: Number(e.target.value) }, () => ""));
  }

  //登録関数
  //awaitで非同期処理->その処理を行うまで次の処理を行わない
  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string || "";

    // 後でnumber型に変更してみる
    const depth = Number(form.get("depth") as string) || "";
    const itemNum = Number(form.get("itemNum") as string) || "";
    const maxScore = Number(form.get("score") as string) || "";
    const notPublished = Boolean(form.get("notPublished") as string) || false;
    const title = form.get("title") as string || "";
    const queryParams = new URLSearchParams({
      title: title
    });

    const d = Number(form.get("depth") as string);
    const i = Number(form.get("itemNum") as string);
    if (props.type === "edit") {
      //ここに登録

      await axios.post("http://localhost:3000/api/portfolio/page", {
        user_id: Number(userid),
        contact_address: email,
        published: notPublished,
        max_item: itemNum,
        max_depth: depth,
        max_score: maxScore,
        score_standards: scoreStandards
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log(res);
      })

      console.log("dummyData");
      let postData = await dummyData(d, i, Number(userid));
      console.log('Sending Data:', postData);
      postData.charts[0].name = title;
      await axios.post("http://localhost:3000/api/portfolio/chart", postData, {

        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          console.log(res);
          navigate(`/userpage/${userid}/chart?${queryParams.toString()}`);
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    }
    else {
      //ここに更新処理　一旦書かない
      console.log("register");
    }
  }
  if (props.type === "edit" || props.type === "register") {
    //もし editならsend変数をeditに、registerならregisterにする処理を作成してください

    return (
      <>
        {props.showFlag ? (
          <form onSubmit={submit}>
            <h1 className=" text-2xl font-bold text-gray-900 py-4">チャート初期情報入力</h1>


            <h2 className="text-xl font-semibold text-gray-800">メインタイトル</h2>
            {/* email型に変換=>コンタクトアドレス */}
            <input type="text" defaultValue="" name="title" onChange={(e) => {
              setMainTitle(e.target.value);
            }} />

            {/* ここに公開非公開を書く */}

            <h2 className="text-xl font-semibold text-gray-800">公開</h2>
            <input type="checkbox" defaultValue="false" name="notPublished" />

            <h2 className="text-xl font-semibold text-gray-800" >連絡先</h2>
            {/* email型に変換=>コンタクトアドレス */}
            <input type="text" defaultValue="" name="email" onChange={(e) => {
              setContactAddress(e.target.value);
            }} />

            <h2 className="text-xl font-semibold text-gray-800">段数</h2>
            {/* select型の数値に変更 */}
            <input type="number" defaultValue="1" min="1" max="3" name="depth" />

            <h2 className="text-xl font-semibold text-gray-800">１つのチャートの要素数</h2>
            {/* select型の数値に変更 */}
            <input type="number" defaultValue="3" min="3" max="8" name="itemNum" />
            <h2 className="text-xl font-semibold text-gray-800">スコアの最大</h2>
            {/* select型の数値に変更 */}
            <input type="number" defaultValue="1" min="1" max="6" name="score" onChange={updateMaxScore} />

            <h2 className="text-xl font-semibold text-gray-800">スコア基準</h2>
            {Array.from({ length: maxScore + 1 }, (_, i) => (
              <div key={i}>
                <label>スコア {i}: </label>
                <input
                  type="text"
                  value={scoreStandards[i] || ""}
                  onChange={(e) => {handleStandardChange(i, e.target.value);}}
                />
              </div>
            ))}
            <Button type="submit" disabled={createDisabled}>登録</Button>

            <Button onClick={closeModal}>閉じる</Button>
          </form>
        ) : (
          //showflagがfalseの時は何も表示しない処理
          <></>
        )}
      </>
    );
  }
  return (
    <></>
  )
}

export default Modal;