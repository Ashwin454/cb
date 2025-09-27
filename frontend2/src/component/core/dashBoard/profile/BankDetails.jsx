import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SelectValue } from "@radix-ui/react-select";
import { CreateBankDetails } from "../../../../services/operations/Auth";
import { TaskAbortError } from "@reduxjs/toolkit";
import { getUserBankDetails } from "../../../../services/operations/Auth";
export default function BankDetails() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const { BankDetails } = useSelector((state) => state.Profile);
  const { token } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (token) dispatch(getUserBankDetails(token));
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      upiId: "",
    },
  });

  const accountNumber = watch("accountNumber");

  const isChanges = (data) => {
    if (!BankDetails) return true;

    for (const key in data) {
      if (key === "confirmAccountNumber") continue;

      if (key === "upiId") {
        if ((BankDetails.upiId || "") !== (data.upiId || "")) {
          return true;
        }
      } else {
        if ((BankDetails[key] || "") !== (data[key] || "")) {
          return true;
        }
      }
    }

    return false;
  };
  const onSubmit = (data) => {
    console.log(data);
    console.log(isChanges(data));
    if (!isChanges(data)) {
      alert("No change in data");
      return;
    }
    dispatch(CreateBankDetails(data, token));
  };
  useEffect(() => {
    if (BankDetails) {
      setValue("accountHolderName", BankDetails.accountHolderName);
      setValue("accountNumber", BankDetails.accountNumber);
      setValue("ifscCode", BankDetails.ifscCode);
      setValue("bankName", BankDetails.bankName);
      setValue("branchName", BankDetails.branchName);
      setValue("upiId", BankDetails.upiId);
    }
  }, [BankDetails]);
  return (
    <section className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
        <h2 className="flex items-center text-xl font-semibold text-white gap-2">
          <CreditCard className="w-6 h-6" />
          Bank & Payout Details
        </h2>
        <p className="text-emerald-100 text-sm">Secure payment information</p>
      </header>

      {/* Form */}
      <form className="p-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Holder Name */}
          <label className="block text-sm font-semibold text-slate-700">
            Account Holder Name *
            <input
              type="text"
              {...register("accountHolderName", { required: "Required" })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl ${
                errors.accountHolderName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.accountHolderName && (
              <span className="text-xs text-red-500">
                {errors.accountHolderName.message}
              </span>
            )}
          </label>

          {/* Bank Name */}
          <label className="block text-sm font-semibold text-slate-700">
            Bank Name *
            <input
              type="text"
              {...register("bankName", { required: "Required" })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl ${
                errors.bankName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.bankName && (
              <span className="text-xs text-red-500">
                {errors.bankName.message}
              </span>
            )}
          </label>

          {/* Account Number */}
          <label className="block text-sm font-semibold text-slate-700">
            Account Number *
            <input
              type="text"
              {...register("accountNumber", { required: "Required" })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl ${
                errors.accountNumber
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.accountNumber && (
              <span className="text-xs text-red-500">
                {errors.accountNumber.message}
              </span>
            )}
          </label>

          {/* Confirm Account Number */}
          <label className="block text-sm font-semibold text-slate-700">
            Confirm Account Number *
            <input
              type="text"
              {...register("confirmAccountNumber", {
                required: "Required",
                validate: (value) =>
                  value === accountNumber || "Account numbers do not match",
              })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl ${
                errors.confirmAccountNumber
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.confirmAccountNumber && (
              <span className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmAccountNumber.message}
              </span>
            )}
          </label>

          {/* IFSC Code */}
          <label className="block text-sm font-semibold text-slate-700">
            IFSC Code *
            <input
              type="text"
              maxLength={11}
              {...register("ifscCode", {
                required: "Required",
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: "Invalid IFSC",
                },
              })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl uppercase ${
                errors.ifscCode
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.ifscCode && (
              <span className="text-xs text-red-500">
                {errors.ifscCode.message}
              </span>
            )}
          </label>

          {/* Branch Name */}
          <label className="block text-sm font-semibold text-slate-700">
            Branch Name *
            <input
              type="text"
              {...register("branchName", { required: "Required" })}
              className={`mt-2 w-full px-4 py-3 border rounded-xl ${
                errors.branchName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-emerald-500"
              }`}
            />
            {errors.branchName && (
              <span className="text-xs text-red-500">
                {errors.branchName.message}
              </span>
            )}
          </label>
        </fieldset>

        {/* UPI ID */}
        <label className="block text-sm font-semibold text-slate-700">
          UPI ID (Optional)
          <input
            type="text"
            placeholder="example@upi"
            {...register("upiId")}
            className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-emerald-500"
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Update Bank Details
            </>
          )}
        </button>

        {success && (
          <p className="flex items-center p-4 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl animate-fade-in">
            <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
            Bank details updated successfully!
          </p>
        )}
      </form>
    </section>
  );
}
