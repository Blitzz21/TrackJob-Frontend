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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the Terms & Privacy Policy",
    }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false
    },
  });

     const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Account created! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-y-8 overflow-hidden">
      <Card className="min-w-[300px] max-w-[500px] p-6 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center mb-4">
            <img className='w-8 md:w-12 lg:w-14 mb-4' width={64} height={64} src={Logo} alt="TrackJob Logo" />
            <h1 className="text-3xl text-center font-extrabold">Create your account</h1>
            <p className="text-xs font-light text-black/60">Start tracking your job applications today.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false);

                  return (
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
                              <EyeOff className="h-4 w-4 stroke-black/60" />
                            ) : (
                              <Eye className="h-4 w-4 stroke-black/60" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                    </FormControl>
                    <p className="text-[0.7rem]">I agree to the <a className="text-blue-600 hover:underline font-normal" href="">Terms of Service</a> and <a className="text-blue-600 hover:underline font-normal" href="">Privacy Policy</a></p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#111827]" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="flex flex-col items-center text-xs">
          <p className="font-light">Already have an account? <a className="text-blue-600 hover:underline font-normal" href="/login">Sign in here</a></p>
        </div>
      </Card>
      <a className="text-blue-600 hover:underline text-sm" href="/">Back to home</a>
    </div>
  );
}
