import React, { useEffect, useState } from "react";
import {
  Upload,
  Store,
  User,
  Clock,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  GetAllCampuses,
  Login,
  RegisterUser,
  registerVendor,
} from "../services/operations/Auth";
import { useDispatch, useSelector } from "react-redux";
import { Roles } from "../constants/constant";
import { Link, useNavigate } from "react-router-dom";

// UI components (as in your code, unchanged)
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Input = ({ className = "", onChange, ...props }) => (
  <input
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);
const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium mb-1 ${className}`}
  >
    {children}
  </label>
);
const Textarea = ({ className = "", onChange, ...props }) => (
  <textarea
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className}`}
    rows={3}
    {...props}
  />
);
const Select = ({ children, onValueChange, className = "" }) => {
  const handleChange = (e) => {
    onValueChange && onValueChange(e.target.value);
  };
  return (
    <select
      onChange={handleChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <option value="">Select an option</option>
      {children}
    </select>
  );
};
const SelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
);
const Checkbox = ({ checked = false, onCheckedChange, className = "", id }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${className}`}
  />
);
const Dialog = ({ open, children }) => {
  if (!open) return null;
  return (
    <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children }) => <div className="p-6">{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-2">{children}</h2>
);
const DialogDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);
const DialogFooter = ({ children }) => <div className="mt-6">{children}</div>;

// Config
const TIME_SLOTS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function VendorOnboardingForm() {
  // Real state for backend variables
  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    campus: "",
    adhaarNumber: "",
    panNumber: "",
    gstNumber: "",
    fssaiLicense: "",
    password: "",
    confirmPassword: "",
    role: Roles.Vendor,
    contactPersonName: "",
    mobile: "",
    email: "",
    address: "",
    openingHours: "",
    closingHours: "",
    operatingDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    description: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();
  const [campuses, setCampuses] = useState([]);
  const [images, setImages] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [termsModal, setTermsModal] = useState(false);

  // Checkbox for operating days
  const toggleOperatingDay = (day) => {
    setFormData((prev) => {
      const exists = prev.operatingDays.includes(day);
      let updatedDays;
      if (exists) {
        updatedDays = prev.operatingDays.filter((d) => d !== day);
      } else {
        updatedDays = [...prev.operatingDays, day];
      }
      return { ...prev, operatingDays: updatedDays };
    });
  };

  // Handle value changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle images
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 3) {
      alert("Maximum 3 images allowed.");
      return;
    }
    setImages(files);
  };

  const getCampuses = async () => {
    const result = await GetAllCampuses();
    setCampuses(result);
  };

  useEffect(() => {
    getCampuses();
  }, []);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms and Conditions to continue!");
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => payload.append(key, v));
      } else {
        payload.append(key, value);
      }
    });
    images.forEach((img) => payload.append("images", img));

    dispatch(registerVendor(payload, navigate, setSuccessDialog));
    setIsSubmitting(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center py-4 sm:py-8 md:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-24 text-gray-700">
      {/* Success Dialog */}
      <Dialog open={successDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Complete!</DialogTitle>
            <DialogDescription>
              Registration successful! Please wait for 24 hours for admin
              verification.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => setSuccessDialog(false)}
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={termsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept our terms and conditions
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto text-sm text-gray-700 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using CampusBites, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                2. Vendor Responsibilities
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maintain accurate and up-to-date business information</li>
                <li>Ensure food safety and quality standards</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Provide timely order fulfillment</li>
                <li>Maintain proper hygiene and cleanliness standards</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">3. Payment Terms</h3>
              <p>
                Vendors will receive payments according to the agreed schedule.
                CampusBites reserves the right to deduct applicable fees and
                commissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                4. Prohibited Activities
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Providing false or misleading information</li>
                <li>Violating food safety regulations</li>
                <li>Engaging in fraudulent activities</li>
                <li>Sharing account credentials with unauthorized persons</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">5. Termination</h3>
              <p>
                CampusBites reserves the right to terminate vendor accounts for
                violations of these terms or for any other reason at our
                discretion.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                6. Limitation of Liability
              </h3>
              <p>
                CampusBites shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of the platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                7. Changes to Terms
              </h3>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the platform constitutes acceptance of the
                modified terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                8. Contact Information
              </h3>
              <p>
                For questions about these terms, please contact us at
                support@campusbites.com
              </p>
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gray-500 hover:bg-gray-600"
                onClick={() => setTermsModal(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setTermsModal(false);
                  handleInputChange("agreeToTerms", true);
                }}
              >
                I Accept
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-700 mb-1">
            Vendor Onboarding
          </h2>
          <p className="text-sm sm:text-md text-gray-700 px-4">
            Welcome! Please fill out the form below to join our network of
            campus food vendors.
          </p>
        </div>

        {/* Basic Information */}
        <Card className="bg-gray-50 shadow-sm border border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-black">
              <User className="h-5 w-5 mr-2" /> Basic Information
            </CardTitle>
            <CardDescription>
              Please provide your basic contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Vendor Name / Canteen Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter vendor name"
                  className="bg-white"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  placeholder="Enter contact person name"
                  className="bg-white"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    handleInputChange("contactPersonName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  placeholder="Enter 10-digit mobile number"
                  className="bg-white"
                  maxLength={10}
                  inputMode="numeric"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                    handleInputChange("mobile", value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="bg-white"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address (Block / Building) *</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                className="bg-white"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Password and Confirm Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-white pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="bg-white pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business & College Details */}
        <Card className="bg-gray-50 shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-black">
              <Store className="h-5 w-5 mr-2" /> Business & College Details
            </CardTitle>
            <CardDescription>
              Select the college where you'll be operating
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-gray-700">
            <div>
              <Label htmlFor="campus">Name of College *</Label>
              <Select
                value={formData.campus}
                onValueChange={(value) => handleInputChange("campus", value)}
              >
                {campuses.map((campus) => (
                  <SelectItem key={campus._id} value={campus._id}>
                    {campus.name} - {campus.city}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Shop/Canteen Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your business (menu, highlights, etc)"
                className="bg-white"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Operations Details */}
        <Card className="bg-gray-50 shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-black">
              <Clock className="h-5 w-5 mr-2" /> Operations Details
            </CardTitle>
            <CardDescription>Set your operating hours and days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openingHours">Opening Hours *</Label>
                <Select
                  value={formData.openingHours}
                  onValueChange={(value) =>
                    handleInputChange("openingHours", value)
                  }
                >
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="closingHours">Closing Hours *</Label>
                <Select
                  value={formData.closingHours}
                  onValueChange={(value) =>
                    handleInputChange("closingHours", value)
                  }
                >
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label>Operating Days *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.operatingDays.includes(day)}
                      onCheckedChange={() => toggleOperatingDay(day)}
                    />
                    <Label htmlFor={day} className="text-sm font-normal">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canteen Images */}
        <Card className="bg-gray-50 shadow-sm border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-black">
              <Upload className="h-5 w-5 mr-2" /> Canteen Images *
            </CardTitle>
            <CardDescription>
              Upload images of your canteen (required for approval)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-gray-700">
            <div>
              <Label htmlFor="images">Canteen Images</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById("imageUpload").click()}
                  className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images (Max 3)
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload 1-3 images of your canteen. Supported formats: JPEG, PNG,
                WebP. Max size: 5MB each.
              </p>
              {/* Preview */}
              <div className="flex flex-wrap gap-2 mt-2">
                {images.length > 0 &&
                  images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt={`canteen-img-${idx}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border"
                    />
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card className="bg-gray-50 shadow-sm border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-black">
              <FileText className="h-5 w-5 mr-2" /> Documentation Details
            </CardTitle>
            <CardDescription>
              Enter required document numbers (will be verified during approval)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-gray-700">
            <div>
              <Label htmlFor="adhaarNumber">Aadhar Number *</Label>
              <Input
                id="adhaarNumber"
                placeholder="Enter 12-digit Aadhar number"
                className="bg-white"
                maxLength={12}
                inputMode="numeric"
                value={formData.adhaarNumber}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 12);
                  handleInputChange("adhaarNumber", value);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 12-digit Aadhar number (without spaces or dashes)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  placeholder="ABCDE1234F"
                  className="bg-white"
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                  value={formData.panNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Za-z0-9]/g, "")
                      .toUpperCase()
                      .slice(0, 10);
                    handleInputChange("panNumber", value);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
                </p>
              </div>
              <div>
                <Label htmlFor="gstNumber">GST Number *</Label>
                <Input
                  id="gstNumber"
                  placeholder="22ABCDE1234F1Z5"
                  className="bg-white"
                  maxLength={15}
                  style={{ textTransform: "uppercase" }}
                  value={formData.gstNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Za-z0-9]/g, "")
                      .toUpperCase()
                      .slice(0, 15);
                    handleInputChange("gstNumber", value);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  15-character GST number (e.g., 22ABCDE1234F1Z5)
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="fssaiLicense">FSSAI License (Optional)</Label>
              <Input
                id="fssaiLicense"
                placeholder="12345678901234"
                className="bg-white"
                maxLength={14}
                inputMode="numeric"
                value={formData.fssaiLicense}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 14);
                  handleInputChange("fssaiLicense", value);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 14-digit FSSAI license number (optional for small
                food businesses)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions Checkbox */}
        <Card className="bg-gray-50 shadow-sm border border-gray-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAndConditions"
                checked={formData.agreeToTerms || false}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked)
                }
              />
              <Label
                htmlFor="termsAndConditions"
                className="text-sm text-gray-700"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setTermsModal(true)}
                  className="text-orange-600 hover:underline cursor-pointer"
                >
                  Terms and Conditions
                </button>{" "}
                of CampusBites *
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-sm sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 px-4">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
