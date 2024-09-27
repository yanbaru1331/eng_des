
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

//ここ%にするなら多分外部で設定してあげないと毎回レンダリングされてキューって小さくなっちゃう

const chart = {
  width: "400px",  // 固定幅
  height: "400px", // 固定高さ
  display: "flex",
};

const ViewChart: React.FC = () => {
  const [notPublic, setNotPublic] = useState<boolean>(false);
  const [charts, setCharts] = useState<chartRecived[]>([]);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [scoreStandards, setScoreStandards] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const viewChartUserId = location.pathname.split("/")[2];
    console.log("viewChartUserId=", viewChartUserId);
    //ここでチャートを取得するかどうかの判断
    const checkUser = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/page?user_id=${viewChartUserId}`);
      if (res.data.published !== true) {
        setNotPublic(true);
      }

    }
    //ここまだuser_idが固定値になっているので、後で変更する
    const getChart = async () => {
      const res = await axios.get(`http://localhost:3000/api/portfolio/chart/all/test?user_id=${viewChartUserId}`)
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
    getChart();
    getScoreStandards();
  }, []);
  console.log("charts = " + (charts));


  const data = charts.map((c) => ({
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
      <div>点数区分</div>
      {scoreStandards.map((s, i) => (
        <div key={i}>点数{i}点   {s}</div>
      ))}

      {data.map((c, i) => (
        <div key={i} style={chart} className="chart">
          <Radar data={c} options={options} />
        </div>
      ))}

    </>
  );
}

export default ViewChart;