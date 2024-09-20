// import React, { useEffect, useState } from 'react';
// import axios from "axios";

// class ChartData {
//   name: string;
//   parentId: number;
//   childId: number;
//   depth: number;
// }

// class Leaf {
//   title: string;
//   score: number;
//   parentId: number;
// }

// const MyChart: React.FC = () => {

//   //送信する際の型
//   const [chartDatas, setChartDatas] = useState<ChartData[]>([]);
//   const [leafs, setLeafs] = useState<Leaf[]>([]);
//   //resの状態だと都合が悪いので変数に格納
//   const [maxDepth, setMaxDepth] = useState(0);
//   const [maxItem, setMaxItem] = useState(0);
//   const [maxScore, setMaxScore] = useState(0);

//   useEffect(() => {
//     axios.get("http://localhost:3000/api/portfolio/page?user_id=1")
//       .then((res) => {
//         console.log(res.data);
//         setMaxDepth(res.data.max_depth);
//         setMaxItem(res.data.max_item);
//         setMaxScore(res.data.max_score);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     if (maxDepth === 1) {
//       setChartDatas(new Array(1));
//       setLeafs(new Array(maxItem));
//     } else if (maxDepth === 2) {
//       setChartDatas(new Array(1 + maxItem));
//       setLeafs(new Array(maxItem * maxItem));
//     } else if (maxDepth === 3) {
//       setChartDatas(new Array(1 + maxItem + maxItem * maxItem));
//       setLeafs(new Array(maxItem * maxItem * maxItem));
//     }
//   }, [maxDepth, maxItem]);  
//   //maxDepthとmaxItemが変更された時に実行される

//   console.log(chartDatas);
//   console.log(leafs);

//   // データ受け取る箱は作ったので、次はデータを受け取る処理を書く
//   /*
//   大まかな流れ
//   for (let i = 1; i <= maxDepth; i++) {
//     i段目のタイトルを入力
//     if i === maxDepth {
//     for (let j = 1; j <= maxItem; j++) {
//       j個目の頂点名を入力
//       {頂点名}のスコアを入力
//     }
    
  
//   */ 
//   return (
//     <div>Chart Component</div>
//   )
// }

// export default MyChart;


// 今考えていること
// ->タイトル取得して、それをルートにして、それに紐づくデータを取得する
// ->MaxDepthとMaxItemに応じた変数代入の処理を書く

// 具体的には葉は親と点数とタイトルだけを持てばいい
// 根と節は親と子とタイトルだけを持てばいい
// import React, { useState, ChangeEvent, useEffect} from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from "axios";

// interface FormEntry {
//   parentChart: number;
//   chartItem: number;
//   title: string;
// }

// class ChartData {
//   name: string;
//   parentId: number;
//   childId: number;
//   depth: number;
//   score: number;
// }

// class Leaf {
//   title: string;
//   parentId: number;
//   childId: number;
// }

// const PulldownForm: React.FC = () => {
//   //送信する際の型
//   const [chartDatas, setChartDatas] = useState<ChartData[]>([]);
//   const [leafs, setLeafs] = useState<Leaf[]>([]);
//   //resの状態だと都合が悪いので変数に格納
//   const [maxDepth, setMaxDepth] = useState(0);
//   const [maxItem, setMaxItem] = useState(0);
//   const [maxScore, setMaxScore] = useState(0);
//   const location = useLocation();

//   //タイトルを取得する方法が存在しなかったので無理やり取得
//   const searchParams = new URLSearchParams(location.search);
//   const searchTitle = searchParams.get('title');

//   //ここは今テスト用なので、本来は
//   //string整形でベース+USERIDみたいな記述をしないといけない。
//   useEffect(() => {
//     axios.get("http://localhost:3000/api/portfolio/page?user_id=1")
//       .then((res) => {
//         setMaxDepth(res.data.max_depth);
//         setMaxItem(res.data.max_item);
//         setMaxScore(res.data.max_score);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const choiceParent: number[] = Array.from({ length: maxDepth }, (_, i) => i + 1);
//   const choiceItem: number[] = Array.from({ length: maxItem }, (_, i) => i + 1);
//   const choiseScore: number[] = Array.from({ length: maxScore }, (_, i) => i + 1);


//   //登録するまでのデータを保持するための変数
//   const [formState, setFormState] = useState<ChartData>({
//     name: "",
//     parentId: 0,
//     childId: 0,
//     depth: 0,
//     score: 0
//   });


//   // const [currentScore, setCurrentScore] = useState<number | ''>('');
//   const [entries, setEntries] = useState<ChartData[]>([]);

