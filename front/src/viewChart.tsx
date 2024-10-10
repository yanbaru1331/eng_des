
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Account from "../components/Account";
import axios from "axios";
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
import { ChartData } from "chart.js";

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

//ここ%にするなら多分外部で設定してあげないと毎回レンダリングされてキューって小さくなっちゃう

const chart = {
  width: "400px",  // 固定幅
  height: "400px", // 固定高さ
  display: "flex",
};

const ViewChart: React.FC = () => {
  const [notPublic, setNotPublic] = useState<boolean>(false);
  const [userName, setUserNmae] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [charts, setCharts] = useState<chartRecived[]>([]);
  const [mainTitle, setMainTitle] = useState("");
  const [maxScore, setMaxScore] = useState<number>(0);
  const [scoreStandards, setScoreStandards] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const viewChartUserId = location.pathname.split("/")[2];
    console.log("viewChartUserId=", viewChartUserId);
    //ここでチャートを取得するかどうかの判断
    const checkUser = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/page?user_id=${viewChartUserId}`);
      console.log("checkres=", res.data.data);
      if (res.data.data.published !== true) {
        setNotPublic(true);
      }

    }
    const getUsername = async () => {
      const res = await axios.get("http://localhost:3000/api/user?user_id=" + location.pathname.split("/")[2]);
      console.log(res.data.data.username);
      setUserNmae(res.data.data.username);
  }
    //ここまだuser_idが固定値になっているので、後で変更する
    const getChart = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all_view_format?user_id=${viewChartUserId}`)
        .then((res) => {
          console.log("res=", res.data.data.pages.max_score);
          setMaxScore(res.data.data.pages.max_score);
          console.log("res=", res.data.data.charts);
          const charts = res.data.data.charts;
          setCharts(charts);
          setMainTitle(charts[0].title);
          setContactAddress(res.data.data.pages.contact_address);
        }).catch((error) => {
          //

          if (error.response.message === "Portfolio page is not existed") {
            console.log("error=", error.response.message);
          }
        });
    }



    if (viewChartUserId !== sessionStorage.getItem('userId')) {
      checkUser();
    }
    const getScoreStandards = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/page/score_standard?user_id=${viewChartUserId}`)
        .then((res) => {
          console.log("res=", res.data.data);
          const scoreStandards = res.data.data;
          setScoreStandards(scoreStandards);
        })
    }
    getUsername();
    getChart();
    getScoreStandards();
  }, []);
  console.log("charts = " + (charts));


  const data = charts.map((c) => ({
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
  }))
  const options = {
    scales: {
      r: {
        min: 0,
        max: maxScore,
        stepSize: 1,
      },
    },
  };
  const backPage = () => {
    navigate(`/`);
  }
  //個々からチャートを描画する処理
  if (notPublic) {
    return (
      <div>
        <h1>このユーザーは非公開です</h1>
        <Button onClick={backPage} >メインページに戻る</Button>
      </div>
    );
  }
  return (
    <>
    <div className="bg-gray-50">
        <header className="flex bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">{userName}さんのポートフォリオ</h1>
          </div>
          <div className='py-4'>
            <Button onClick={backPage}>戻る</Button>
          </div>
        </header>
        <div className="py-4 max-w-full mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">メインタイトル：{mainTitle}</h1>
            <div className='font-semibold text-lg py-4'>連絡先：{contactAddress}</div>
          </div>
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

{data.map((c, i) => (
        <div key={i} style={chart} className="chart">
          <Radar data={c} options={options} />
        </div>
      ))}
    </>
  );
}

export default ViewChart;