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
  created_at: Date;
  updated_at: Date;
}

class leaf {
  id: number;
  name: string;
  score: number;
  chart_id: number;
  page_id: number;
  item_num: number;
  created_at: Date;
  updated_at: Date;

}

class chartRecived {
  id: number;
  title: string;
  label: string[];
  children_id: number[];
  depth: number;
  children_scores: number[];
  children_score_average: number;
  created_at: Date;
  updated_at: Date;
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
      await axios.get("http://localhost:3000/api/portfolio/chart/all_update_format?user_id=" + sessionStorage.getItem('userId'))
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
          console.log("name=", charts.map((chart) => chart.name));
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
      const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all_view_format?user_id=${sessionStorage.getItem('userId')}`)
        .then((res) => {
          const charts = res.data.data.charts;
          console.log("charts=", charts);
          setViewCharts(charts);
        }).catch((error) => {
          //ここ修正
          if (error.response.status === 400) {
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
  // const choiceItem: string[] = Array.from({ length: maxItem }, (_, i) => (i + 1).toString()).concat("選択したチャートの編集");
  const [choiceItem, setChoiceItem] = useState<choiceChartClass[]>([]);

  const [choiceChart, setChoiceChart] = useState<string[]>(charts.map((chart) => chart.name));
  //スコア
  const choiseScore: number[] = Array.from({ length: maxScore + 1 }, (_, i) => i);

  // データ保持用のstate
  const [formState, setFormState] = useState({
    name: "",
    parentId: 0,
    chartId: 0,
    itemNum: 100,
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
    if (e.target.value === "選択したチャートの編集") {
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
    let tmpleaf = [{ name: "選択したチャートの編集", id: 100 }];
    leaves.map((leaf) => {
      if (leaf.chart_id === Number(e.target.value)) {
        tmpleaf.push({ name: leaf.name, id: leaf.item_num });
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
        let checkLeaf = leaves.findIndex((val) => val.chart_id === newLeafEntry.chartId && val.item_num === newLeafEntry.itemNum);
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
        console.log(charts[charts.findIndex((val) => val.id === formState.chartId)].name);
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
        itemNum: 100,
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
    const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all_view_format?user_id=${sessionStorage.getItem('userId')}`)
      .then((res) => {
        console.log("res=", res.data.data.pages.max_score);
        setMaxScore(res.data.data.pages.max_score);
        console.log("res=", res.data.data.charts);
        const charts = res.data.data.charts;
        setCharts(charts);
      }).catch((error) => {
        //ここ修正 400エラーが出る
        if (error.response.status === 400) {
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
        data: c.children_scores,
        backgroundColor: '#33ccff',
        borderColor: "00bfff",
        borderWidth: 1,
      },
      {
        label: "平均点",
        data: Array.from({ length: c.children_scores.length }, () => c.children_score_average),
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
      <div className="bg-gray-50">
        <header className="flex bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">ポートフォリオ編集</h1>
          </div>
          <div className='py-4'>
            <Button onClick={backPage}>戻る</Button>
          </div>
        </header>
        <div className='flex justify-center items-center gap-4'>
          <form>
            <div className="py-4 max-w-full mx-auto ">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div>
                  <table className='table-fixed mx-auto'>
                    <tbody>
                      <tr>
                        <td className='text-right pr-4 whitespace-nowrap'>
                          <label>
                            編集するチャート:
                          </label>
                        </td>
                        <td>
                          <select value={formState.chartId} onChange={handleChartChartIdChange} className='w-80'>
                            <option value="">選択してください</option>
                            {charts.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

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
        <tr>
          <td className='text-right pr-4 whitespace-nowrap'>
            <label>タイトルを変更:</label>
          </td>
          <td>
            <input
              type="text"
              value={formState.name}
              onChange={handleTitleChange}
              placeholder="チャート名orスキル名を入力"
              className='w-80'
            />
          </td>
        </tr>
        {(formState.depth === maxDepth && formState.itemNum !== 100)&& (
        <>
        <tr>
          <td className='text-right pr-4 whitespace-nowrap'>
            <label>編集するスキル名:</label>
          </td>
          <td>

              <select value={leafFormState.score} onChange={handleScoreChange}>
                <option value="">選択してください</option>
                {choiseScore.map(score => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
              </td>
        </tr>
        </>
        )}

      <div className='flex justify-end pt-4 gap-4'>
          <Button type="button" onClick={addOrUpdateEntry}>
            登録
          </Button>
        </div>

                  <div>
                    <Button type="button" onClick={onSubmit}>
                      確定
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="py-4 max-w-full mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className='font-semibold text-lg pb-4'>スコア基準</div>
              <table className="table-fixed mx-auto" >
                <thead >
                  <tr>
                    <th className='pr-6'>スコア</th>
                    <th>基準</th>
                  </tr>
                </thead>
                {scoreStandards.map((s, i) => (

                  <tbody key={i}>
                    <tr>
                      <th className='pr-6 font-normal'>{i}  </th>
                      <th className='text-left font-normal'>{s}</th>
                    </tr>
                  </tbody>

                ))}
              </table>
            </div>
          </div>
        </div>

        <div className="py-4 max-w-full mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className='font-semibold text-xl pb-4'>変更した項目</div>
            <div className='font-semibold text-lg pb-4'>変更したチャート</div>
            <table className='table-fixed mx-auto'>
              <thead>
                <tr>
                  <th className='pr-4'>親チャート</th>
                  <th className='pr-4'>チャートId</th>
                  <th className='pr-4'>頂点位置（右回り順）</th>
                  <th className='pr-4'>タイトル</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      {entry.parentId}
                    </td>
                    <td>
                      {entry.chartId}
                    </td>
                    <td>
                      {entry.itemNum}
                    </td>
                    <td>
                      {entry.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='font-semibold text-lg pt-8 pb-4'>変更したスキル</div>

            {leafEntries.length > 0 && (
              <>
                <table className='table-fixed mx-auto'>
                  <thead>
                    <tr>
                      <th className='pr-4'>スキルタイトル</th>
                      <th className='pr-4'>スコア</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leafEntries.map((leaf, index) => (
                      <tr key={index}>
                        <td>
                          {leaf.title}
                        </td>
                        <td>
                          {leaf.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </>
            )}

          </div>

          <div className='flex justify-end py-4 px-2'>
            <Button onClick={() => navigate(`/userpage/${sessionStorage.getItem('userId')}/chart/view`)}>実際のページで確認</Button>
          </div>
        </div>
      </div>
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

{/* <div>
<table className='table-fixed mx-auto'>
  <tbody>
    <tr>
      <td className='text-right pr-4'>
        <label>
          編集するチャート:
        </label>
      </td>
      <td>
        <select value={formState.chartId} onChange={handleChartChartIdChange} className='w-40'>
          <option value="">選択してください</option>
          {charts.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
    </tr>

    <tr>
      <td className='text-right pr-4'>
        <label>タイトルを変更:</label>
      </td>
      <td>
        <input
          type="text"
          value={formState.name}
          onChange={handleTitleChange}
          placeholder="テキストを入力"
          className='w-40'
        />
      </td>
    </tr>

    {formState.depth === maxDepth && (
      <>
        <tr>
          <td className='text-right pr-4'>
            <label>頂点の位置を決定してください:</label>
          </td>
          <td>
            <select value={formState.itemNum === 100 ? "選択したチャートの編集" : formState.itemNum}
              onChange={handleChartItemChange}>
              <option value="">選択してください</option>
              {choiceItem.map(c => (
                <option key={c.name} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </td>
        </tr>

        <tr>
          <td className='text-right pr-4'>
            <label>点数を決定してください:</label>
          </td>
          <td>
            <select value={leafFormState.score} onChange={handleScoreChange}>
              <option value="">選択してください</option>
              {choiseScore.map(score => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </td>
        </tr>
      </>
    )}
  </tbody>
</table>
</div> */}