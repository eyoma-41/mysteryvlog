// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   Generic helpers
========================================================= */
const YT_ID_FROM_URL = (url) => {
  if (!url) return null;
  const m1 = url.match(/[?&]v=([^&#]+)/);         // watch?v=ID
  const m2 = url.match(/youtu\.be\/([^?&#/]+)/);  // youtu.be/ID
  return m1?.[1] || m2?.[1] || null;
};

/* =========================================================
   Modal (YouTube/video preview)
========================================================= */
function Modal({ open, onClose, item }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || !item) return null;

  const ytId = YT_ID_FROM_URL(item.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h4 className="font-bold text-lg">{item.title}</h4>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-full border border-neutral-300"
          >
            닫기
          </button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-xl border-2 border-dashed border-neutral-300 overflow-hidden bg-black grid place-items-center">
            {ytId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-neutral-400">미리보기</span>
            )}
          </div>
          <div>
            {item.meta && (
              <div className="text-sm text-neutral-600">{item.meta}</div>
            )}
            <p className="mt-3 text-neutral-800 whitespace-pre-line">
              {item.excerpt || item.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs items-center">
              {item.tag && (
                <span className="px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">
                  #{item.tag}
                </span>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-neutral-900 text-white"
                >
                  링크 열기
                </a>
              )}
              {item.share !== false && (
                <button
                  className="px-3 py-1 rounded-full border border-neutral-300"
                  onClick={() =>
                    navigator.clipboard?.writeText(item.url || window.location.href)
                  }
                >
                  공유
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Card & Grid (for About / Meme / Reference)
========================================================= */
function Card({ item, onOpen }) {
  const clickable = Boolean(item.url) || item.modal === true;

  const onClick = () => {
    // YouTube나 modal:true면 모달 먼저
    if (item.modal === true || /youtube\.com|youtu\.be/.test(item.url || "")) {
      onOpen(item);
      return;
    }
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={`group ${clickable ? "cursor-pointer" : "cursor-default"}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-neutral-300 bg-white overflow-hidden grid place-items-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-neutral-400">이미지</span>
        )}
      </div>
      <h4 className="mt-2 font-semibold line-clamp-2">{item.title}</h4>
      {item.meta && <p className="text-[11px] text-neutral-500">{item.meta}</p>}
      {item.excerpt && (
        <p className="text-xs text-neutral-600 line-clamp-2">{item.excerpt}</p>
      )}
    </article>
  );
}

function Grid({ title, items, onOpen }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
        <span className="text-sm text-neutral-400 select-none"> </span>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((it) => (
          <Card key={it.id} item={it} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Content loader (from /content.json)
{
  "about": [
    { "id": "a1", "title": "이야기의 시작", "excerpt": "요약...", "image": "/about/start.jpg" },
    { "id": "a2", "title": "운망과 다이빙 엘", "excerpt": "요약...", "image": "/about/dive.jpg" }
  ],
  "meme": [
    { "id": "m1", "title": "p136 무… 무슨", "image": "https://img.youtube.com/vi/MZcAnvE4gQ4/hqdefault.jpg", "url": "https://www.youtube.com/watch?v=MZcAnvE4gQ4", "modal": true, "meta": "YouTube" }
  ],
  "reference": [
    { "id": "r1", "title": "프로젝트 노션", "excerpt": "문서 링크", "image": "/ref/notion.jpg", "url": "https://www.notion.so/..." }
  ]
}

========================================================= */
function useContent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/content.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json) setData(json);
        else {
          // Fallback: titles only (placeholders)
          const aboutTitles = [
            "이야기의 시작",
            "운망과 다이빙 엘",
            "세 명의 주인공",
            "미스터리-유튜브",
            "선택하지 않은 선택",
            "진정성",
            "번아웃",
            "양자역학 코펜하겐 해석",
            "인풋",
            "다차원 고려장",
            "하트 모양 구름",
            "Covid-19",
            "테트라포트늄",
            "죽음-의미",
          ];
          const stub = (t, i) => ({
            id: `stub-${i}`,
            title: t,
            excerpt: "",
            image: "",
          });
          setData({
            about: aboutTitles.map(stub),
            meme: [
              {
                id: "m1",
                title: "p136 무… 무슨",
                image: `https://img.youtube.com/vi/MZcAnvE4gQ4/hqdefault.jpg`,
                url: "https://www.youtube.com/watch?v=MZcAnvE4gQ4",
                meta: "",
                modal: true,
              },
            ],
            reference: [
              {
                id: "r1",
                title: "프로젝트 소개",
                image: "",
                url: "",
                meta: "",
              },
            ],
          });
        }
      })
      .catch(() =>
        setData({
          about: [],
          meme: [],
          reference: [],
        })
      );
  }, []);

  return data;
}

/* =========================================================
   App
========================================================= */
export default function App() {
  const content = useContent();
  const [active, setActive] = useState("about"); // about | meme | reference
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const onOpen = (item) => {
    setCurrent(item);
    setOpen(true);
  };

  // 탭 버튼 스타일
  const tabBtn =
    "px-4 py-2 rounded-xl border border-neutral-300 data-[active=true]:bg-pink-400 data-[active=true]:border-pink-400 data-[active=true]:text-neutral-900";

  const heroImg = "/hero-book.jpg"; // public/hero-book.jpg

  const sectionByActive = useMemo(() => {
    if (!content) return null;
    if (active === "about")
      return <Grid title="About 미브" items={content.about} onOpen={onOpen} />;
    if (active === "meme")
      return (
        <Grid title="미브 밈 파헤치기" items={content.meme} onOpen={onOpen} />
      );
    return <Grid title="레퍼런스" items={content.reference} onOpen={onOpen} />;
  }, [active, content]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-400" />
            <span className="font-black">『미스터리 브이로그』</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button className="hover:underline" onClick={() => setActive("about")}>
              About 미브
            </button>
            <button className="hover:underline" onClick={() => setActive("meme")}>
              미브 밈 파헤치기
            </button>
            <button
              className="hover:underline"
              onClick={() => setActive("reference")}
            >
              레퍼런스
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              사소한 실패에서 시작하는 미스터리
            </h1>
            <p className="mt-4 text-neutral-600">
              B급 유머와 집요한 추적 사이. 미브의 세계로 입장하십시오.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                data-active={active === "about"}
                className={tabBtn}
                onClick={() => setActive("about")}
              >
                About 미브
              </button>
              <button
                data-active={active === "meme"}
                className={tabBtn}
                onClick={() => setActive("meme")}
              >
                밈 파헤치기
              </button>
              <button
                data-active={active === "reference"}
                className={tabBtn}
                onClick={() => setActive("reference")}
              >
                레퍼런스
              </button>
            </div>
          </div>

          <div className="aspect-video w-full border-2 border-dashed border-neutral-300 rounded-2xl overflow-hidden bg-white grid place-items-center">
            <img
              src={heroImg}
              alt="미스터리 브이로그 책 표지"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.replaceWith(
                  Object.assign(document.createElement("div"), {
                    className: "text-neutral-400",
                    innerText:
                      "채널 트레일러 영상 자리 (public/hero-book.jpg 업로드하면 표시됩니다)",
                  })
                );
              }}
            />
          </div>
        </div>
      </section>

      {/* Category view (only one shown at a time) */}
      {sectionByActive}

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-400" />
            <span className="font-bold">mysteryvlog.fail</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a
              className="underline"
              href="https://instagram.com/eyoma_mag"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              className="underline"
              href="https://brunch.co.kr/@hakgome"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brunch
            </a>
            <a
              className="underline opacity-60 cursor-not-allowed"
              href="#"
              aria-disabled="true"
              title="준비 중입니다"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} item={current} />
    </div>
  );
}
