"use client";
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  // La contraseña solo vive en memoria: se envía al servidor en cada llamada
  const [adminPass, setAdminPass] = useState<string | null>(null);
  if (!adminPass) return <AdminLogin onSuccess={setAdminPass} />;
  return <AdminDashboard adminPass={adminPass} onLogout={() => setAdminPass(null)} />;
}
