<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>미스터리 브이로그 — 대시보드</title>
  <style>
    :root{--bg:#fff;--text:#111318;--muted:#6b7280;--border:#e6e8eb;--brand:#ff0033;--card:#f7f7f8;--shadow:0 1px 2px rgba(0,0,0,.06);--r:18px}
    *{box-sizing:border-box}
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Pretendard,system-ui,"Noto Sans KR",sans-serif;color:var(--text);background:var(--bg)}
    .app{max-width:720px;margin:0 auto;padding-bottom:88px}
    .top{position:sticky;top:0;z-index:10;background:#fff;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:center;padding:12px 16px}
    .mark{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px}
    .logo{width:26px;height:18px;border-radius:6px;background:var(--brand);position:relative}
    .logo:after{content:"";position:absolute;left:9px;top:3px;border-left:8px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent}
    .hero{padding:0 16px 12px}
    .banner{width:100%;aspect-ratio:16/9;border-radius:14px;background:#e9eaee center/cover no-repeat;border:1px solid var(--border)}
    .ch{display:flex;gap:14px;align-items:center;margin-top:-28px;padding:0 10px}
    .avatar{width:68px;height:68px;border-radius:999px;border:3px solid #fff;background:#ddd center/cover no-repeat;box-shadow:var(--shadow)}
    .ch-meta{display:flex;flex-direction:column;gap:4px}
    .title{font-size:22px;font-weight:900}
    .subs{color:var(--muted);font-size:14px}
    .sec-title{font-weight:900;padding:8px 16px 6px}
    .hbar{display:flex;gap:10px;overflow-x:auto;padding:0 16px 8px;scroll-snap-type:x mandatory}
    .pill{flex:0 0 auto;scroll-snap-align:start;padding:10px 14px;border:1px solid var(--border);border-radius:999px;background:#fff;font-weight:700;font-size:14px;cursor:pointer;user-select:none}
    .pill.active{background:var(--brand);color:#fff;border-color:var(--brand)}
    .panel{margin:8px 16px 14px;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px;min-height:90px}
    .panel .hint{color:var(--muted);font-size:14px}
    .tabs{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(5,1fr);height:72px}
    .tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:12px;color:#333;text-decoration:none}
    .tab svg{width:22px;height:22px}
    .tab.active{color:var(--brand);font-weight:800}
  </style>
</head>
<body>
  <div class="app">
    <header class="top">
      <div class="mark"><span class="logo"></span><span>Studio</span></div>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button title="새로 만들기" aria-label="새로 만들기" class="pill" style="padding:6px 10px">+</button>
      </div>
    </header>

    <!-- 배너 + 프로필 + 타이틀 -->
    <section class="hero" aria-label="채널 헤더">
      <div id="banner" class="banner"></div>
      <div class="ch">
        <div id="avatar" class="avatar" aria-label="프로필 이미지"></div>
        <div class="ch-meta">
          <div class="title" id="title">미스터리 브이로그</div>
          <div class="subs">구독자 <strong id="subs">320,158</strong></div>
        </div>
      </div>
    </section>

    <!-- 채널 분석 -->
    <h2 class="sec-title">채널 분석</h2>
    <div class="hbar" role="tablist" aria-label="채널 분석 메뉴">
      <button class="pill active" role="tab" aria-selected="true" data-key="views">조회수</button>
      <button class="pill" role="tab" aria-selected="false" data-key="watch">시청 시간</button>
      <button class="pill" role="tab" aria-selected="false" data-key="subs">신규 구독</button>
      <button class="pill" role="tab" aria-selected="false" data-key="top">인기 영상</button>
      <button class="pill" role="tab" aria-selected="false" data-key="rev">수익 추정</button>
    </div>
    <div id="panel" class="panel" role="region" aria-live="polite">
      <div class="hint">위의 버튼을 눌러 내용을 표시합니다. (나중에 글 채워 넣을 영역)</div>
    </div>
  </div>

  <!-- 하단 탭 -->
  <nav class="tabs" aria-label="하단 메뉴">
    <a class="tab active" href="#" data-page="dashboard">
      <svg viewBox="0 0 24 24"><path d="M4 12.5a1 1 0 0 1 .4-.8l7-5a1 1 0 0 1 1.2 0l7 5a1 1 0 0 1 .4.8V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-6.5Z" fill="currentColor"/></svg>
      대시보드
    </a>
    <a class="tab" href="#" data-page="meme">
      <svg viewBox="0 0 24 24"><path d="M3 7h18M7 3v18M3 12h18M3 17h12" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      밈
    </a>
    <a class="tab" href="#" data-page="ref">
      <svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      레퍼런스
    </a>
    <a class="tab" href="#" data-page="behind">
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      비하인드
    </a>
    <a class="tab" href="#" data-page="revenue">
      <svg viewBox="0 0 24 24"><path d="M4 18s3-6 8-6 8 6 8 6M10 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      수익창출
    </a>
  </nav>

  <!-- 1) 인라인 JSON(네가 준 예시 그대로) -->
  <script type="application/json" id="content">
  {
    "about": [
      {
        "id": "about-1",
        "title": "이야기의 시작",
        "excerpt": "꿈을 꾸었다. 나는 물 속에 있었고 수면으로부터 내려오던 빛이 점차 사라졌다.",
        "desc": "꿈을 꾸었다. 나는 물 속에 있었고 수면으로부터 내려오던 빛이 점차 사라졌다. 몸이 으스스해져서 올려다보니 그곳에서는 덩어리들이 떨어지고 있었다. 그 중 하나가 내 앞으로 하강해갔고, 나는 발가벗은 노인의 시체라는 걸 알게되었다. 피부에 살짝 스쳐간 그 감촉은 차갑다. 차갑다 못해 얼어버릴 것 같은 느낌이었다. 그건 냉동인간이었다.",
        "image": "/about/start.jpg",
        "modal": true
      }
    ],
    "meme": [{"id":"m1","title":"p136 무… 무슨","image":"https://img.youtube.com/vi/MZcAnvE4gQ4/hqdefault.jpg","url":"https://www.youtube.com/watch?v=MZcAnvE4gQ4","modal":true,"meta":"YouTube"}],
    "reference": [{"id":"r1","title":"프로젝트 소개","excerpt":"","image":""}]
  }
  </script>

  <script>
    // 유틸: 루트 슬래시(/) 경로를 로컬용으로 보정
    const fixPath = (p)=> !p ? "" : (p.startsWith("/") ? ("."+p) : p);

    // 분석 탭 동작
    const panel = document.getElementById('panel');
    const pills = document.querySelectorAll('.hbar .pill');
    const contentByKey = {
      views:"조회수 패널 — 나중에 실제 지표/설명 텍스트.",
      watch:"시청 시간 패널 — 설명/차트/문단 등.",
      subs:"신규 구독 패널 — 샘플 텍스트.",
      top:"인기 영상 패널 — 썸네일/리스트 가능.",
      rev:"수익 추정 패널 — KPI/표시 영역."
    };
    pills.forEach(btn=>{
      btn.addEventListener('click',()=>{
        pills.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
        btn.classList.add('active');btn.setAttribute('aria-selected','true');
        panel.innerHTML = "<p>"+(contentByKey[btn.dataset.key]||"내용 준비 중")+"</p>";
      });
    });

    // 1) 인라인 JSON 로딩
    function loadFromInline(){
      try{
        const raw = document.getElementById('content').textContent.trim();
        const data = JSON.parse(raw);
        applyData(data);
      }catch(e){ console.warn('inline json parse fail', e); }
    }

    // 2) 외부 파일로 전환하고 싶으면 이 함수로 교체
    async function loadFromFetch(){
      const r = await fetch('content.json');
      const data = await r.json();
      applyData(data);
    }

    function applyData(data){
      // 배너 = about[0].image, 프로필 동일 사용(원하면 profileImage 키 추가)
      const bannerUrl = fixPath(data?.about?.[0]?.image || "");
      if(bannerUrl) document.getElementById('banner').style.backgroundImage = `url('${bannerUrl}')`;
      const profileUrl = bannerUrl;
      if(profileUrl) document.getElementById('avatar').style.backgroundImage = `url('${profileUrl}')`;
      // 타이틀/구독자 고정값 요구사항
      document.getElementById('title').textContent = '미스터리 브이로그';
      document.getElementById('subs').textContent = '320,158';
    }

    // 기본은 인라인 로딩(파일환경에서도 100% 동작)
    loadFromInline();
    // 외부 JSON로 바꿀 땐 위 줄을 주석처리하고 loadFromFetch() 호출하면 됨.
    // loadFromFetch();
  </script>
</body>
</html>
