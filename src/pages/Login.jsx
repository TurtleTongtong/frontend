// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import LoginImage from "../assets/login_img.png";
import logoTurtle from "../assets/logo-turtle.png";

const LOGIN_API_URL = "/api/auth/login";

function LoginPage() {
  const navigate = useNavigate();

  // 입력값 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 요청 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        let msg = "로그인에 실패했습니다.";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await res.json();

      // 토큰이 내려온다면 저장 (키 이름은 필요에 따라 변경하세요)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 로그인 성공 후 이동할 페이지
      navigate("/");

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <img src={LoginImage} alt="서핑 이미지" />
      </div>

      <div className="login-panel">
        <header className="login-header">
          <button
            type="button"
            className="login-back-btn"
            onClick={() => navigate("/")}
          >
            <span className="login-back-icon">←</span>
          </button>
          <h1 className="login-title">로그인</h1>
        </header>

        <main className="login-main">
          <div className="login-logo">
            <img src={logoTurtle} alt="거북섬 커넥트" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <input
                type="text"
                className="login-input"
                placeholder="아이디(이메일/계정)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <input
                type="password"
                className="login-input"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="login-error-msg">
                {errorMsg}
              </div>
            )}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>아이디 저장</span>
              </label>

              <div className="login-links">
                <button
                  type="button"
                  className="login-link"
                  onClick={() => navigate("/signup")}
                >
                  회원가입
                </button>
                <span className="login-link-sep">|</span>
                <button type="button" className="login-link">
                  아이디 찾기
                </button>
                <span className="login-link-sep">|</span>
                <button type="button" className="login-link">
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
