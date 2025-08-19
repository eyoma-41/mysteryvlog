// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* =============== helpers =============== */
const ytIdFromUrl = (url) => {
  if (!url) return null;
  const m1 = url.match(/[?&]v=([^&#]+)/);
  const m2 = url.match(/youtu\.be\/([^?&#/]+)/);
  return m1?.[1] || m2?.[1] || null;
};

/* =============== Modal =============== */
function Modal({ open, onClose, item }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;
  const yt = ytIdFromUrl(item.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h4 className="font-bold text-lg">{String(item.title ?? "")}</h4>
          <button onClick={onClose} className="px-3 py-1 text-sm rounded-full border border-neutral-300">닫기</button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-xl border-2 border-dashed border-neutral-300 overflow-hidden bg-black grid place-items-center">
            {yt ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${yt}`}
                title={String(item.title ?? "")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : item.image ? (
              <img src={item.image} alt={String(item.title ?? "")} className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-400">미리보기</span>
            )}
          </div>
          <div>
            {item.meta && <div className="text-sm text-neutral-600">{item.meta}</div>}
            <p className="mt-3 text-neutral-800 whitespace-pre-line">{item.desc || item.excerpt || ""}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs items-center">
              {item.tag && <span className="px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">#{item.tag}</span>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-neutral-900 text-white">
                  링크 열기
                </a>
              )}
              <button
                className="px-3 py-1 rounded-full border border-neutral-300"
                onClick={() => navigator.clipboard?.writeText(item.url || window.location.href)}
              >
                공유
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== Cards / Grid =============== */
function Card({ item, onOpen }) {
  const [imgErr, setImgErr] = useState(false);
  const clickable = item?.modal === true || !!item?.url;

  const handleClick = () => {
    if (item?.modal === true || /youtube\.com|youtu\.be/.test(item?.url || "")) onOpen(item);
    else if (item?.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const titleSafe = String(item?.title ?? "");

  return (
    <article className={`group ${clickable ? "cursor-pointer" : "cursor-default"}`} onClick={clickable ? handleClick : undefined}>
      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-neutral-300 bg-white overflow-hidden grid place-items-center">
        {item?.image && !imgErr ? (
          <img
            src={item.image}
            alt={titleSafe}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-neutral-400">이미지</span>
        )}
      </div>
      <h4 className="mt-2 font-semibold line-clamp-2">{titleSafe}</h4>
      {item?.meta && <p className="text-[11px] text-neutral-500">{item.meta}</p>}
      {item?.excerpt && <p className="text-xs text-neutral-600 line-clamp-2">{item.excerpt}</p>}
    </article>
  );
}

function Grid({ title, items, onOpen }) {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
        <span className="text-sm text-neutral-400 select-none"> </span>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {safeItems.map((it) => (
          <Card key={it?.id ?? Math.random()} item={it} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

/* =============== content loader (/public/content.json) =============== */
const DEFAULT_CONTENT = {
  about: [
    { id: "about-1", title: "이야기의 시작", excerpt: "요약을 넣어주세요.", image: "", modal: true, desc: "" }
  ],
  meme: [
    { id: "m1", title: "p136 무… 무슨", image: "https://img.youtube.com/vi/MZcAnvE4gQ4/hqdefault.jpg", url: "https://www.youtube.com/watch?v=MZcAnvE4gQ4", modal: true, meta: "YouTube" }
  ],
  reference: [
    { id: "r1", title: "프로젝트 소개", excerpt: "", image: "" }
  ]
};

function useContent() {
  const [data, setData] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/content.json", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        setData({
          about: Array.isArray(json.about) ? json.about : DEFAULT_CONTENT.about,
          meme: Array.isArray(json.meme) ? json.meme : DEFAULT_CONTENT.meme,
          reference: Array.isArray(json.reference) ? json.reference : DEFAULT_CONTENT.reference,
        });
      } catch {
        // keep default
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return data;
}

/* =============== App =============== */
export default function App() {
  const content = useContent();
  const [active, setActive] = useState("about"); // about | meme | reference
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const onOpen = (item) => { setCurrent(item); setOpen(true); };

  const tabBtn =
    "px-4 py-2 rounded-xl border border-neutral-300 data-[active=true]:bg-pink-400 data-[active=true]:border-pink-400 data-[active=true]:text-neutral-900";

  const heroImg = "/hero-book.jpg"; // public/hero-book.jpg 업로드 시 표시
  const [heroErr, setHeroErr] = useState(false);

  const section = useMemo(() => {
    if (active === "about") return <Grid title="About 미브" items={content.about} onOpen={onOpen} />;
    if (active === "meme") return <Grid title="미브 밈 파헤치기" items={content.meme} onOpen={onOpen} />;
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
            <button className="hover:underline" onClick={() => setActive("about")}>About 미브</button>
            <button className="hover:underline" onClick={() => setActive("meme")}>미브 밈 파헤치기</button>
            <button className="hover:underline" onClick={() => setActive("reference")}>레퍼런스</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">사소한 실패에서 시작하는 미스터리</h1>
            <p className="mt-4 text-neutral-600">B급 유머와 집요한 추적 사이. 미브의 세계로 입장하십시오.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button data-active={active === "about"} className={tabBtn} onClick={() => setActive("about")}>About 미브</button>
              <button data-active={active === "meme"} className={tabBtn} onClick={() => setActive("meme")}>밈 파헤치기</button>
              <button data-active={active === "reference"} className={tabBtn} onClick={() => setActive("reference")}>레퍼런스</button>
            </div>
          </div>

          <div className="aspect-video w-full border-2 border-dashed border-neutral-300 rounded-2xl overflow-hidden bg-white grid place-items-center">
            {!heroErr ? (
              <img
                src={heroImg}
                alt="미스터리 브이로그 책 표지"
                className="w-full h-full object-cover"
                onError={() => setHeroErr(true)}
              />
            ) : (
              <span className="text-neutral-400">채널 트레일러 영상 자리 (public/hero-book.jpg 업로드하면 표시됩니다)</span>
            )}
          </div>
        </div>
      </section>

      {/* Only one category visible at a time */}
      {section}

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-400" />
            <span className="font-bold">mysteryvlog.fail</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a className="underline" href="https://instagram.com/eyoma_mag" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="underline" href="https://brunch.co.kr/@hakgome" target="_blank" rel="noopener noreferrer">Brunch</a>
            <a className="underline opacity-60 cursor-not-allowed" href="#" aria-disabled="true" title="준비 중입니다">Contact</a>
          </div>
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} item={current} />
    </div>
  );
}
