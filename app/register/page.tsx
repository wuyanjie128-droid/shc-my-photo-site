"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("注册成功");
    window.location.href = "/login";
  };

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">注册</h1>

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="邮箱"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="password"
          placeholder="密码"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2">
          注册
        </button>
      </form>
    </main>
  );
}