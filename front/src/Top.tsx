import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';

const UserPage: React.FC = ()=> {


    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [username, setUsername] = useState("");
    const Login = () => {
        sessionStorage.getItem('AUTHORITY') ? navigate(`/userpage/${sessionStorage.getItem('AUTHORITY')}`) : navigate(`/login`);
    };

    const Submit = () => {
        sessionStorage.setItem('AUTHORITY', username)
        // navigate(`/submit`);
    };

    const Search = () => {
        console.log(search)
    }
    return (
        <div> 
        <h1>トップページ</h1>

        <p>ユーザ登録</p>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Button type="submit" onClick={Submit}>ユーザ登録</Button>
        <Button onClick={Login}>ログイン</Button>

        <p>検索</p>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={Search}>検索</Button>
        </div>
        
    );
}

export default UserPage;