//   const isFormValid = formState.score !== 0 && formState.childId !== 0 && formState.name.trim() !== '' && formState.parentId !== 0;

//   const handleParentChartChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setFormState(prev => ({ ...prev, parentId: Number(e.target.value) }));
//   };

//   const handleChartItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setFormState(prev => ({ ...prev, childId: Number(e.target.value) }));
//   };

//   const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormState(prev => ({ ...prev, name: e.target.value }));
//   };

//   const handleScoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setFormState(prev => ({ ...prev, score: Number(e.target.value) }));
//   };


//   const createChartId = (parentId: number, childId: number) => {
//     return parentId * maxItem + childId;
//   }

//   const addOrUpdateEntry = () => {
//     //これどこに頂点位置を適切に決定するかわからーん
//     if (formState.parentId !== 0 && formState.childId !== 0 && formState.name.trim() !== '') {
//       const newEntry: ChartData = {
//         name: formState.name.trim(),
//         parentId: formState.parentId as number,
//         childId: formState.childId as number,
//         depth: formState.depth as number,
//         score: formState.score as number
//       };

//       setEntries(prev => {
//         const existingIndex = prev.findIndex(
//           entry => entry.parentId === formState.parentId && entry.childId === formState.childId
//         );
//         if (existingIndex !== -1) {
//           // 既存のエントリを置き換え
//           const updatedEntries = [...prev];
//           updatedEntries[existingIndex] = newEntry;
//           return updatedEntries;
//         } else {
//           // 新規エントリを追加
//           return [...prev, newEntry];
//         }
//       });

//       setFormState({
//         name: "",
//         parentId: 0,
//         childId: 0,
//         depth: 0,
//         score: 0
//       });
//     }
//   };

//   const onSubmit = () => {
//   const rootChart: ChartData = {
//     name: searchTitle as string,
//     parentId: 0,
//     childId: 0,
//     depth: 0,
//     score: 0  
//   };

//   // 偽装用のURL
//   //http://localhost:8000/userpage/:userid/chart?title=aaaaaaa
//   entries.unshift(rootChart);
//     if (entries.length > 0) {
//       const relations = 
//         entries.map(entry => ({
//           parentId: entry.parentId ,
//           childId: entry.childId ,
//           depth: entry.parentId,
//         }));
  
//       const leaves = entries
//         .filter(entry => entry.score !== 0)
//         .map(entry => ({
//           name: entry.name,
//           score: entry.score,
//           chartId: entry.childId
//         }));
  
//         // APIについてわかったこと
//         // 根は0
//         //　子の個数は必ずすべての親で等しくなければならない
//         //　今詰んでいるのはdepthの判定
//       const postData = {
//         // userId: 2,
//         // charts: [
        
//         //   ...entries.map(entry => ({
//         //   name: entry.name
//         // }))],
//         // relations: relations,
//         // leaves: leaves
//         userId: 1,
//         charts:
//         [
//             {name:"IT"},
//             {name:"プログラミング"},
//             {name:"ネットワーク"}
//         ],
//         relations:[
//             {parentId:0,childId:0,depth:0},
//             {parentId:0,childId:1,depth:1},
//             {parentId:1,childId:1,depth:1},
//             {parentId:0,childId:2,depth:1},
//             {parentId:2,childId:2,depth:1}],
//         leaves:[
//             {name:"アルゴリズム",score:5,chartId:1},
//             {name:"基礎文法",score:3,chartId:1},
//             {name:"データ構造",score:4,chartId:1},
//             {name:"設計",score:3,chartId:2},
//             {name:"DNS",score:1,chartId:2},
//             {name:"DHP",score:2,chartId:2}
//         ]
//       };
  
//       console.log('Sending Data:', postData);
  
//       axios.put("http://localhost:3000/api/portfolio/chart", postData, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       console.log('すべてのフィールドを入力してください。');
//     }
//   };
  
