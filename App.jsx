:root {
  --bg: #fff;
  --text: #111318;
  --muted: #6b7280;
  --border: #e6e8eb;
  --brand: #ff0033;
  --card: #f7f7f8;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --r: 18px;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Pretendard, system-ui, "Noto Sans KR", sans-serif; }
.app { max-width: 720px; margin: 0 auto; padding-bottom: 88px; }

.top { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid var(--border); display: flex; gap: 10px; align-items: center; padding: 12px 16px; }
.mark { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; }
.logo { width: 26px; height: 18px; border-radius: 6px; background: var(--brand); position: relative; }
.logo:after { content: ""; position: absolute; left: 9px; top: 3px; border-left: 8px solid #fff; border-top: 6px solid transparent; border-bottom: 6px solid transparent; }

.hero { padding: 0 16px 12px; }
.banner { width: 100%; aspect-ratio: 16/9; border-radius: 14px; background: #e9eaee center/cover no-repeat; border: 1px solid var(--border); }
.ch { display: flex; gap: 14px; align-items: center; margin-top: -28px; padding: 0 10px; }
.avatar { width: 68px; height: 68px; border-radius: 999px; border: 3px solid #fff; background: #ddd center/cover no-repeat; box-shadow: var(--shadow); }
.ch-meta { display: flex; flex-direction: column; gap: 4px; }
.title { font-size: 22px; font-weight: 900; }
.subs { color: var(--muted); font-size: 14px; }

.sec-title { font-weight: 900; padding: 8px 16px 6px; }
.hbar { display: flex; gap: 10px; overflow-x: auto; padding: 0 16px 8px; scroll-snap-type: x mandatory; }
.pill { flex: 0 0 auto; scroll-snap-align: start; padding: 10px 14px; border: 1px solid var(--border); border-radius: 999px; background: #fff; font-weight: 700; font-size: 14px; cursor: pointer; user-select: none; }
.pill.active { background: var(--brand); color: #fff; border-color: var(--brand); }

.panel { margin: 8px 16px 14px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 16px; min-height: 90px; }

.tabs { position: fixed; left: 0; right: 0; bottom: 0; background: #fff; border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(5, 1fr); height: 72px; }
.tab { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: #333; text-decoration: none; }
.tab svg { width: 22px; height: 22px; }
.tab.active { color: var(--brand); font-weight: 800; }
