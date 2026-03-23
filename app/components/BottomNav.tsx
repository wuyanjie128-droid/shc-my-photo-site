"use client";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="grid grid-cols-3 text-center text-sm">
        <a href="/" className="px-4 py-3">
          浏览
        </a>
        <a href="/category" className="px-4 py-3">
          分类
        </a>
        <a href="/me" className="px-4 py-3">
          我的
        </a>
      </div>
    </nav>
  );
}