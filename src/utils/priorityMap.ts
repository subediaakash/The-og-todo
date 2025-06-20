export function mapPriority(priority: string): string {
  const mapping: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  return mapping[priority] || priority;
}
