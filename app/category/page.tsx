"use client";

import BottomNav from "../components/BottomNav";

const cities = [
  "上海",
  "北京",
  "广州",
  "深圳",
  "香港",
  "澳门",
  "台北",
  "其他",
];

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-black">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">分类页面</h1>
          <p className="mt-1 text-sm text-gray-500">
            按城市查看不同地区的视频内容
          </p>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">城市分类</h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cities.map((city) => (
              <a
                key={city}
                href={`/category/${encodeURIComponent(city)}`}
                className="rounded-2xl border px-4 py-6 text-center text-lg font-medium hover:bg-gray-50"
              >
                {city}
              </a>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}