import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Upload,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateUserProfile,
  UpdateUserProfilePic,
} from "../../../../services/operations/Auth";

export default function VendorProfile() {
  // State for profile pic
  const { Profile } = useSelector((state) => state.Profile);
  const { token } = useSelector((state) => state.Auth);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [selectedPic, setSelectedPic] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  // Upload handler
  const handleProfilePicUpload = (e) => {
    const file = e.target.files?.[0];
    setSelectedPic(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePicPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const ChangeProfileImage = () => {
    if (selectedPic === Profile.profileImage) {
      alert("please select Different pic");
      return;
    }
    const fromdata = new FormData();
    fromdata.append("profileImage", selectedPic);
    dispatch(UpdateUserProfilePic(fromdata, token));
  };
  // Submit handler
  const isChanged = (data) => {
    for (const key in data) {
      if (key !== "contactPerson" && data[key] !== Profile[key]) {
        return true;
      }
    }
    return false;
  };
  const onSubmit = (data) => {
    console.log(data);

    if (!isChanged(data)) {
      alert("NO value changed");
      return;
    }
    dispatch(UpdateUserProfile(data, token));
  };

  useEffect(() => {
    if (Profile) {
      setValue("name", Profile.name);
      setValue("phone", Profile.phone);
      setValue("email", Profile.email);
      setValue("contactPerson", Profile.name);
      setValue("address", Profile.address);
      setSelectedPic(Profile?.profileImage);
    }
  }, [Profile]);
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Personal Details
            </h2>
            <p className="text-blue-100">Update your business information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-8">
        {/* Profile Pic Upload */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Profile Picture
          </label>
          <div className="flex sm:flex-row flex-col items-center space-x-6 justify-around">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profilePicPreview || selectedPic ? (
                  <img
                    src={profilePicPreview || selectedPic}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full shadow-lg">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="hidden"
              />
              <label
                htmlFor="profilePic"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </label>
              <p className="text-sm text-slate-500 mt-2">
                JPG, PNG or WebP. Max 5MB.
              </p>
            </div>
            <button
              onClick={ChangeProfileImage}
              className="w-fit flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
            >
              Save
            </button>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendor Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-slate-500" />
                Vendor Name *
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.name
                    ? "border-red-400 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  Vendor name is required
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                Contact Person *
              </label>
              <input
                type="text"
                {...register("contactPerson", { required: true })}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.contactPerson
                    ? "border-red-400 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.contactPerson && (
                <p className="text-xs text-red-500 mt-1">
                  Contact person is required
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                Mobile Number *
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  Enter a valid 10-digit mobile number
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                Email Address *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                className={`w-full px-4 py-3 border rounded-xl ${
                  errors.email
                    ? "border-red-400 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">Enter a valid email</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-slate-500" />
              Business Address *
            </label>
            <textarea
              rows={3}
              {...register("address", { required: true })}
              className={`w-full px-4 py-3 border rounded-xl resize-none ${
                errors.address
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">
                Business address is required
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Update Personal Details
              </>
            )}
          </button>

          {success && (
            <div className="flex items-center p-4 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl animate-fade-in">
              <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
              <span>Personal details updated successfully!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
