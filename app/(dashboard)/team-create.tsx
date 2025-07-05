"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamCreate() {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      router.push("/payment");
    } else {
      setError(data.error || "Error al crear el equipo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Crear equipo</h1>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Nombre del equipo"
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear equipo"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
