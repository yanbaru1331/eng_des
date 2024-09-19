import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Account from "../components/Account";

const Top: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const Login = () => {
    sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) : navigate(`/login`);
  };

  const account = () => {
    sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) : setShowModal(true);
  };

  const Search = () => {
    console.log(search);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">  {/* Tailwind classes for layout */}
      <h1 className="text-3xl font-bold mb-8">トップページ</h1>

      <div className="flex flex-col space-y-4">
        <p className="text-lg">ユーザ登録</p>
        <Button type="submit" onClick={account} className="w-full">
          ユーザ登録
        </Button>
        <Account showFlag={showModal} setShowFlag={setShowModal} />
        <Button onClick={Login} className="w-full">
          ログイン
        </Button>
      </div>

      <div className="flex flex-col mt-8">
        <p className="text-lg">検索</p>
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 mr-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <Button onClick={Search} className="w-auto">
            検索
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Top;
