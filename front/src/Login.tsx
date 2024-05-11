import React , { useState } from "react";

interface LoginProps{
    onSubmit: (user: string, password: string) => void;
}

const Login: React.FC<LoginProps>= ({ onSubmit })=> {
 const [user, setUser] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(user, password);
 };

 return(
    <form onSubmit={handleSubmit}>
      <h1>ログイン</h1>
      <label>
        ユーザ
        <input type="user" value={user} onChange={(e) => setUser(e.target.value)} />
      </label>
      <label>
        パスワード
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">ログイン</button>
    </form>
  );
};

export default Login;