//   //ここにもし根じゃなかったらグラフタイトルを入力するフォームを追加する処理を書く
//   //ルートは存在している？っけ->メインタイトル取得
//   //tsのしようわからないけど、selectは登録したタイミングで更新されるんかなー
//   //↑これsetされるから画面は更新されていい感じtmになるんじゃないかなー
//   //あとで検証してみます、か
//   return (
//     <form>
//       <div>
//         <label>
//           親のグラフを選択してください:
//           {/* ここさー番号じゃなくてチャートの名前入力でIDを裏で紐づけるみたいな挙動したほうがいいね */}
//           <select value={formState.parentId} onChange={handleParentChartChange}>
//             <option value="">選択してください</option>
//             {choiceParent.map(choice => (
//               <option key={choice} value={choice}>
//                 {choice}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       <div>
//         <label>
//           {/* 頂点位置決めて無くてもデフォルトで最小値が選択されるようになりたいね */}
//           頂点の位置を決定してください:
//           <select value={formState.childId} onChange={handleChartItemChange}>
//             <option value="">選択してください</option>
//             {choiceItem.map(choice2 => (
//               <option key={choice2} value={choice2}>
//                 {choice2}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       <div>
//         <label>
//           頂点タイトルを入力:
//           <input
//             type="text"
//             value={formState.name}
//             onChange={handleTitleChange}
//             placeholder="テキストを入力"
//             disabled={formState.parentId === 0 || formState.childId === 0}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           {/* ここは最下層だった場合のみ表示をする */}
//           点数を決定してください:
//           <select value={formState.score} onChange={handleScoreChange}>
//             <option value="">選択してください</option>
//             {choiseScore.map(score => (
//               <option key={score} value={score}>
//                 {score}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       <div>
//         <button type="button" onClick={addOrUpdateEntry} disabled={!isFormValid}>
//           追加/更新
//         </button>
//       </div>

//       <div>
//         <h3>追加された項目:</h3>
//         <ul>
//           {entries.map((entry, index) => (
//             <li key={index}>
//               Parent Chart: {entry.parentId}, Chart Item: {entry.childId}, Title: {entry.name}, Score: {entry.score}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div>
//         <button type="button" onClick={onSubmit}>
//           送信
//         </button>
//       </div>
//     </form>
//   );
// };

// export default PulldownForm;

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

// ChartData クラス: 点数以外の情報を格納
class ChartData {
  name: string;
  parentId: number;
  childId: number;
  depth: number;
}

// Leaf クラス: 親の parentId が maxDepth を超えている場合にのみ score を格納
class Leaf {
  title: string;
  parentId: number;
  childId: number;
  score: number;
}

class tmpLeaf {
  name: string;
  chartId: number;
  score: number;
}
class Relations {
  parentId: number;
  childId: number;
  depth: number;
}


