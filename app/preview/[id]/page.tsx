import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const albums = [
  { id: "1", title: "雨落之后，重庆", author: "YUAN / 原", price: 68, description: "雨停后的山城，霓虹和江面一起醒来。", media: ["https://images.unsplash.com/photo-1573295918221-c650d1990fc3?auto=format&fit=crop&w=1080&q=45"] },
  { id: "2", title: "外滩的蓝色一小时", author: "LINYU", price: 88, description: "日落后、华灯前，上海短暂的蓝色时刻。", media: ["https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1080&q=45"] },
  { id: "3", title: "霓虹在维港醒来", author: "FRAME 23", price: 108, description: "维港两岸的光被潮水拉成一封夜信。", media: ["https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1080&q=45"] },
  { id: "4", title: "西湖，清晨六点", author: "空镜计划", price: 58, description: "游客到来前，湖面只留下雾和桨声。", media: ["https://images.unsplash.com/photo-1623204918735-e34e4cb2d731?auto=format&fit=crop&w=1080&q=45"] },
  { id: "5", title: "北京的旧与新", author: "北纬39°", price: 76, description: "胡同、城墙与玻璃幕墙在同一条轴线上。", media: ["https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1080&q=45"] },
  { id: "6", title: "街角成都", author: "一格成都", price: 48, description: "慢下来的街角，装着茶馆和晚风。", media: ["https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1080&q=45"] },
  { id: "7", title: "东京失眠地图", author: "AKI MORI", price: 98, description: "末班车之后，城市仍有自己的呼吸。", media: ["https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1080&q=45"] },
  { id: "8", title: "海风经过厦门", author: "SEA FRAME", price: 52, description: "海风把夏天推过白色堤岸。", media: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=45"] },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const album = albums.find((item) => item.id === id);
  return { title: album ? `${album.title}｜Linkarda` : "Linkarda 低清预览" };
}

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = albums.find((item) => item.id === id);
  if (!album) notFound();

  return (
    <main className="preview-page">
      <header className="preview-header">
        <Link href="/" aria-label="返回 Linkarda 首页">←</Link>
        <img src="/linkarda-white.png" alt="Linkarda" className="logo-dark" />
        <img src="/linkarda-black.png" alt="Linkarda" className="logo-light" />
        <span>低清预览</span>
      </header>
      <section className="preview-copy">
        <p>{album.author}</p>
        <h1>{album.title}</h1>
        <span>{album.description}</span>
      </section>
      <section className="preview-media">
        {album.media.map((src, index) => <img key={src} src={src} alt={`${album.title} 低清预览 ${index + 1}`} />)}
      </section>
      <footer className="preview-license">
        <div><small>仅供低清预览</small><strong>¥{album.price}</strong></div>
        <button type="button" disabled>登录与购买即将开放</button>
      </footer>
    </main>
  );
}
