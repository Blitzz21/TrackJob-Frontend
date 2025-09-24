import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/logo/TrackJob.png";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false).optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

    const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);
      if (data.remember) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid credentials");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-y-8 overflow-hidden">
      <Card className="min-w-[300px] max-w-[500px] p-6 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center mb-4">
            <img className="w-8 md:w-12 lg:w-14 mb-4" width={64} height={64} src={Logo} alt="TrackJob Logo" />
            <h1 className="text-3xl text-center font-bold">Sign in to your account</h1>
            <p className="text-xs font-light text-black/60">Welcome back! Please login.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 stroke-black/50" />
                          ) : (
                            <Eye className="h-4 w-4 stroke-black/50" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#111827]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <div className="flex flex-col items-center text-xs">
          <p>
            Don’t have an account?{" "}
            <a className="text-blue-600 hover:underline" href="/register">
              Create one
            </a>
          </p>
        </div>
      </Card>

      <a className="text-blue-600 hover:underline text-sm" href="/">
        Back to home
      </a>
    </div>
  );
}
