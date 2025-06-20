import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getCommitments,
  getCommitmentStats,
} from "../../actions/commitment-actions"; 
import { CommitmentDashboard } from "@/components/commitments/commitment-dashboard";

export default async function CommitmentsPage() {
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
            Please sign in to view your commitments
          </div>
        </div>
      </div>
    );
  }

  const userId = session.user.id;

  try {
    const [commitments, stats] = await Promise.all([
      getCommitments(userId),
      getCommitmentStats(userId),
    ]);

    return (
      <CommitmentDashboard
        commitments={commitments}
        stats={stats}
        userId={userId}
      />
    );
  } catch (error) {
    console.error("Error loading commitment data:", error);
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-2xl font-semibold mb-2">
            Error Loading Data
          </div>
          <div className="text-gray-400">Unable to load your commitments</div>
        </div>
      </div>
    );
  }
}
