import { useState, useEffect, useRef } from "react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { MdPerson, MdEmail, MdSchool, MdEdit, MdLock } from "react-icons/md";
import { Pencil, Camera, Eye, EyeOff } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images/man.png";

const SectionCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
    <div className="flex items-center gap-2 mb-5">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-[#465182]/[0.06] flex items-center justify-center">
          <Icon size={14} className="text-[#465182]" />
        </div>
      )}
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>
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
    <p className="text-xs text-gray-400 font-medium mb-1.5">{label}</p>
    <div className="relative">
      <input
        type={showPass[field] ? "text" : "password"}
        value={passwords[field]}
        onChange={(e) =>
          setPasswords((prev) => ({ ...prev, [field]: e.target.value }))
        }
        className="w-full text-sm border border-gray-200/70 bg-[#FAFBFC] rounded-xl px-3.5 py-2.5 pr-9 outline-none focus:border-[#465182]/25 focus:bg-white focus:ring-2 focus:ring-[#465182]/5 transition-all duration-200"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() =>
          setShowPass((prev) => ({ ...prev, [field]: !prev[field] }))
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPass[field] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentApi.getProfile();
        setProfile(response.data);
        console.log("Profile Data:", response.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
  };

  const handleSave = async (field) => {
    try {
      const updateData = { [field]: tempValue };
      await studentApi.updateProfile(updateData);
      setProfile((prev) => ({ ...prev, [field]: tempValue }));
      setEditField(null);
    } catch (err) {
      console.error("Failed to update:", err);
      setError("Failed to update field");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profile_picture_url: url }));
      
      const formData = new FormData();
      formData.append("profile_picture", file);
      try {
        await studentApi.updateProfile(formData);
      } catch (err) {
        console.error("Failed to upload image:", err);
      }
    }
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

  const userName =
    profile?.full_name || user?.name || user?.email?.split("@")[0] || "Student";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D67A1E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FB]">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-[#465182] transition-all group"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage your personal information and settings
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-4 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 mb-4">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={profile?.profile_picture_url || defaultAvatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200/60 shadow-sm"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200/60 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
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

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {userName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                {profile?.student_id && (
                  <span className="text-[11px] font-semibold text-[#465182] bg-[#465182]/[0.06] px-2.5 py-1 rounded-lg border border-[#465182]/8">
                    ID: {profile.student_id}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-[#D67A1E] bg-[#D67A1E]/[0.06] px-2.5 py-1 rounded-lg border border-[#D67A1E]/8">
                  Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={MdPerson}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {[
              {
                label: "Full Name",
                key: "full_name",
                value: profile?.full_name,
              },
              { label: "Email", key: "email", value: user?.email },
              {
                label: "Student ID",
                key: "student_id",
                value: profile?.student_id,
                readonly: true,
              },
              {
                label: "Department",
                key: "department_name",
                value: profile?.department_name || profile?.department?.name,
                readonly: true,
              },
              {
                label: "Academic Year",
                key: "academic_year",
                value: profile?.student_current_level,
                readonly: true,
              },
              {
                label: "University",
                key: "university",
                value: profile?.university,
                readonly: true,
              },
            ].map(({ label, key, value, readonly }) => (
              <div key={key}>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  {!readonly && value !== undefined && (
                    <button
                      onClick={() => handleEdit(key, value || "")}
                      className="hover:text-[#465182] transition-colors"
                    >
                      <Pencil
                        size={11}
                        className="text-gray-300 hover:text-[#465182]"
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
                      className="text-sm border border-[#465182]/25 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#465182]/5 transition-all duration-200 w-full"
                    />
                    <button
                      onClick={() => handleSave(key)}
                      className="text-xs text-[#465182] font-bold hover:underline flex-shrink-0"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className="text-xs text-gray-400 hover:underline flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-800">
                    {value || "N/A"}
                    {readonly && (
                      <span className="ml-2 text-[10px] font-medium text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded">
                        Read-only
                      </span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Change Password */}
        <SectionCard title="Change Password" icon={MdLock}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            <PasswordInput
              label="Current Password"
              field="current"
              showPass={showPass}
              setShowPass={setShowPass}
              passwords={passwords}
              setPasswords={setPasswords}
            />
            <div className="hidden md:block" />
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
          {passError && (
            <p className="text-xs text-red-500 font-medium mt-3 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              {passError}
            </p>
          )}
          {passSuccess && (
            <p className="text-xs text-emerald-600 font-medium mt-3 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              {passSuccess}
            </p>
          )}
          <button
            onClick={handleChangePassword}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#465182] text-white text-sm font-semibold hover:bg-[#3a4570] transition-all duration-200 shadow-md shadow-[#465182]/15 active:scale-[0.995]"
          >
            Update Password
          </button>
        </SectionCard>

        <div className="mt-2 mb-8 bg-white rounded-2xl p-6 shadow-sm border border-red-100/60">
          <p className="text-xs text-gray-400 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button className="px-5 py-2.5 rounded-xl border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors duration-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
