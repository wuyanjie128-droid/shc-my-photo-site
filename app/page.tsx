"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Theme = "dark" | "light";
type Feed = "recommended" | "following";
type NavId = "publish" | "home" | "search" | "messages" | "profile";

type Album = {
  id: string | number;
  title: string;
  city: string;
  author: string;
  price: number;
  image: string;
  preview: string;
  previewMime: string;
  count: number;
  followed: boolean;
  description: string;
  likeCount: number;
  commentCount: number;
};

const fallbackAlbums: Album[] = [
  { id: 1, title: "雨落之后，重庆", city: "重庆", author: "YUAN / 原", price: 68, count: 24, followed: true, description: "雨停后的山城，霓虹和江面一起醒来。", likeCount: 20, commentCount: 2, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1573295918221-c650d1990fc3?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1573295918221-c650d1990fc3?auto=format&fit=crop&w=1400&q=88" },
  { id: 2, title: "外滩的蓝色一小时", city: "上海", author: "LINYU", price: 88, count: 18, followed: false, description: "日落后、华灯前，上海短暂的蓝色时刻。", likeCount: 36, commentCount: 5, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=900&q=42", image: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1400&q=88" },
  { id: 3, title: "霓虹在维港醒来", city: "香港", author: "FRAME 23", price: 108, count: 31, followed: true, description: "维港两岸的光被潮水拉成一封夜信。", likeCount: 68, commentCount: 8, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=88" },
  { id: 4, title: "西湖，清晨六点", city: "杭州", author: "空镜计划", price: 58, count: 16, followed: false, description: "游客到来前，湖面只留下雾和桨声。", likeCount: 27, commentCount: 3, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1623204918735-e34e4cb2d731?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1623204918735-e34e4cb2d731?auto=format&fit=crop&w=1400&q=88" },
  { id: 5, title: "北京的旧与新", city: "北京", author: "北纬39°", price: 76, count: 22, followed: true, description: "胡同、城墙与玻璃幕墙在同一条轴线上。", likeCount: 42, commentCount: 6, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1400&q=88" },
  { id: 6, title: "街角成都", city: "成都", author: "一格成都", price: 48, count: 27, followed: false, description: "慢下来的街角，装着茶馆和晚风。", likeCount: 31, commentCount: 4, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1400&q=88" },
  { id: 7, title: "东京失眠地图", city: "东京", author: "AKI MORI", price: 98, count: 34, followed: false, description: "末班车之后，城市仍有自己的呼吸。", likeCount: 73, commentCount: 11, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=88" },
  { id: 8, title: "海风经过厦门", city: "厦门", author: "SEA FRAME", price: 52, count: 20, followed: true, description: "海风把夏天推过白色堤岸。", likeCount: 24, commentCount: 3, previewMime: "image/jpeg", preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=45", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=88" },
];

const copy = {
  zh: {
    publish: "发布", home: "主页", search: "搜索", messages: "消息", profile: "我的", settings: "设置",
    recommended: "推荐", following: "关注", headline: "值得被看见的城市片段", subhead: "来自全球创作者的可收藏、可购买摄影图集。",
    photos: "张照片", buy: "查看图集", searchTitle: "搜索图集", searchHint: "输入城市、作者或图集名称",
    appearance: "外观", language: "语言", dark: "纯黑", light: "纯白", close: "关闭",
    uploadTitle: "发布你的图集", uploadHint: "选择一张封面图，开始创建可售卖图集。", choose: "选择封面", done: "继续发布",
    empty: "没有找到相关图集", messageTitle: "消息", profileTitle: "我的空间",
  },
  en: {
    publish: "Publish", home: "Home", search: "Search", messages: "Messages", profile: "Profile", settings: "Settings",
    recommended: "For you", following: "Following", headline: "City stories worth seeing", subhead: "Collectable photo albums from independent creators around the world.",
    photos: "photos", buy: "View album", searchTitle: "Search albums", searchHint: "Search by city, creator or title",
    appearance: "Appearance", language: "Language", dark: "Black", light: "White", close: "Close",
    uploadTitle: "Publish an album", uploadHint: "Choose a cover image to begin your sellable collection.", choose: "Choose cover", done: "Continue",
    empty: "No albums found", messageTitle: "Messages", profileTitle: "My space",
  },
};

function NavIcon({ id }: { id: NavId | "settings" }) {
  const paths: Record<NavId | "settings", React.ReactNode> = {
    publish: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M12 8v8M8 12h8" /></>,
    home: <><path d="m3 10.5 9-7.5 9 7.5V21h-6v-6H9v6H3Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    messages: <><path d="M5.5 4h13A2.5 2.5 0 0 1 21 6.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4h-.5A2.5 2.5 0 0 1 3 14.5v-8A2.5 2.5 0 0 1 5.5 4Z" /><path d="M7.5 9h9M7.5 12.5h6" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.7-4.5 3.2-7 7.5-7s6.8 2.5 7.5 7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.07A1.7 1.7 0 0 0 8.94 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.53-1H3v-4h.07A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.07V3h4v.07A1.7 1.7 0 0 0 15.06 4.6a1.7 1.7 0 0 0 1.88-.34L17 4.2 19.8 7l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.62.84 1.03 1.53 1.03H21v4h-.07A1.7 1.7 0 0 0 19.4 15Z" /></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[id]}</svg>;
}

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>(fallbackAlbums);
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [collapsed, setCollapsed] = useState(false);
  const [feed, setFeed] = useState<Feed>("recommended");
  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Album | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string | number>>(new Set());
  const [menuId, setMenuId] = useState<string | number | null>(null);
  const [commentId, setCommentId] = useState<string | number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [interactionMessage, setInteractionMessage] = useState("");
  const [soundIds, setSoundIds] = useState<Set<string | number>>(new Set());
  const fileInput = useRef<HTMLInputElement>(null);
  const t = copy[language];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("linkarda-theme") as Theme | null;
    const savedLanguage = window.localStorage.getItem("linkarda-language") as "zh" | "en" | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (savedLanguage === "zh" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("linkarda-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("linkarda-language", language);
  }, [language]);

  const visibleAlbums = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return albums.filter((album) => {
      const matchesFeed = feed === "recommended" || album.followed;
      const matchesQuery = !normalized || `${album.title} ${album.city} ${album.author}`.toLowerCase().includes(normalized);
      return matchesFeed && matchesQuery;
    });
  }, [albums, feed, query]);

  function navigate(id: NavId) {
    if (id === "publish") {
      if (window.innerWidth > 820) window.location.href = "/upload";
      else setUploadOpen(true);
      return;
    }
    if (id === "profile" && window.innerWidth > 820) { window.location.href = "/me"; return; }
    setActiveNav(id);
    setSettingsOpen(false);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(URL.createObjectURL(file));
  }

  function toggleLike(album: Album) {
    const wasLiked = likedIds.has(album.id);
    setAlbums((items) => items.map((item) => item.id === album.id ? { ...item, likeCount: Math.max(0, item.likeCount + (wasLiked ? -1 : 1)) } : item));
    setLikedIds((items) => { const next = new Set(items); if (next.has(album.id)) next.delete(album.id); else next.add(album.id); return next; });
  }

  function submitComment(album: Album) {
    if (!commentText.trim()) return;
    setAlbums((items) => items.map((item) => item.id === album.id ? { ...item, commentCount: item.commentCount + 1 } : item));
    setCommentText(""); setCommentId(null); setInteractionMessage("评论已发布（登录功能开放后会永久保存）");
  }

  const navItems: { id: NavId; label: string }[] = [
    { id: "publish", label: t.publish }, { id: "home", label: t.home }, { id: "search", label: t.search },
    { id: "messages", label: t.messages }, { id: "profile", label: t.profile },
  ];
  const mobileNavItems = [navItems[1], navItems[2], navItems[0], navItems[3], navItems[4]];

  return (
    <main className={`site-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <header className="mobile-topbar">
        <a href="#top" onClick={() => navigate("home")}><img className="logo-dark" src="/linkarda-white.png" alt="Linkarda" /><img className="logo-light" src="/linkarda-black.png" alt="Linkarda" /></a>
      </header>
      {activeNav === "home" && <nav className="mobile-feed-tabs"><button className={feed === "recommended" ? "active" : ""} onClick={() => setFeed("recommended")}>{t.recommended}</button><button className={feed === "following" ? "active" : ""} onClick={() => setFeed("following")}>{t.following}</button></nav>}
      <aside className="sidebar" aria-label="Linkarda navigation">
        <div className="sidebar-head">
          <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "展开边栏" : "收起边栏"} aria-expanded={!collapsed}>
            <span /><span /><span />
          </button>
          <a className="logo-wrap" href="#top" onClick={() => navigate("home")} aria-label="Linkarda home">
            <img className="logo logo-dark" src="/linkarda-white.png" alt="Linkarda" />
            <img className="logo logo-light" src="/linkarda-black.png" alt="Linkarda" />
          </a>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button key={item.id} className={activeNav === item.id ? "active" : ""} onClick={() => navigate(item.id)} aria-label={item.label}>
              <NavIcon id={item.id} /><span className="nav-label">{item.label}</span>
              {item.id === "messages" && <i className="unread">2</i>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className={settingsOpen ? "active" : ""} onClick={() => setSettingsOpen(!settingsOpen)} aria-label={t.settings}>
            <NavIcon id="settings" /><span className="nav-label">{t.settings}</span>
          </button>
          {settingsOpen && (
            <section className="settings-panel">
              <div className="settings-row"><span>{t.appearance}</span><div className="segmented"><button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")}>{t.dark}</button><button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")}>{t.light}</button></div></div>
              <div className="settings-row"><span>{t.language}</span><div className="segmented"><button className={language === "zh" ? "selected" : ""} onClick={() => setLanguage("zh")}>中文</button><button className={language === "en" ? "selected" : ""} onClick={() => setLanguage("en")}>EN</button></div></div>
            </section>
          )}
        </div>
      </aside>

      <section className={`main-content ${activeNav === "home" ? "home-view" : ""}`} id="top">
        {activeNav === "home" && (
          <>
            <header className="feed-tabs">
              <button className={feed === "recommended" ? "active" : ""} onClick={() => setFeed("recommended")}>{t.recommended}</button>
              <button className={feed === "following" ? "active" : ""} onClick={() => setFeed("following")}>{t.following}</button>
            </header>
            <section className="home-hero" aria-label="All the world in it">
              <span className="hero-index">LINKARDA · VISUAL ARCHIVE · 2026</span>
              <div className="hero-statement">
                <h1>All the <em>world</em><br />in it<span>.</span></h1>
                <div className="hero-note">
                  <i />
                  <p>{language === "zh" ? "世界很大，一帧足以收藏。" : "A whole world, held in a single frame."}</p>
                </div>
              </div>
              <a className="hero-scroll" href="#album-feed"><span>{language === "zh" ? "探索图集" : "Explore albums"}</span><b>↓</b></a>
            </section>
          </>
        )}

        {activeNav === "search" && (
          <section className="search-panel">
            <label htmlFor="album-search">{t.searchTitle}</label>
            <div><span>⌕</span><input id="album-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchHint} /><button onClick={() => setQuery("")}>×</button></div>
          </section>
        )}

        {activeNav === "messages" && <section className="quiet-panel"><span>02</span><h2>{t.messageTitle}</h2><p>{language === "zh" ? "购买通知和创作者来信会出现在这里。" : "Purchases and creator notes will appear here."}</p></section>}
        {activeNav === "profile" && <section className="quiet-panel profile-panel"><i>LW</i><h2>{t.profileTitle}</h2><p>@linkarda · 12 {language === "zh" ? "个收藏" : "collections"}</p><div className="mobile-profile-settings"><h3>{t.settings}</h3><div><span>{t.appearance}</span><button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>{t.dark}</button><button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>{t.light}</button></div><div><span>{t.language}</span><button className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中文</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button></div></div></section>}

        {(activeNav === "home" || activeNav === "search" || activeNav === "publish") && (
          <section id={activeNav === "home" ? "album-feed" : undefined} className={`album-grid ${activeNav === "home" ? "home-album-grid" : ""}`} aria-live="polite">
            {visibleAlbums.map((album, index) => (
              <article className={`album-card card-${(index % 4) + 1}`} key={album.id} onClick={() => { if (window.innerWidth > 720) setSelected(album); }}>
                <div className="mobile-post-head"><i>{album.author.slice(0, 1)}</i><div><b>{album.author}</b><p>{album.title} · {album.description}</p></div></div>
                <div className="album-image" role="button" tabIndex={0} style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,.64)), url(${album.image})` }} aria-label={`${t.buy}: ${album.title}`}>
                  {album.previewMime.startsWith("video/") && <video className="mobile-video-cover" src={album.preview} autoPlay muted={!soundIds.has(album.id)} loop playsInline preload="metadata" />}
                  <span className="city-label">{album.city}</span>
                  <span className="album-count">{album.count} {t.photos}</span>
                  <span className="view-album">{t.buy} <b>↗</b></span>
                  {album.previewMime.startsWith("video/") && <button className="mobile-video-sound" onClick={(event) => { event.stopPropagation(); setSoundIds((items) => { const next = new Set(items); if (next.has(album.id)) next.delete(album.id); else next.add(album.id); return next; }); }} aria-label={soundIds.has(album.id) ? "静音视频" : "打开视频声音"}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10v4h4l5 4V6l-5 4H5Z" />{soundIds.has(album.id) ? <><path d="M17 9.2c1.1 1.1 1.1 4.5 0 5.6" /><path d="M19.6 7c2.3 2.4 2.3 7.6 0 10" /></> : <><path d="m17.5 10 4 4M21.5 10l-4 4" /></>}</svg></button>}
                </div>
                <a className="mobile-price-pill" href={`/preview/${album.id}`} onClick={(event) => event.stopPropagation()}>¥{album.price}<b>↗</b></a>
                <div className="album-meta"><div><h2>{album.title}</h2><p>{album.author}</p></div><strong>¥{album.price}</strong></div>
                <div className="mobile-reactions" onClick={(event) => event.stopPropagation()}><button className={likedIds.has(album.id) ? "liked" : ""} onClick={() => toggleLike(album)} aria-label="点赞">♡ <span>{album.likeCount}</span></button><button onClick={() => setCommentId(commentId === album.id ? null : album.id)} aria-label="评论">◯ <span>{album.commentCount}</span></button><button className="post-more" onClick={() => setMenuId(menuId === album.id ? null : album.id)} aria-label="更多操作">•••</button>{menuId === album.id && <button className="mobile-report-menu" onClick={() => { setMenuId(null); setInteractionMessage("举报入口已收到；正式账号功能上线后将提交审核"); }}>举报</button>}</div>
                {commentId === album.id && <div className="mobile-comment-box" onClick={(event) => event.stopPropagation()}><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="写下评论…" maxLength={300} /><button onClick={() => submitComment(album)}>发布</button></div>}
              </article>
            ))}
            {!visibleAlbums.length && <div className="empty-state"><span>⌕</span><p>{t.empty}</p></div>}
          </section>
        )}
      </section>

      {interactionMessage && <button className="mobile-toast" onClick={() => setInteractionMessage("")}>{interactionMessage}</button>}
      <nav className="mobile-liquid-nav" aria-label="移动端主导航">
        {mobileNavItems.map((item) => <button key={item.id} className={activeNav === item.id ? "active" : ""} onClick={() => navigate(item.id)} aria-label={item.label}><NavIcon id={item.id} /></button>)}
      </nav>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
          <section className="album-modal">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label={t.close}>×</button>
            <div className="modal-photo" style={{ backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,.72)), url(${selected.image})` }}><span>{selected.city}</span><b>{selected.count} {t.photos}</b></div>
            <div className="modal-copy"><div><p>{selected.author}</p><h2>{selected.title}</h2></div><a className="modal-buy-link" href={`/preview/${selected.id}`}>¥{selected.price} · {language === "zh" ? "查看低清预览" : "View preview"}</a></div>
          </section>
        </div>
      )}

      {uploadOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setUploadOpen(false)}>
          <section className="upload-modal">
            <button className="modal-close" onClick={() => setUploadOpen(false)} aria-label={t.close}>×</button>
            <p>LINKARDA CREATOR</p><h2>{t.uploadTitle}</h2><span>{t.uploadHint}</span>
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={handleUpload} />
            <button className={`upload-zone ${uploadPreview ? "has-preview" : ""}`} style={uploadPreview ? { backgroundImage: `url(${uploadPreview})` } : undefined} onClick={() => fileInput.current?.click()}><i>＋</i><b>{t.choose}</b></button>
            <button className="publish-action" disabled={!uploadPreview} onClick={() => setUploadOpen(false)}>{t.done} <b>→</b></button>
          </section>
        </div>
      )}
    </main>
  );
}
