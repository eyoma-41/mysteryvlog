import { useState, useRef, useEffect } from "react";

// --- 상수/링크 ---
const YT_ID_EP4 = "MZcAnvE4gQ4"; // 사용자가 준 링크의 YouTube ID
const YT_URL_EP4 = `https://www.youtube.com/watch?v=${YT_ID_EP4}`;
const YT_THUMB_EP4 = `https://img.youtube.com/vi/${YT_ID_EP4}/hqdefault.jpg`; // 유튜브 기본 썸네일

// --- 초기 데이터 ---
const baseVideos = [
  { id: "ep-01", title: "파일 #01 — 촬영 버튼을 안 눌렀을 때", views: "1.2K", age: "5 days ago", thumb: "EP1", tag: "FAIL", desc: "사소한 실패에서 시작된 첫 사건. 카메라는 꺼져 있었고, 라디오는 켜져 있었다." },
  { id: "ep-02", title: "파일 #02 — 골목 끝의 소문", views: "2.4K", age: "10 days ago", thumb: "EP2", tag: "STORY", desc: "도시전설의 입구. 누군가는 봤고, 누군가는 못 봤다." },
  { id: "ep-03", title: "파일 #03 — 편집 타임라인이 사라진 밤", views: "913", age: "2 days ago", thumb: "EP3", tag: "FAIL", desc: "오토세이브가 우리 편이 아니었던 순간들." },
  // EP04: 유튜브 링크/메타 반영
  { id: "ep-04", title: "p136  무… 무슨", views: null, age: null, thumb: "EP4", tag: "STORY", desc: "낚시냐 진짜냐를 가르는 증거들.", url: YT_URL_EP4, thumbUrl: YT_THUMB_EP4 },
];

const playlistsTemplate = (videos) => ({
  about: [videos[0], videos[2], videos[1]],
  meme: [videos[3], videos[1], videos[0]],
});

// --- 유틸 ---
function formatViews(n){
  if (n == null) return null;
  const num = Number(n);
  if (Number.isNaN(num)) return null;
  if (num >= 1_000_000) return (num/1_000_000).toFixed(1).replace(/\.0$/,'') + 'M';
  if (num >= 1_000) return (num/1_000).toFixed(1).replace(/\.0$/,'') + 'K';
  return String(num);
}
function timeAgoFrom(dateStr){
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const sec = Math.floor((Date.now() - d.getTime())/1000);
  const m = Math.floor(sec/60), h = Math.floor(m/60), day = Math.floor(h/24), mo = Math.floor(day/30), y = Math.floor(day/365);
  if (y>0) return `${y} year${y>1?'s':''} ago`;
  if (mo>0) return `${mo} month${mo>1?'s':''} ago`;
  if (day>0) return `${day} days ago`;
  if (h>0) return `${h} hours ago`;
  if (m>0) return `${m} minutes ago`;
  return `just now`;
}
function metaText(v){
  const views = v?.views ? `${v.views} views` : null;
  const age = v?.age || null;
  if (!views && !age) return null; // 둘 다 없으면 숨김
  return `${views ?? ''}${views && age ? ' · ' : ''}${age ?? ''}`;
}
function showMeta(v){ return Boolean(v?.views) || Boolean(v?.age); }

function getYouTubeApiKey(){
  if (typeof window !== 'undefined' && window.YT_API_KEY) return window.YT_API_KEY;
  return null;
}
async function fetchYouTubeMeta(id, apiKey){
  if (!apiKey) return null;
  try{
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const item = json.items?.[0];
    if (!item) return null;
    return {
      views: item.statistics?.viewCount ?? null,
      publishedAt: item.snippet?.publishedAt ?? null,
      title: item.snippet?.title ?? null,
      thumb: item.snippet?.thumbnails?.high?.url ?? null,
    };
  }catch(e){ return null; }
}

