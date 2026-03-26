import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      if (res.data.success) {
        setProfile(res.data.user);
      }
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-indigo-600 font-medium capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <div className="text-gray-900 font-medium p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {profile.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                <div className="text-gray-900 font-medium p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {profile.department || "Not Assigned"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                <div className="text-gray-900 font-medium p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {new Date(profile.created_at || new Date()).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <div className="text-gray-900 font-medium p-3 bg-gray-50 rounded-xl border border-gray-100 capitalize">
                  {profile.role}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

export default FacultyProfile;
