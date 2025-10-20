import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export default function Settings() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    api
      .get("/email/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEmail(res.data.email_address || ""));
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.post(
        "/email/settings",
        { email, encryptedPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Email settings saved ✅");
    } catch {
      toast.error("Failed to save email settings ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account, password, and email configuration below.
      </p>

      {/* Profile Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input placeholder="Full name" {...form.register("name")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="Email address" {...form.register("email")} />
            </div>

            <Separator className="my-4" />

            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input type="password" placeholder="Current password" {...form.register("currentPassword")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input type="password" placeholder="New password" {...form.register("newPassword")} />
            </div>

            <Button type="submit" className="w-full mt-4">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">App Password</label>
            <Input
              type="password"
              placeholder="App or email password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Email Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
