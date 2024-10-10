import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";


interface LoginProps {
  onSubmit: (user: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('userId') !== null) {
      navigate(`/userpage/${sessionStorage.getItem('userId')}`);
    }
  }
  );

  const handleLogin = () => {
    axios.post("http://localhost:3000/api/user/login", {
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      if (res.data.user_id) {
        sessionStorage.setItem('userId', res.data.user_id);
        navigate(`/userpage/${res.data.user_id}`);
      } else {
        navigate(`/login`);
      }
    }).catch((error) => {
      console.log(error);
    });


    // navigate(`/userpage/${user}`);
    ///userpage/$(user)に遷移するページを作成
    // Navigate({to: "/userpage/$(user)"});


  };

  return (
    /* 変更前のコード。一応コメントで残しておく */
    // <form>
    //   <h1>ログイン</h1>
    //   <label>
    //     eメール
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     パスワード
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </label>
    //   <Button type="button" size="large" onClick={handleLogin}>ログイン</Button>
    // </form>

    <div className="container mx-auto px-4 py-8">
      <form className="flex flex-col space-y-4">
        <h1>ログイン</h1>
        <label>
          <span className="w-1/3 text-sm font-medium"> e メール</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span className="w-1/3 text-sm font-medium">パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button type="button" size="large" onClick={handleLogin}>ログイン</Button>
      </form>
    </div>

  );
};

export default Login;