const PulldownForm: React.FC = () => {


  //resの状態だと都合が悪いので変数に格納
  const [maxDepth, setMaxDepth] = useState(0);
  const [maxItem, setMaxItem] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const location = useLocation();

  // タイトルを取得する
  const searchParams = new URLSearchParams(location.search);
  const searchTitle = searchParams.get('title');

  //ベースイメージ
  let postData
  const leaves = (leafNum:number, chartNum:number) => {
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
  //depth返すだけなら別に範囲計算でいいからここcaseで条件分岐すればいいのでは？
  const reverseChartId = (chartId: number) => {
    if (chartId === 0) return 0;
    else if (chartId <= maxItem) return 1;
    else if (chartId <= (1/6)*maxItem*(maxItem+1)*(2*maxItem+1)) return 2;
    else return 3;
  }
  //リレーションを作成する関数
  const createClosureTable = () => {
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
        depth: reverseChartId(parentId), 
      });
      if (currentDepth >= maxDepth-1) return;  
      // 子ノードを作成し、親子関係をテーブルに追加
      for (let childId = startChildId; childId <= endChildId; childId++) {
        if(reverseChartId(childId) < maxDepth){
        closureTable.push({
          parentId: parentId,
          childId: childId,
          depth: reverseChartId(childId),
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
  const dummyData = () => {

    const [chartNum, leafNum] = leafAndChart(maxItem, maxDepth);
    const charts  = Array.from({length: chartNum}, (_, index) => ({name: "test"+index}))

    console.log("charts = "+charts);
    const postData = {
      userId: 8,
      charts: charts,
      relations: createClosureTable(),
      leaves: leaves(leafNum, chartNum),
    };

    return postData;
  }


  // データを取得するためのAPIコール
  useEffect( () => {
     axios.get("http://localhost:3000/api/portfolio/page?user_id=8")
      .then((res) => {
        setMaxDepth(res.data.max_depth);
        setMaxItem(res.data.max_item);
        setMaxScore(res.data.max_score);
        console.log("res=",res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 親や子、スコアの選択肢
  //グラフ
  const choiceParent: number[] = Array.from({ length: maxDepth }, (_, i) => i + 1);
  //頂点数
  const choiceItem: number[] = Array.from({ length: maxItem }, (_, i) => i + 1);
  //スコア
  const choiseScore: number[] = Array.from({ length: maxScore }, (_, i) => i + 1);

  // データ保持用のstate
  const [formState, setFormState] = useState<ChartData>({
    name: "",
    parentId: 0,
    childId: 0,
    depth: 0,
  });

  const [leafFormState, setLeafFormState] = useState<Leaf>({
    title: "",
    parentId: 0,
    childId: 0,
    score: 0,
  });

  const [entries, setEntries] = useState<ChartData[]>([]);
  const [leafEntries, setLeafEntries] = useState<Leaf[]>([]);

  // フォームの入力を監視するハンドラ関数
  const handleParentChartChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const parentId = Number(e.target.value);
    setFormState(prev => ({ ...prev, parentId }));
    setLeafFormState(prev => ({ ...prev, parentId }));
  };

  const handleChartItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const childId = Number(e.target.value);
    setFormState(prev => ({ ...prev, childId }));
    setLeafFormState(prev => ({ ...prev, childId }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, name: e.target.value }));
    setLeafFormState(prev => ({ ...prev, title: e.target.value }));
  };

  const handleScoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeafFormState(prev => ({ ...prev, score: Number(e.target.value) }));
  };

  // 渡されたIdからdepthとitemIdを計算する






  
  // 例: maxItem = 3, maxDepth = 4
  const closureTable = createClosureTable();
  console.log(closureTable);
  
  // フォームの追加または更新を行う関数
  const addOrUpdateEntry = () => {
    //これを参考にしてデータが登録されたらフォームに追加する処理をする
//     const result3 = array3.findIndex((val, key) => val.a === 1 );
// array3[result3] = {a:100, b:200};
    if (formState.name.trim() !== '' && formState.parentId !== 0 && formState.childId !== 0) {
      const newEntry: ChartData = { ...formState, depth: formState.parentId };
      setEntries(prev => [...prev, newEntry]);

      if (leafFormState.parentId === maxDepth) {
        const newLeafEntry: Leaf = { ...leafFormState };
        setLeafEntries(prev => [...prev, newLeafEntry]);
      }

      // フォームをリセット
      setFormState({
        name: "",
        parentId: 0,
        childId: 0,
        depth: 0,
      });
      setLeafFormState({
        title: "",
        parentId: 0,
        childId: 0,
        score: 0,
      });
    }
  };


  // 送信処理
    const onSubmit = async () => {
    // const rootChart: ChartData = {
    //   name: searchTitle as string,
    //   parentId: 0,
    //   childId: 0,
    //   depth: 0,
    // };

    // const allEntries = [rootChart, ...entries];
    // const postData = {
    //   userId: 1,
    //   charts: allEntries.map(entry => ({
    //     name: entry.name
    //   })),
    //   //ここ自動生成
    //   relations: createClosureTable(),
    //   leaves: leafEntries.map(entry => ({
    //     name: entry.title,
    //     score: entry.score,
    //     chartId: entry.parentId * maxItem + entry.childId
    //   }))
    // };
    postData = await dummyData();
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
  };

  // JSXのレンダリング
  return (
    <form>
      <div>
        <label>
          グラフの深さを選択してください:
          <select value={formState.parentId} onChange={handleParentChartChange}>
            <option value="">選択してください</option>
            {choiceParent.map(choice => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          頂点の位置を決定してください:
          <select value={formState.childId} onChange={handleChartItemChange}>
            <option value="">選択してください</option>
            {choiceItem.map(choice2 => (
              <option key={choice2} value={choice2}>
                {choice2}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          頂点タイトルを入力:
          <input
            type="text"
            value={formState.name}
            onChange={handleTitleChange}
            placeholder="テキストを入力"
            disabled={formState.parentId === 0 || formState.childId === 0}
          />
        </label>
      </div>

      {formState.parentId === maxDepth && (
        <div>
          <label>
            点数を決定してください:
            <select value={leafFormState.score} onChange={handleScoreChange}>
              <option value="">選択してください</option>
              {choiseScore.map(score => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div>
        <button type="button" onClick={addOrUpdateEntry}>
          追加/更新
        </button>
      </div>

      <div>
        <h3>追加された項目:</h3>
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              Parent Chart: {entry.parentId}, Chart Item: {entry.childId}, Title: {entry.name}
            </li>
          ))}
        </ul>
        {leafEntries.length > 0 && (
          <>
            <h4>Leafs:</h4>
            <ul>
              {leafEntries.map((leaf, index) => (
                <li key={index}>
                  Title: {leaf.title}, Score: {leaf.score}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div>
        <button type="button" onClick={onSubmit}>
          送信
        </button>
      </div>
    </form>
  );
};

export default PulldownForm;
