import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface LoginProps {
  onSubmit: (user: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidUser = async (user: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
      }).catch((error) => {
      console.error(error);
      throw new Error("ネットワークエラーが発生しました");
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.result === "ok") {
        return true;
      } else if (data.result === "passNg") {
        return false;
      } else {
        throw new Error("ログインに失敗しました");
      }
    }catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await isValidUser(user, password);
    if (isValid) {
      console.log("ログイン成功");
      sessionStorage.setItem('AUTHORITY', user);
      navigate(`/userpage/${user}`);
    }
    onSubmit(user, password);
  };

  return (
    <div className="container mx-auto px-4 py-8"> {/* Tailwind classes for layout */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold mb-4">ログイン</h1>
        <label className="flex items-center mb-2">
          <span className="w-1/3 text-sm font-medium">ユーザ</span>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500 border"
          />
        </label>
        <label className="flex items-center mb-4">
          <span className="w-1/3 text-sm font-medium">パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500 border"
          />
        </label>
        <Button type="submit" size="large" className="w-full">
          ログイン
        </Button>
      </form>
    </div>
  );
};

export default Login;
