import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../component/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import { Input } from "../component/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../component/ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../component/ui/tooltip";
import { Login } from "../services/operations/Auth";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../slices/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });
  const selectedRole = form.watch("role");

  const getRoleIcon = (role) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-5 h-5" />;
      case "campus":
        return <Users className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "from-blue-500 to-purple-600";
      case "campus":
        return "from-green-500 to-emerald-600";
      default:
        return "";
    }
  };

  const onSubmit = (values) => {
    dispatch(Login(values, navigate));
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-[#05080f] flex justify-center relative overflow-hidden transition-all duration-500">
      {/* Background: fully animated and custom colored */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Food Icons (with your custom float/bounce keyframes) */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center animate-float">
          <span className="text-2xl">🍕</span>
        </div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center animate-float-delayed">
          <span className="text-xl">🍔</span>
        </div>
        <div className="absolute bottom-32 left-16 w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center animate-bounce-slow">
          <span className="text-xl">🌮</span>
        </div>
      </div>

      <div className="flex w-full max-w-7xl mx-auto relative z-16 mt-20">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          <div className="text-center animate-slide-in-left">
            <div className="mb-12">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-spin-slow opacity-20"></div>
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <span className="text-5xl font-black text-white relative select-none">
                      {/* Gradient + Pulse */}
                      <span
                        className="absolute inset-0 text-5xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-pulse"
                        style={{ filter: "blur(1px)" }}
                      >
                        CB
                      </span>
                      <span
                        className="relative text-white"
                        style={{
                          textShadow:
                            "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.5), 0 0 40px rgba(255,204,0,0.8), 0 0 70px rgba(255,204,0,0.6), 0 0 80px rgba(255,204,0,0.4), 0 0 100px rgba(255,204,0,0.3)",
                        }}
                      >
                        CB
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-3 transition-all duration-500">
                Campus Bites
              </h1>
              <p className="text-gray-400 text-lg dark:text-[#8892b0]">
                Your premium campus food experience
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-6 text-left group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Students</h3>
                  <p className="text-gray-400 dark:text-[#8892b0]">
                    Order your favorite meals instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-left group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Campus Partners
                  </h3>
                  <p className="text-gray-400 dark:text-[#8892b0]">
                    Manage your restaurant & orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-card dark:bg-[#0b1120] backdrop-blur-xl border border-border dark:border-[#4f5d75] rounded-3xl p-10 shadow-2xl animate-slide-in-right relative overflow-hidden transition-all duration-500">
              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-foreground mb-3 transition-all duration-500 dark:text-[#e2e8f0]">
                    Welcome Back!
                  </h2>
                  <p className="text-muted-foreground text-lg dark:text-[#8892b0] transition-all duration-500">
                    New to Campus Bites?{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to="/register"
                            aria-label="register here"
                            className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-all duration-500"
                          >
                            Join us here
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>Sign up</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-[#2d3748] dark:bg-[#2d3748] border-[#4a5568] dark:border-[#4a5568] text-white dark:text-white rounded-xl h-14 text-lg focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400 focus:border-blue-400 w-full transition-all duration-300 hover:bg-[#374151] dark:hover:bg-[#374151]">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a202c] dark:bg-[#1a202c] border-[#4a5568] dark:border-[#4a5568] rounded-xl shadow-2xl">
                              <SelectItem
                                className="text-white dark:text-white cursor-pointer hover:bg-[#2d3748] dark:hover:bg-[#2d3748] focus:bg-[#2d3748] dark:focus:bg-[#2d3748] rounded-lg mx-1 my-1 transition-colors duration-200"
                                value="student"
                              >
                                Student
                              </SelectItem>
                              <SelectItem
                                className="text-white dark:text-white cursor-pointer hover:bg-[#2d3748] dark:hover:bg-[#2d3748] focus:bg-[#2d3748] dark:focus:bg-[#2d3748] rounded-lg mx-1 my-1 transition-colors duration-200"
                                value="campus"
                              >
                                Campus Partner
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-lg font-semibold transition-all duration-500 dark:text-[#e2e8f0]">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-6 h-6 transition-all duration-500 drop-shadow" />
                              <Input
                                placeholder="Enter your email"
                                type="email"
                                aria-label="enter your email here"
                                autoComplete="email"
                                className="pl-12 bg-input dark:bg-[#232838] border-border dark:border-[#38405a] text-foreground dark:text-[#e2e8f0] placeholder-muted-foreground dark:placeholder-[#8892b0] rounded-xl h-14 text-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-500"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-foreground text-lg font-semibold transition-all duration-500 dark:text-[#e2e8f0]">
                              Password
                            </FormLabel>
                            <Link
                              to="/resetMail"
                              aria-label="forgot password"
                              className="text-sm text-red-400 hover:text-red-300 hover:underline transition-all duration-500"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-6 h-6 transition-all duration-500 drop-shadow" />
                              <Input
                                placeholder="Enter your password"
                                aria-label="enter your password here"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="pl-12 bg-input dark:bg-[#232838] border-border dark:border-[#38405a] text-foreground dark:text-[#e2e8f0] placeholder-muted-foreground dark:placeholder-[#8892b0] rounded-xl h-14 text-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-500"
                                {...field}
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      aria-label="show password"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="w-6 h-6" />
                                      ) : (
                                        <Eye className="w-6 h-6" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Show/Hide password
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      aria-label="sign in button"
                      className={`w-full ${
                        selectedRole
                          ? `bg-gradient-to-r ${getRoleColor(selectedRole)}`
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                      } hover:scale-105 text-white font-bold py-4 rounded-xl transition-all duration-500 shadow-lg text-lg group`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedRole && getRoleIcon(selectedRole)}
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-500" />
                      </div>
                    </Button>
                  </form>
                </Form>

                {/* Role-Specific Login Options */}
                {selectedRole === "student" && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border dark:border-[#38405a] transition-all duration-500" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card dark:bg-[#232838] backdrop-blur-xl px-2 text-muted-foreground dark:text-[#8892b0] transition-all duration-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      aria-label="sign in with google"
                      className="
                        w-full
                        bg-gradient-to-r
                        from-yellow-400
                        to-blue-500
                        dark:from-yellow-600
                        dark:to-blue-800
                        border-0
                        hover:from-yellow-500
                        hover:to-blue-600
                        dark:hover:from-yellow-700
                        dark:hover:to-blue-900
                        text-white
                        rounded-xl
                        h-14
                        text-lg
                        backdrop-blur-sm
                        transition-all
                        shadow-md
                        duration-500
                      "
                      onClick={() =>
                        (window.location.href =
                          "https://campusbites-mxpe.onrender.com/api/v1/users/auth/google")
                      }
                    >
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
                        <path
                          fill="#FFC107"
                          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.04C34.553 7.784 29.577 5 24 5C13.522 5 5 13.522 5 24s8.522 19 19 19s19-8.522 19-19c0-1.332-.136-2.626-.389-3.917z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306 14.691c-1.321 2.355-2.071 5.12-2.071 8.003s.75 5.648 2.071 8.003l-5.362 4.152C1.528 31.979 0 28.182 0 24s1.528-7.979 4.02-11.832L6.306 14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44c5.166 0 9.773-1.789 13.04-4.788l-5.362-4.152c-1.921 1.284-4.322 2.04-6.914 2.04c-5.022 0-9.284-3.473-10.825-8.125l-5.378 4.162C8.751 39.528 15.827 44 24 44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.584l5.362 4.152c3.354-3.109 5.419-7.587 5.419-12.735c0-1.332-.136-2.626-.389-3.917z"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </>
                )}

                {/* Campus Registration CTA */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-500/20 dark:border-green-900/40 rounded-2xl transition-all duration-500">
                  <div className="text-center">
                    <h3 className="text-foreground font-semibold mb-2 transition-all duration-500 dark:text-[#e2e8f0]">
                      Want to partner with us?
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 dark:text-[#8892b0]">
                      Join as a campus Vendor partner
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      aria-label="register your vendor"
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-all duration-500 bg-transparent"
                    >
                      <Link
                        to="/vendor-register"
                        aria-label="Register Your Vendor"
                      >
                        Register Your Vendor
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
