import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProfileStats, getUserProfile } from "../../actions/profile-actions";
import { ProfileDashboard } from "@/components/profile/profile-dashboard";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-white text-2xl font-semibold mb-2">
            Authentication Required
          </div>
          <div className="text-gray-400">
            Please sign in to view your profile
          </div>
        </div>
      </div>
    );
  }

  const userId = session.user.id;

  try {
    const [userProfile, profileStats] = await Promise.all([
      getUserProfile(userId),
      getProfileStats(userId),
    ]);

    return <ProfileDashboard user={userProfile} stats={profileStats} />;
  } catch (error) {
    console.error("Error loading profile data:", error);
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-2xl font-semibold mb-2">
            Error Loading Profile
          </div>
          <div className="text-gray-400">
            Unable to load your profile information
          </div>
        </div>
      </div>
    );
  }
}
