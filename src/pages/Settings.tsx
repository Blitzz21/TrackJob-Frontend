import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export default function Settings() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.put("/auth/update-profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated ✅");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed ❌");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    api.get("/email/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEmail(res.data.email_address || ""));
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    await api.post("/email/settings", { email, encryptedPassword: password }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Email settings saved ✅");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Full name" {...form.register("name")} />
        <Input placeholder="Email" type="email" {...form.register("email")} />
        <Input placeholder="Current password" type="password" {...form.register("currentPassword")} />
        <Input placeholder="New password" type="password" {...form.register("newPassword")} />
        <Button type="submit" className="w-full bg-[#111827]">Save Changes</Button>
      </form>
      <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Email Settings</h1>
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="App password or email password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-[#111827] text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Settings
      </button>
    </div>
    </div>
    
  );
}
