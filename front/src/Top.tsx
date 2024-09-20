import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Account from "../components/Account";

const UserPage: React.FC = ()=> {


    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const Login = () => {
        sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) : navigate(`/login`);
    };

    const account = () => {
        sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) :(setShowModal(true));
    };
    
    const Search = () => {
        console.log(search)
    }

    return (
        <div> 
        <h1>トップページ</h1>

        <p>ユーザ登録</p>
        <Button type="submit" onClick={account}>ユーザ登録</Button>
        <Account showFlag={showModal} setShowFlag={setShowModal}/>
        <Button onClick={Login}>ログイン</Button>

        <p>検索</p>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={Search}>検索</Button>
        </div>
        
    );
}

export default UserPage;