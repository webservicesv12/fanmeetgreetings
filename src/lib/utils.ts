import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMMM dd, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMMM dd, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateReference(): string {
  const prefix = "MGR";
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${mins}m`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAYMENT_SUBMITTED: "Payment Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  AWAITING_PAYMENT: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PAYMENT_SUBMITTED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  APPROVED: "text-green-400 bg-green-400/10 border-green-400/20",
  REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  COMPLETED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  CANCELLED: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  RESCHEDULED: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  MEET_AND_GREET: "Meet & Greet",
  VIDEO_CALL: "Video Call",
  BIRTHDAY_SHOUTOUT: "Birthday Shoutout",
  VIP_DINNER: "VIP Dinner",
  LIVE_APPEARANCE: "Live Appearance",
  PRIVATE_CONCERT: "Private Concert",
  PHOTO_SESSION: "Photo Session",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BITCOIN: "Bitcoin (BTC)",
  ETHEREUM: "Ethereum (ETH)",
  USDT_TRC20: "USDT TRC20",
  LITECOIN: "Litecoin (LTC)",
  BUSD: "BUSD",
  BANK_TRANSFER: "Bank / Wire Transfer",
};

export const CELEB_CATEGORY_LABELS: Record<string, string> = {
  MUSIC: "Music Artist",
  ACTOR: "Actor / Actress",
  INFLUENCER: "Influencer",
  ATHLETE: "Athlete",
  COMEDIAN: "Comedian",
  DJ: "DJ",
  PRESENTER: "TV Presenter",
  POLITICIAN: "Politician",
  ENTREPRENEUR: "Entrepreneur",
};
