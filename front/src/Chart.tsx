import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';


import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// MyChartData クラス: 点数以外の情報を格納
class MyChartData {
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
  depth: number;
}

class Relations {
  id: number;
  page_id: number;
  parent_id: number;
  child_id: number;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
}

class chart {
  id: number;
  name: string;
  page_id: number;
  createdAt: Date;
  updatedAt: Date;
}

class leaf {
  id: number;
  name: string;
  score: number;
  chart_id: number;
  page_id: number;
  itemNum: number;
  createdAt: Date;
  updatedAt: Date;

}

class chartRecived {
  id: number;
  title: string;
  label: string[];
  childrenId: number[];
  depth: number;
  childrenScores: number[];
  childrenScoreAverage: number;
  createdAt: Date;
  updatedAt: Date;
}
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

class choiceChartClass {
  name: string;
  id: number;
}
const viewChartSize = {
  width: "400px",  // 固定幅
  height: "400px", // 固定高さ
  display: "flex",
};
const PulldownForm: React.FC = () => {


  //resの状態だと都合が悪いので変数に格納
  const [maxDepth, setMaxDepth] = useState(0);
  const [maxItem, setMaxItem] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const location = useLocation();
  const [charts, setCharts] = useState<chart[]>([]);
  const [leaves, setLeaves] = useState<leaf[]>([]);
  const [relations, setLeations] = useState<Relations[]>([]);
  const [scoreStandards, setScoreStandards] = useState<string[]>([]);
  // タイトルを取得する
  const searchParams = new URLSearchParams(location.search);
  const searchTitle = searchParams.get('title');
  const navigate = useNavigate();

  //描画周りの設定
  const [viewCharts, setViewCharts] = useState<chartRecived[]>([]);
  //depth返すだけなら別に範囲計算でいいからここcaseで条件分岐すればいいのでは？
  // データを取得するためのAPIコール

  //ここでほしいのはフロント描画用のデータとダミーデータの取得
  useEffect(() => {
    const fetchUserData = async () => {
      await axios.get("http://localhost:3000/api/portfolio/chart/all?user_id=" + sessionStorage.getItem('userId'))
        .then((res) => {
          const maxDepth = res.data.data.pages.max_depth;
          const maxItem = res.data.data.pages.max_item;
          const maxScore = res.data.data.pages.max_score;
          const charts = res.data.data.charts;
          const leaves = res.data.data.leaves;
          const relations = res.data.data.relations;
          console.log("res=", res);
          console.log("charts=", charts);
          console.log("leaves=", leaves);
          setCharts(charts);
          setMaxDepth(maxDepth - 1);
          setMaxItem(maxItem);
          setMaxScore(maxScore);
          setLeaves(leaves);
          setLeations(relations);
        })
        .catch((error) => {
          console.log(error);
          alert("データの取得に失敗しました \n初回作成データを作成してください\n何回も表示される場合は管理者へ問い合わせを行ってください");
          navigate(`/userpage/${sessionStorage.getItem('userId')}`);
        });
    }
    const getChart = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all/test?user_id=${sessionStorage.getItem('userId')}`)
        .then((res) => {
          const charts = res.data.data.charts;
          console.log("charts=", charts);
          setViewCharts(charts);
        }).catch((error) => {
          if (error.response.message === "Portfolio page is not existed") {
            console.log("error=", error.response.message);
          }
        });

    }
    const getScoreStandards = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/page/score_standard?user_id=${sessionStorage.getItem('userId')}`)
        .then((res) => {
          console.log("res=", res.data.data);
          const scoreStandards = res.data.data;
          setScoreStandards(scoreStandards);
        })
    }


    fetchUserData();
    getChart();
    getScoreStandards();
  }, []);


  // 親や子、スコアの選択肢
  //グラフ
  const choiceParent: number[] = Array.from({ length: maxDepth }, (_, i) => i + 1);

  //グラフの頂点番号
  // const choiceItem: string[] = Array.from({ length: maxItem }, (_, i) => (i + 1).toString()).concat("自身を修正");
  const [choiceItem, setChoiceItem] = useState<choiceChartClass[]>([]);

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

  const [entries, setEntries] = useState<MyChartData[]>([]);
  const [leafEntries, setLeafEntries] = useState<Leaf[]>([]);

  // フォームの入力を監視するハンドラ関数
  const handleParentChartChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const depth = Number(e.target.value);
    setFormState(prev => ({ ...prev, depth: depth }));
    setLeafFormState(prev => ({ ...prev, depth: depth }));
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
    setFormState(prev => ({ ...prev, chartId }))
    setLeafFormState(prev => ({ ...prev, chartId: chartId }));
    //depthが初期値のときは適切な値を頑張って取得
    let tmp = charts[charts.findIndex((val) => val.id === chartId)].id;
    let checkDepth = relations[relations.findIndex((val) => (val.parent_id === tmp && tmp === val.child_id))].depth;
    //depthが異なっているか初期値のときは正しい値に再設定
    if (checkDepth !== formState.depth) {
      setFormState(prev => ({ ...prev, depth: checkDepth }));
      setLeafFormState(prev => ({ ...prev, depth: checkDepth }));
    }

    //choiceItemを書き換える処理
    //チャートのIdを要求->チャートのidにそうleavesを取得
    let tmpleaf = [{ name: "自身を修正", id: 100 }];
    leaves.map((leaf) => {
      if (leaf.chart_id === Number(e.target.value)) {
        tmpleaf.push({ name: leaf.name, id: leaf.itemNum });
      }
      setChoiceItem(tmpleaf);
    })
  }
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, name: e.target.value }));
    setLeafFormState(prev => ({ ...prev, title: e.target.value }));
  };

  const handleScoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLeafFormState(prev => ({ ...prev, score: Number(e.target.value) }));
  };

  const backPage = () => {
    navigate(`/userpage/${sessionStorage.getItem('userId')}`);
  }

  // フォームの追加または更新を行う関数
  const addOrUpdateEntry = () => {

    if (formState.name.trim() !== '' && formState.parentId !== -1 && formState.chartId !== -1) {
      const newEntry: MyChartData = { ...formState };
      console.log("newEntry=", newEntry);
      //子要素の編集
      if (leafFormState.depth === maxDepth && formState.itemNum !== 100) {
        const newLeafEntry: Leaf = { ...leafFormState };
        console.log("newLeafEntry=", newLeafEntry);
        let checkLeaf = leaves.findIndex((val) => val.chart_id === newLeafEntry.chartId && val.itemNum === newLeafEntry.itemNum - 1);
        console.log("checkLeaf=", checkLeaf);
        if (checkLeaf !== -1) {
          const updateLeaf = {
            ...leaves[checkLeaf],
            name: newLeafEntry.title,
            score: newLeafEntry.score,
          }
          leaves[checkLeaf] = updateLeaf;
        }

        setLeafEntries(prev => [...prev, newLeafEntry]);

      }
      else if (formState.itemNum === 100) {
        //既存のデータの選択されたチャートIDの名前を変更する処理
        console.log("nameChange", formState.name);
        charts[charts.findIndex((val) => val.id === formState.chartId)].name = formState.name;
        setEntries(prev => [...prev, newEntry]);
      }
      //それ以外の修正
      else {
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

    const postData = {
      user_id: Number(sessionStorage.getItem('userId')),
      charts: charts,
      //ここ自動生成
      relations: relations,
      leaves: leaves,
    };

    console.log("postData=", postData);
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
    const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all/test?user_id=${sessionStorage.getItem('userId')}`)
      .then((res) => {
        console.log("res=", res.data.data.pages.max_score);
        setMaxScore(res.data.data.pages.max_score);
        console.log("res=", res.data.data.charts);
        const charts = res.data.data.charts;
        setCharts(charts);
      }).catch((error) => {
        if (error.response.message === "Portfolio page is not existed") {
          console.log("error=", error.response.message);
        }
      });
    // navigate(`/userpage/${sessionStorage.getItem('userId')}/chart`);
    window.location.reload();
  };

  //useMemo で第位置引数はdaya=の部分 第に引数にviewChartsを入れる
  // チャートの描画
  const data = useMemo(() => viewCharts.map((c) => ({
    labels: c.label,
    datasets: [
      {
        label: c.title,
        data: c.childrenScores,
        backgroundColor: '#33ccff',
        borderColor: "00bfff",
        borderWidth: 1,
      },
      {
        label: "平均点",
        data: Array.from({ length: c.childrenScores.length }, () => c.childrenScoreAverage),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      }
    ],
  })), [viewCharts]);
  const options = {
    scales: {
      r: {
        min: 0,
        max: maxScore,
        stepSize: 1,
      },
    },
  };
  // JSXのレンダリング
  return (
    <>
      <form>
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
                {choiceItem.map(c => (
                  <option key={c.name} value={c.id}>
                    {c.name}
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
          <Button type="button" onClick={addOrUpdateEntry}>
            登録
          </Button>
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
          <Button type="button" onClick={onSubmit}>
            送信
          </Button>
          <Button onClick={backPage}>戻る</Button>
          <Button onClick={() => navigate(`/userpage/${sessionStorage.getItem('userId')}/chart/view`)}>実際のページで確認</Button>
        </div>

      </form>
      <div>点数区分</div>
      {scoreStandards.map((s, i) => (
        <div key={i}>点数{i}点   {s}</div>
      ))}

      <div>
        {data.map((c, i) => (
          <div key={i} style={viewChartSize} className="chart">
            <Radar data={c} options={options} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PulldownForm;
