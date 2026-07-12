"use client";
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginAdmin = async () => {
    if (!email || !password) {
      alert("Email और Password भरें");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      alert("Admin Login Successful");

      router.push("/admin-dashboard");
    } catch (error) {
      console.log(error);
      alert("Login failed. Email/Password check करें.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-800 flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Study Verse India Admin Panel
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={loginAdmin}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
      

          </button>
       
        </div>

        <a
          href="/"
          className="block text-center mt-6 text-blue-700 font-semibold"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}