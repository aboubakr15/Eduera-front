import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";
import { MdPerson, MdEmail, MdSchool, MdEdit } from "react-icons/md";

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", profile_picture_url: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentApi.getProfile();
        setProfile(response.data);
        setFormData({ full_name: response.data.full_name || "", profile_picture_url: response.data.profile_picture_url || "" });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await studentApi.updateProfile(formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-400">Manage your account information</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
              {profile?.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <MdPerson className="text-blue-600" size={48} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{profile?.full_name || 'Student'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              <MdEdit size={16} />
              Edit
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  value={formData.profile_picture_url}
                  onChange={(e) => setFormData({ ...formData, profile_picture_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Save</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MdEmail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSchool className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-800">{profile?.student_id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSchool className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">Department ID: {profile?.department || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSchool className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Current GPA</p>
                  <p className="font-medium text-gray-800">{profile?.current_gpa || '0.00'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdSchool className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Enrolled Hours</p>
                  <p className="font-medium text-gray-800">{profile?.enrolled_hours || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;