// --- UI 컴포넌트 ---
function Modal({ open, onClose, video }){
  const dialogRef = useRef(null);
  useEffect(()=>{
    function onKey(e){ if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open || !video) return null;
  const ytMatch = video.url?.match(/[?&]v=([^&#]+)/);
  const ytId = ytMatch?.[1];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close overlay" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h4 className="font-bold text-lg">{video.title}</h4>
          <button onClick={onClose} className="px-3 py-1 text-sm rounded-full border border-neutral-300">닫기</button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-xl border-2 border-dashed border-neutral-300 overflow-hidden bg-black grid place-items-center">
            {ytId ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen />
            ) : (<span className="text-neutral-400">영상 플레이어 자리</span>)}
          </div>
          <div>
            {showMeta(video) && <div className="text-sm text-neutral-600">{metaText(video)}</div>}
            <p className="mt-3 text-neutral-800">{video.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs items-center">
              <span className="px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">#{video.tag}</span>
              {video.url && (<a href={video.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-neutral-900 text-white">유튜브로 보기</a>)}
              <button className="px-3 py-1 rounded-full border border-neutral-300" onClick={()=> navigator.clipboard?.writeText(window.location.href)}>공유</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ item, onOpen }){
  const handleClick = () => { onOpen(item); }; // 항상 모달 먼저
  return (
    <article className="group cursor-pointer" onClick={handleClick}>
      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-neutral-300 bg-white overflow-hidden grid place-items-center">
        {item.thumbUrl ? (<img src={item.thumbUrl} alt={`${item.title} 썸네일`} className="w-full h-full object-cover" />)
                       : (<span className="text-neutral-400">{item.thumb}</span>)}
      </div>
      <h4 className="mt-2 font-semibold line-clamp-2">{item.title}</h4>
      {showMeta(item) && (<p className="text-xs text-neutral-600">{metaText(item)}</p>)}
    </article>
  );
}

function Row({ title, items, onOpen }){
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
        <a className="text-sm underline" href="#">더 보기</a>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(v => <VideoCard key={v.id} item={v} onOpen={onOpen} />)}
      </div>
    </section>
  );
}

export default function App(){
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [videos, setVideos] = useState(baseVideos);
  const [playlists, setPlaylists] = useState(playlistsTemplate(baseVideos));
  const onOpen = (v) => { setCurrent(v); setOpen(true); };

  useEffect(()=>{
    const apiKey = getYouTubeApiKey();
    (async()=>{
      const m = await fetchYouTubeMeta(YT_ID_EP4, apiKey);
      if (!m) return;
      setVideos(prev => {
        const next = prev.map(v => v.id === 'ep-04'
          ? { ...v, title: m.title || v.title, views: formatViews(m.views) || v.views,
              age: timeAgoFrom(m.publishedAt) || v.age, thumbUrl: m.thumb || v.thumbUrl }
          : v );
        setPlaylists(playlistsTemplate(next));
        return next;
      });
    })();
  },[]);

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
            <a href="#about" className="hover:underline">About 미브</a>
            <a href="#meme" className="hover:underline">미브 밈 파헤치기</a>
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
              <a href="#about" className="px-4 py-2 rounded-xl bg-pink-400 text-neutral-900 font-semibold">About 미브</a>
              <a href="#meme" className="px-4 py-2 rounded-xl border border-neutral-300">밈 파헤치기</a>
            </div>
          </div>
          <div className="aspect-video w-full border-2 border-dashed border-neutral-300 rounded-2xl grid place-items-center bg-white">
            <span className="text-neutral-400">채널 트레일러 영상 자리</span>
          </div>
        </div>
      </section>

      {/* About 미브 (영상 그리드 → 이미지+텍스트 블록) */}
      <div id="about" className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-xl md:text-2xl font-extrabold mb-6">About 미브</h3>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 overflow-hidden bg-white grid place-items-center">
            {/* /public 폴더에 about-miv.jpg 추가해 주세요 */}
            <img src="/about-miv.jpg" alt="About 미브" className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.replaceWith(Object.assign(document.createElement('div'),{className:'text-neutral-400',innerText:'이미지 자리 (about-miv.jpg)'}));}} />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-3">사소한 실패에서 시작하는 미스터리</h4>
            <p className="text-neutral-600 leading-relaxed">
              키치한 톤과 진지한 집요함으로, 실패를 단서 삼아 세계를 의심합니다.
              <br /><br />
              미스터리 브이로그는 일상의 웃픈 실패와 도시전설을 뒤섞어
              새로운 시선으로 이야기를 풀어냅니다.
            </p>
          </div>
        </div>
      </div>

      {/* 미브 밈 파헤치기 (비디오 그리드 유지) */}
      <div id="meme">
        <Row title="미브 밈 파헤치기" items={playlists.meme} onOpen={onOpen} />
      </div>

      {/* 소개 */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="h-32 rounded-2xl border-2 border-dashed border-neutral-300 bg-white grid place-items-center">
            <span className="text-neutral-400">프로필</span>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl md:text-2xl font-extrabold">MysteryVlog.fail</h3>
            <p className="mt-2 text-neutral-600">키치한 톤과 진지한 집요함으로, 실패를 단서 삼아 세계를 의심합니다.</p>
            <div className="mt-3 text-sm text-neutral-600">구독자 123K · 영상 56개 · 2021-01 개설</div>
          </div>
        </div>
      </section>

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

      {/* Modal */}
      <Modal open={open} onClose={()=> setOpen(false)} video={current} />
    </div>
  );
}
