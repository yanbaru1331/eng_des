import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

// ChartData クラス: 点数以外の情報を格納
class ChartData {
  name: string;
  parentId: number;
  chartId: number;
  itemNum: number;
  depth: number;
}

// Leaf クラス: 親の parentId が maxDepth を超えている場合にのみ score を格納
class Leaf {
  title: string;
  parentId: number;
  chartId: number;
  itemNum: number;
  score: number;
  depth:number;
}

class Relations {
  id:number;
  page_id:number;
  parent_id:number;
  child_id:number;
  depth:number;
  createdAt:Date;
  updatedAt:Date;
}

class chart  {
  id:number;
  name:string;
  page_id:number;
  createdAt:Date;
  updatedAt:Date;
}

class leaf {
  id:number;
  name:string;
  score:number;
  chart_id:number;
  page_id:number;
  itemNum:number;
  createdAt:Date;
  updatedAt:Date;

}

const PulldownForm: React.FC = () => {


  //resの状態だと都合が悪いので変数に格納
  const [maxDepth, setMaxDepth] = useState(0);
  const [maxItem, setMaxItem] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const location = useLocation();
  const [charts, setCharts] = useState<chart[]>([]);
  const [leaves, setLeaves] = useState<leaf[]>([]);
  const [relations, setLeations] = useState<Relations[]>([]);
  // タイトルを取得する
  const searchParams = new URLSearchParams(location.search);
  const searchTitle = searchParams.get('title');


  //depth返すだけなら別に範囲計算でいいからここcaseで条件分岐すればいいのでは？
  // データを取得するためのAPIコール

  //ここでほしいのはフロント描画用のデータとダミーデータの取得
  useEffect( () => {

    const fetchUserData  = async () => {
     await axios.get("http://localhost:3000/api/portfolio/chart/all?user_id=1")
      .then((res) => {
        const maxDepth = res.data.data.pages.max_depth;
        const maxItem  = res.data.data.pages.max_item;
        const maxScore = res.data.data.pages.max_score;
        const charts = res.data.data.charts;
        const leaves = res.data.data.leaves;
        const  relations = res.data.data.relations;
        console.log("res=",res);
        console.log("charts=",charts);
        console.log("leaves=",leaves);
        setCharts(charts);
        setMaxDepth(maxDepth-1);
        setMaxItem(maxItem);
        setMaxScore(maxScore);
        setLeaves(leaves);
        setLeations(relations);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    fetchUserData();

  }, []);


  // 親や子、スコアの選択肢
  //グラフ
  const choiceParent: number[] = Array.from({ length: maxDepth }, (_, i) => i + 1);
  
  //グラフの頂点番号
  const choiceItem: string[] = Array.from({ length: maxItem }, (_, i) => (i + 1).toString()).concat("自身を修正");


  const [choiceChart, setChoiceChart] = useState<string[]>(charts.map((chart) => chart.name));
  //スコア
  const choiseScore: number[] = Array.from({ length: maxScore }, (_, i) => i + 1);

  // データ保持用のstate
  const [formState, setFormState] = useState({
    name: "",
    parentId: 0,
    chartId: 0,
    itemNum: 0,
    depth: -1,
  });

  const [leafFormState, setLeafFormState] = useState<Leaf>({
    title: "",
    parentId: 0,
    chartId: 0,
    itemNum: 0,
    score: 0,
    depth: 0,
  });

  const [entries, setEntries] = useState<ChartData[]>([]);
  const [leafEntries, setLeafEntries] = useState<Leaf[]>([]);

  // フォームの入力を監視するハンドラ関数
  const handleParentChartChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const depth = Number(e.target.value);
    setFormState(prev => ({ ...prev, depth:depth }));
    setLeafFormState(prev => ({ ...prev, depth:depth }));
  };

  const handleChartItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "自身を修正") {
      setFormState(prev => ({ ...prev, itemNum: 100 }));
      setLeafFormState(prev => ({ ...prev, itemNum: 100 }));
      return;
    }
    const itemNum = Number(e.target.value);
    setFormState(prev => ({ ...prev, itemNum: itemNum }));
    setLeafFormState(prev => ({ ...prev, itemNum: itemNum }));
  };

  const handleChartChartIdChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const chartId = Number(e.target.value);
    setFormState(prev => ({...prev, chartId}))
    setLeafFormState(prev => ({ ...prev, chartId: chartId }));
    //depthが初期値のときは適切な値を頑張って取得
      let tmp = charts[charts.findIndex((val) => val.id === chartId)].id;
      let checkDepth = relations[relations.findIndex((val) => (val.parent_id === tmp && tmp === val.child_id))].depth;
    //depthが異なっているか初期値のときは正しい値に再設定
      if (checkDepth !== formState.depth){
        setFormState(prev => ({...prev, depth: checkDepth})); 
        setLeafFormState(prev => ({ ...prev, depth: checkDepth }));
      }
    }
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, name: e.target.value }));
    setLeafFormState(prev => ({ ...prev, title: e.target.value }));
  };

  const handleScoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeafFormState(prev => ({ ...prev, score: Number(e.target.value) }));
  };

  // フォームの追加または更新を行う関数
  const addOrUpdateEntry = () => {
    //これを参考にしてデータが登録されたらフォームに追加する処理をする
//     const result3 = array3.findIndex((val, key) => val.a === 1 );
// array3[result3] = {a:100, b:200};
    //ここがフォームステートがからじゃないときに配列に追記してる部分だからこのあたりをいじくり回して修正してみる
    
    if (formState.name.trim() !== '' && formState.parentId !== -1 && formState.chartId !== -1) {
      const newEntry: ChartData = { ...formState};
      
      //子要素の編集
      if (leafFormState.depth === maxDepth) {
        const newLeafEntry: Leaf = { ...leafFormState };
        console.log("newLeafEntry=",newLeafEntry);
        let checkLeaf = leaves.findIndex((val) => val.chart_id === newLeafEntry.chartId && val.itemNum === newLeafEntry.itemNum-1);
        console.log("checkLeaf=",checkLeaf);
        if (checkLeaf !== -1){
          const updateLeaf ={
            ...leaves[checkLeaf],
            name: newLeafEntry.title,
            score: newLeafEntry.score,
          }
          leaves[checkLeaf] = updateLeaf;
        }

        setLeafEntries(prev => [...prev, newLeafEntry]);

      }
      else if (formState.itemNum === 100){
        //既存のデータの選択されたチャートIDの名前を変更する処理
        charts[charts.findIndex((val) => val.id === formState.chartId)].name = formState.name;
        setEntries(prev => [...prev, newEntry]);
      }
      //それ以外の修正
      else{
        //既存のデータの選択されたチャートIDの名前を変更する処理
      charts[charts.findIndex((val) => val.id === formState.chartId)].name = formState.name;
      setEntries(prev => [...prev, newEntry]);
      }

      // フォームをリセット
      setFormState({
        name: "",
        parentId: 0,
        chartId: 0,
        itemNum: 0,
        depth: -1,
      });
      setLeafFormState({
        title: "",
        parentId: 0,
        chartId: 0,
        itemNum: 0,
        score: 0,
        depth: 0,
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
    const postData = {
      user_id: 1,
      charts: charts,
      //ここ自動生成
      relations: relations,
      leaves: leaves,
    };

    console.log("postData=",postData);
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
      {/* <div>
        <label>
          グラフの深さを選択してください:
          <select value={formState.depth} onChange={handleParentChartChange}>
            <option value="">選択してください</option>
            {choiceParent.map(choice => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </label>
      </div> */}
      <div>
        <label>
          グラフ番号を選択してください:
          <select value={formState.chartId} onChange={handleChartChartIdChange}>
            <option value="">選択してください</option>
            {charts.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          タイトルを入力:
          <input
            type="text"
            value={formState.name}
            onChange={handleTitleChange}
            placeholder="テキストを入力"
            // disabled={formState.parentId === 0 || formState.chartId === 0}
          />
        </label>
      </div>

      {formState.depth === maxDepth && (

      <div>
        <label>
          頂点の位置を決定してください:
          <select value={
            formState.itemNum === 100
              ? "自身を修正"
              :
            formState.itemNum
            } onChange={handleChartItemChange}>
            <option value="">選択してください</option>
            {choiceItem.map(choice2 => (
              <option key={choice2} value={choice2}>
                {choice2}
              </option>
            ))}
          </select>
        </label>
      </div>
    )}

      {formState.depth === maxDepth && (

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
              親 Chart: {entry.parentId}, グラフ番号:{entry.chartId}, 頂点位置: {entry.itemNum}, タイトル: {entry.name}
            </li>
          ))}
        </ul>
        {leafEntries.length > 0 && (
          <>
            <h4>Leafs:</h4>
            <ul>
              {leafEntries.map((leaf, index) => (
                <li key={index}>
                  タイトル: {leaf.title}, 点数: {leaf.score}
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
