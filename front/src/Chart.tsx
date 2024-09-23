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
  childId: number;
  itemNum: number;
  score: number;
  depth:number;
}

class tmpLeaf {
  name: string;
  chartId: number;
  score: number;
}
class Relations {
  id:number;
  page_id:number;
  parent_id:number;
  child_id:number;
  depth:number;
}

class chart  {
  id:number;
  name:string;
  page_id:number;
}

class leaf {
  id:number;
  name:string;
  score:number;
  chart_id:number;
  page_id:number;
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
     await axios.get("http://localhost:3000/api/portfolio/chart/all?user_id=9")
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
        setMaxDepth(maxDepth);
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
  const choiceItem: number[] = Array.from({ length: maxItem }, (_, i) => i + 1);

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
    childId: 0,
    itemNum: 0,
    score: 0,
    depth: 0,
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

  const handleChartChartIdChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const chartId = Number(e.target.value);
    setFormState(prev => ({...prev, chartId}))
    if(formState.depth === -1){
      let tmp = charts[charts.findIndex((val) => val.id === chartId)].id;
      setFormState(prev => ({...prev, depth:relations[relations.findIndex((val) => (val.parent_id === tmp && tmp === val.child_id))].depth })); 
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
    
    if (formState.name.trim() !== '' && formState.parentId !== 0 && formState.chartId !== 0) {
      const newEntry: ChartData = { ...formState, depth: formState.parentId };
      
      //子要素の編集
      if (leafFormState.parentId === maxDepth) {
        const newLeafEntry: Leaf = { ...leafFormState };
        setLeafEntries(prev => [...prev, newLeafEntry]);
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
        childId: 0,
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
    console.log('Sending Data:', charts);

    // await axios.put("http://localhost:3000/api/portfolio/chart", postData, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
          頂点の位置を決定してください:
          <select value={formState.itemNum} onChange={handleChartItemChange}>
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
            disabled={formState.parentId === 0 || formState.chartId === 0}
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
