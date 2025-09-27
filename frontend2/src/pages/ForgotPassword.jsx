import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../component/ui/input";
import { Button } from "../component/ui/button";
import toast from "react-hot-toast";
import apiConnector from "../services/apiConnector";
import { AuthApi } from "../services/api";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPass: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPass, {
    message: "Passwords do not match",
    path: ["confirmPass"],
  });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Using apiConnector for consistency
      const response = await apiConnector(
        `${AuthApi.resetPassword}/${token}`,
        'POST',
        {
          password: data.password,
          confirmPass: data.confirmPass,
        },
        {
          'Content-Type': 'application/json',
        }
      );

      if (response.data.success) {
        toast.success("Password has been reset successfully. Please log in.");
        navigate("/login");
      } else {
        throw new Error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-md w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New Password"
              {...register("password")}
              className="w-full bg-white/80 dark:bg-slate-700/80 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPass")}
              className="w-full bg-white/80 dark:bg-slate-700/80 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400"
            />
            {errors.confirmPass && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPass.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
