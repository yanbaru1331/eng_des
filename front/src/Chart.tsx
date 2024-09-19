import React, { useState, useEffect, useRef } from 'react';
import Button from "../components/Button";

import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
// import './MyChart.css'; // CSSファイルをインポート (不要になりました)

// Chart.jsで必要なコンポーネントを登録
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const MyChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [piece, setPiece] = useState("");

  const [label, setLabel] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    if (chartRef.current) {
      // 初回レンダリング時のみチャートを生成
      chart();
    }
  }, []);

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
            backgroundColor: "rgba(67, 133, 215, 0.5)",
            borderColor: "rgba(67, 133, 215, 1)",
          }]
        },
        options: {
          scales: {
            r: {
              max: 5,
              min: 0,
              ticks: {
                stepSize: 0
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
      <form className='chart-form' onSubmit={handleSubmit}>
        <h1>個数</h1>
        <label className="flex items-center mb-2">
          <span className="w-1/3 text-sm font-medium">要素数</span>
          <input
            type="number"
            value={piece}
            onChange={(e) => setPiece(e.target.value)}
            className="w-full rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500 border"
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
