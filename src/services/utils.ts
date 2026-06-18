export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function createLocalId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getDaysSince(dateString: string) {
  const today = new Date();
  const [year, month, day] = dateString.split("-").map(Number);
  const measuredDate = new Date(year, month - 1, day);

  today.setHours(0, 0, 0, 0);
  measuredDate.setHours(0, 0, 0, 0);
  const differenceMs = today.getTime() - measuredDate.getTime();
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
}

export function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
