export interface ProfileStats {
  totalCommitments: number;
  completedCommitments: number;
  currentStreak: number;
  longestStreak: number;
  totalTodos: number;
  completionRate: number;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  image?: string;
}
