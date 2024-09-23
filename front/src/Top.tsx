// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import Button from '../components/Button';
// import Account from "../components/Account";

// const UserPage: React.FC = ()=> {


//     const navigate = useNavigate();

//     const [search, setSearch] = useState("");
//     const [showModal, setShowModal] = useState(false);
//     const Login = () => {
//         sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) : navigate(`/login`);
//     };

//     const account = () => {
//         sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) :(setShowModal(true));
//     };

//     const Search = () => {
//         console.log(search)
//     }

//     return (
//         <div>
//         <h1>トップページ</h1>

//         <p>ユーザ登録</p>
//         <Button type="submit" onClick={account}>ユーザ登録</Button>
//         <Account showFlag={showModal} setShowFlag={setShowModal}/>
//         <Button onClick={Login}>ログイン</Button>

//         <p>検索</p>
//         <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
//         <Button onClick={Search}>検索</Button>
//         </div>

//     );
// }

// export default UserPage;

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
    <div>  {/* Tailwind classes for layout */}
      <h1>トップページ</h1>

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

      <div>
        <p className="text-lg">検索</p>
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
