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
  const [loginFaild, setLoginFaild] = useState(false);

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
      console.log(error.response.status);
      setLoginFaild(true);
    });


    // navigate(`/userpage/${user}`);
    ///userpage/$(user)に遷移するページを作成
    // Navigate({to: "/userpage/$(user)"});


  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
        </div>
      </header>
      <form>
        <div className="py-4 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 ">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">email</h2>
            <div className="space-y-1">
              <input
                type="text"
                value={email}
                placeholder="example@mail.com"
                className="w-full text-lg py-2"

                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="py-4 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 ">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">パスワード</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={password}
                placeholder="ここパスワードを入力"
                className="w-full text-lg py-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* <label>
          eメール
          <input
            type="email"
            value={email}
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label> */}
        <div className="py-4">
          <Button type="button" size="large" onClick={handleLogin}>ログイン</Button>
        </div>
        {loginFaild && <p className="py-4">ログインに失敗しました</p>}
      </form>
    </div>
  );
};

export default Login;
