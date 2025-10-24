import React, { useEffect, useState } from "react";
import "./App.css"; // 스타일은 따로 빼거나 inline 유지 가능

export default function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("views");

  useEffect(() => {
    fetch("/content.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("content.json 불러오기 실패", err));
  }, []);

  const fixPath = (p) => (!p ? "" : p.startsWith("/") ? "." + p : p);

  const contentByKey = {
    views: "조회수 패널 — 나중에 실제 지표/설명 텍스트.",
    watch: "시청 시간 패널 — 설명/차트/문단 등.",
    subs: "신규 구독 패널 — 샘플 텍스트.",
    top: "인기 영상 패널 — 썸네일/리스트 가능.",
    rev: "수익 추정 패널 — KPI/표시 영역.",
  };

  const bannerUrl = data ? fixPath(data?.about?.[0]?.image) : "";
  const profileUrl = bannerUrl;

  return (
    <div className="app">
      {/* 상단 */}
      <header className="top">
        <div className="mark">
          <span className="logo"></span>
          <span>Studio</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button title="새로 만들기" aria-label="새로 만들기" className="pill">
            +
          </button>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="hero" aria-label="채널 헤더">
        <div
          id="banner"
          className="banner"
          style={{
            backgroundImage: bannerUrl ? `url('${bannerUrl}')` : "none",
          }}
        ></div>
        <div className="ch">
          <div
            id="avatar"
            className="avatar"
            style={{
              backgroundImage: profileUrl ? `url('${profileUrl}')` : "none",
            }}
          ></div>
          <div className="ch-meta">
            <div className="title">미스터리 브이로그</div>
            <div className="subs">구독자 <strong>320,158</strong></div>
          </div>
        </div>
      </section>

      {/* 채널 분석 */}
      <h2 className="sec-title">채널 분석</h2>
      <div className="hbar" role="tablist">
        {Object.keys(contentByKey).map((key) => (
          <button
            key={key}
            className={`pill ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {key === "views" && "조회수"}
            {key === "watch" && "시청 시간"}
            {key === "subs" && "신규 구독"}
            {key === "top" && "인기 영상"}
            {key === "rev" && "수익 추정"}
          </button>
        ))}
      </div>
      <div className="panel">
        <p>{contentByKey[activeTab]}</p>
      </div>

      {/* 하단 탭 */}
      <nav className="tabs">
        <a className="tab active" href="#">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 12.5a1 1 0 0 1 .4-.8l7-5a1 1 0 0 1 1.2 0l7 5a1 1 0 0 1 .4.8V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-6.5Z"
              fill="currentColor"
            />
          </svg>
          대시보드
        </a>
        <a className="tab" href="#">
          <svg viewBox="0 0 24 24">
            <path
              d="M3 7h18M7 3v18M3 12h18M3 17h12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          밈
        </a>
        <a className="tab" href="#">
          <svg viewBox="0 0 24 24">
            <path
              d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          레퍼런스
        </a>
        <a className="tab" href="#">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          비하인드
        </a>
        <a className="tab" href="#">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 18s3-6 8-6 8 6 8 6M10 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          수익창출
        </a>
      </nav>
    </div>
  );
}
