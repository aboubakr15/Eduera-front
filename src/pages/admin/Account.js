import { useState, useRef } from "react";
import { Pencil, Camera, Eye, EyeOff } from "lucide-react";
import defaultAvatar from "../../assets/images/man.png";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
    <h3 className="text-base font-bold text-gray-800 mb-5">{title}</h3>
    {children}
  </div>
);

const PasswordInput = ({
  label,
  field,
  showPass,
  setShowPass,
  passwords,
  setPasswords,
}) => (
  <div>
    <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
    <div className="relative">
      <input
        type={showPass[field] ? "text" : "password"}
        value={passwords[field]}
        onChange={(e) =>
          setPasswords((prev) => ({ ...prev, [field]: e.target.value }))
        }
        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 pr-9 outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="••••••••"
      />
      <button
        onClick={() =>
          setShowPass((prev) => ({ ...prev, [field]: !prev[field] }))
        }
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPass[field] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

const Account = () => {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [user, setUser] = useState({
    firstName: "Shahd",
    lastName: "Shaban",
    email: "admin@admin.com",
    role: "Admin",
    university: "Helwan University",
    language: "English",
    timezone: "Africa/Cairo",
    avatar: null,
  });

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const handleEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
  };
  const handleSave = (field) => {
    setUser((prev) => ({ ...prev, [field]: tempValue }));
    setEditField(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setUser((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
  };

  const handleChangePassword = () => {
    setPassError("");
    setPassSuccess("");
    if (!passwords.current || !passwords.new || !passwords.confirm)
      return setPassError("Please fill in all fields.");
    if (passwords.new !== passwords.confirm)
      return setPassError("New passwords don't match.");
    if (passwords.new.length < 8)
      return setPassError("Password must be at least 8 characters.");
    setPassSuccess("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const fields = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "User Role", key: "role", readonly: true },
    { label: "University", key: "university" },
  ];

  const stats = [
    { label: "Total Students", value: 1200 },
    { label: "Total Instructors", value: 85 },
    { label: "Total Courses", value: 340 },
    { label: "Total TAs", value: 210 },
  ];

  return (
    <div className="ml-4 max-w-5xl">
      <div className="px-2 pt-4 pb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#1B2036] transition-all group"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          My Account
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <img
              src={user.avatar || defaultAvatar}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:shadow-md transition"
            >
              <Camera size={12} className="text-gray-500" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-500">{user.university}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:shadow-md transition">
          <Pencil size={13} /> Edit
        </button>
      </div>

      {/* Personal Information */}
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {fields.map(({ label, key, readonly }) => (
            <div key={key}>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                {!readonly && (
                  <button onClick={() => handleEdit(key, user[key])}>
                    <Pencil
                      size={11}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                )}
              </div>
              {editField === key ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-sm border border-blue-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    onClick={() => handleSave(key)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditField(null)}
                    className="text-xs text-gray-400 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-800">
                  {user[key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* General Settings */}
      <SectionCard title="General Settings">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Language</p>
            <select
              value={user.language}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, language: e.target.value }))
              }
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 w-full"
            >
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Timezone</p>
            <select
              value={user.timezone}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 w-full"
            >
              <option value="Africa/Cairo">Cairo (GMT+2)</option>
              <option value="Europe/London">London (GMT+0)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Asia/Dubai">Dubai (GMT+4)</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="System Overview">
        <div className="inline-grid grid-cols-[auto_auto] gap-x-10 gap-y-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="contents">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-sm font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Change Password">
        <div className="grid grid-cols-2 gap-x-12 gap-y-5">
          <PasswordInput
            label="Current Password"
            field="current"
            showPass={showPass}
            setShowPass={setShowPass}
            passwords={passwords}
            setPasswords={setPasswords}
          />
          <div />
          <PasswordInput
            label="New Password"
            field="new"
            showPass={showPass}
            setShowPass={setShowPass}
            passwords={passwords}
            setPasswords={setPasswords}
          />
          <PasswordInput
            label="Confirm New Password"
            field="confirm"
            showPass={showPass}
            setShowPass={setShowPass}
            passwords={passwords}
            setPasswords={setPasswords}
          />
        </div>
        {passError && <p className="text-xs text-red-500 mt-3">{passError}</p>}
        {passSuccess && (
          <p className="text-xs text-emerald-500 mt-3">{passSuccess}</p>
        )}
        <button
          onClick={handleChangePassword}
          className="mt-4 px-5 py-2 rounded-xl bg-[#1B2036] text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Update Password
        </button>
      </SectionCard>

      <button className="mt-2 mb-8 px-5 py-2.5 rounded-xl border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50 transition">
        Delete Account
      </button>
    </div>
  );
};

export default Account;
