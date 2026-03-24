"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/me", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("登录成功");
    window.location.href = next;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-black">
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <a
          href="/"
          className="inline-block rounded-lg border px-3 py-2 text-sm text-gray-600"
        >
          返回主页
        </a>

        <h1 className="mt-6 text-3xl font-bold">登录</h1>
        <p className="mt-2 text-sm text-gray-500">
          登录后可进入你的个人主页，管理昵称、ID、简介和订阅内容。
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-600">
          还没有账号？
          <a
            href={`/register?next=${encodeURIComponent(next)}`}
            className="ml-2 text-blue-600"
          >
            去注册
          </a>
        </div>
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-gray-700">
          <h2 className="text-sm font-semibold text-red-700">免责声明</h2>
          <div className="mt-3 space-y-2 leading-6">
            <p>
              1. 用户在本平台上传、发布、传播或售卖的任何内容，均由发布者本人独立承担全部责任。
            </p>
            <p>
              2. 严禁上传、传播或展示任何涉及政治敏感、煽动性、危害国家安全、违法违规或其他法律法规禁止的信息；如用户违规发布，责任由该用户自行承担，与平台无关。
            </p>
            <p>
              3. 严禁上传、传播或售卖任何色情、淫秽、未成年人不宜、擦边、性暗示等内容；如有违反，责任由内容发布者自行承担，平台有权删除内容并停止服务。
            </p>
            <p>
              4. 严禁上传、传播或售卖任何暴力、血腥、恐怖、仇恨、违法犯罪展示、教唆犯罪或其他非法内容；因此产生的一切法律责任由发布者自行承担。
            </p>
            <p>
              5. 用户登录、注册或继续使用本平台，即视为已阅读、理解并同意遵守上述规则；如因用户发布内容引发纠纷、处罚、索赔或其他后果，均由用户自行负责。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}