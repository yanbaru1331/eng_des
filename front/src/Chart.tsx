// import React, { useEffect, useRef, useState } from 'react';
// import Button from "../components/Button";

// import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
// // import './MyChart.css'; // CSSファイルをインポート

// // Chart.jsで必要なコンポーネントを登録
// Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// const MyChart: React.FC = () => {
//   const chartRef = useRef<HTMLCanvasElement | null>(null);
//   const chartInstanceRef = useRef<Chart | null>(null);

//   const [piece, setPiece] = useState("");
//   // const [password, setPassword] = useState("");

//   // type Array1<T> = [T, ...T[]];

//   //それがうまく行ったら親子関係を作ってみる
//   //rootは一旦NULL？
//   // let label = Array.from({ length: 3 }, () => "");;
//   // let data = Array.from({ length: 3 }, () => 0);;
//   const [label, setLabel] = useState<string[]>([]);
//   const [data, setData] = useState<number[]>([]);
// //  for (let i = 0; i < label.length; i++) {
// //     data[i] = Math.floor(Math.random() * 6);
// //   }
//   function chart() {
//     if (chartRef.current) {
//       // 既存のチャートがある場合は破棄
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.destroy();
//       }

//       // 新しいチャートを作成
//       chartInstanceRef.current = new Chart(chartRef.current, {
//         type: 'radar',
//         data: {
//           labels: label,
//           datasets: [{
//             label: "前期試験成績",
//             data: data,
//             backgroundColor: "rgba(67, 133, 215, 0.5)",  // グラフ背景色
//             borderColor: "rgba(67, 133, 215, 1)",        // グラフボーダー色
//           }]
//         },
//         options: {
//           scales: {
//             r: {
//               max: 5,        // グラフの最大値
//               min: 0,        // グラフの最小値
//               ticks: {
//                 stepSize: 0  // 目盛間隔
//               }
//             }
//           },
//         }
//       });
//     }
//   }

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const newLabels: string[] = [];
//     const newData: number[] = [];
//     for (let i = 0; i < Number(piece); i++) {
//       newLabels[i] = (`要素${i+1}`);
//       newData.push(Math.floor(Math.random() * 6));
//     }
//     setLabel([...newLabels]);
//     setData([...newData]);
//     await chart();
//   };
//   return (
//     <div>
//     <form className='chart-form' onClick={handleSubmit}>
//     <h1>個数</h1>
//       <label>
//         ユーザ
//         <input
//           type="number"
//           value={piece}
//           onChange={(e) => setPiece(e.target.value)}
//         />
//       </label>
//       <Button type="button" size="large">ログイン</Button>
//     </form>
//     <div className="chart-container" style={{position: 'relative',height:'40vh', width:'80vw'}}>
//       <canvas id="myChart" ref={chartRef}></canvas>
//     </div>
//     </div>
//   );
// };

// export default MyChart;

import React, { useEffect, useRef, useState } from 'react';
import Button from "../components/Button";

import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
// import './MyChart.css'; // CSSファイルをインポート

// Chart.jsで必要なコンポーネントを登録
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const MyChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [piece, setPiece] = useState("");
  // const [password, setPassword] = useState("");

  // type Array1<T> = [T, ...T[]];

  //それがうまく行ったら親子関係を作ってみる
  //rootは一旦NULL？
  // let label = Array.from({ length: 3 }, () => "");;
  // let data = Array.from({ length: 3 }, () => 0);;
  const [label, setLabel] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
//  for (let i = 0; i < label.length; i++) {
//     data[i] = Math.floor(Math.random() * 6);
//   }
  const chart = () => {
    if (chartRef.current) {
      // 既存のチャートがある場合は破棄
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // 新しいチャートを作成
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'radar',
        data: {
          labels: label,
          datasets: [{
            label: "前期試験成績",
            data: data,
            backgroundColor: "rgba(67, 133, 215, 0.5)", // グラフ背景色
            borderColor: "rgba(67, 133, 215, 1)",       // グラフボーダー色
          }]
        },
        options: {
          scales: {
            r: {
              max: 5,         // グラフの最大値
              min: 0,         // グラフの最小値
              ticks: {
                stepSize: 0   // 目盛間隔
              }
            }
          }
        }
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newLabels: string[] = [];
    const newData: number[] = [];
    for (let i = 0; i < Number(piece); i++) {
      newLabels[i] = (`要素${i + 1}`);
      newData.push(Math.floor(Math.random() * 6));
    }

    setLabel([...newLabels]);
    setData([...newData]);

    await chart();
  };

  return (
    <div className="container mx-auto px-4 py-8"> {/* Tailwind CSS  */}
      <form onSubmit={handleSubmit}>
        <h1>個数</h1>
        <label>
          <input
            type="number"
            value={piece}
            onChange={(e) => setPiece(e.target.value)}
          />
        </label>
        <Button type="button" size="large" className="w-full">
          生成
        </Button>
      </form>
      <div className="chart-container relative h-40 w-80"> {/* Tailwind CSS  */}
        <canvas id="myChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MyChart;
