
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
const ViewChart: React.FC = ()=> {
    const [checkPublic, setCheckPublic] = useState<boolean>(false);
    const [charts, setCharts] = useState<chartRecived[]>([]);
    useEffect(() => {
    //     const checkUser = async () => {
    //     const res = await axios.get("http://localhost:3000/api/portfolio/page?user_id=1")
    //         setCheckPublic(res.data.published);
    //         if (res.data.published === true){
    //             console.log("1=",getChart());
    //         }
            
    // }
        const getChart = async () => { 
            const res = await axios.get("http://localhost:3000/api/portfolio/chart/all/test?user_id=1")
            .then((res) => {
                console.log("res=",res.data.data.charts);
                const charts = res.data.data.charts;    
                setCharts(charts);
                });

        }
        getChart();

    }, []);
    console.log("charts = "+(charts));

    
    const data = charts.map((c) =>({
      labels: c.label,
      datasets: [
        {
          label: c.title,
          data: c.childrenScores,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
  }))
      const options = {
        scales: {
          r: {
            min: 0,
            max: 5,
            stepSize: 1,
          },
        },
      };
    //個々からチャートを描画する処理
    return(
            <>
            {data.map((c, i) => (
              <div key={i} style={chart} className="chart">
                <Radar data={c} options={options} />

              </div>
            ))}
              
            </>
    );
}

export default ViewChart;