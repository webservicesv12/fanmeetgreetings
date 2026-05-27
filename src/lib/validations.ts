import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

// ─── Booking ──────────────────────────────────────────────────────────────────

export const bookingStep1Schema = z.object({
  eventType: z.enum([
    "MEET_AND_GREET",
    "VIDEO_CALL",
    "BIRTHDAY_SHOUTOUT",
    "VIP_DINNER",
    "LIVE_APPEARANCE",
    "PRIVATE_CONCERT",
    "PHOTO_SESSION",
  ]),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  duration: z.number().min(15, "Minimum 15 minutes"),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  guestCount: z.number().min(1).max(100).default(1),
  specialRequirements: z.string().optional(),
  packageId: z.string().optional(),
});

export const bookingStep2Schema = z.object({
  contactName: z.string().min(2, "Full name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(7, "Phone number is required"),
});

export const bookingStep3Schema = z.object({
  paymentMethod: z.enum([
    "BITCOIN",
    "ETHEREUM",
    "USDT_TRC20",
    "LITECOIN",
    "BUSD",
    "BANK_TRANSFER",
  ]),
});

export const createBookingSchema = bookingStep1Schema
  .merge(bookingStep2Schema)
  .merge(bookingStep3Schema)
  .extend({
    celebrityId: z.string().min(1),
    totalAmount: z.number().positive(),
  });

// ─── Celebrity ────────────────────────────────────────────────────────────────

export const createCelebritySchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum([
    "MUSIC",
    "ACTOR",
    "INFLUENCER",
    "ATHLETE",
    "COMEDIAN",
    "DJ",
    "PRESENTER",
    "POLITICIAN",
    "ENTREPRENEUR",
  ]),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  location: z.string().optional(),
  nationality: z.string().optional(),
  yearsActive: z.string().optional(),
  basePrice: z.number().positive("Price must be positive"),
  tags: z.array(z.string()).optional(),
  socialLinks: z
    .object({
      instagram: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
      tiktok: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// ─── Package ──────────────────────────────────────────────────────────────────

export const createPackageSchema = z.object({
  name: z.string().min(2, "Package name is required"),
  description: z.string().min(10, "Description is required"),
  eventType: z.enum([
    "MEET_AND_GREET",
    "VIDEO_CALL",
    "BIRTHDAY_SHOUTOUT",
    "VIP_DINNER",
    "LIVE_APPEARANCE",
    "PRIVATE_CONCERT",
    "PHOTO_SESSION",
  ]),
  duration: z.number().min(15),
  price: z.number().positive(),
  maxGuests: z.number().min(1),
  includes: z.array(z.string()).optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────

export const submitPaymentSchema = z.object({
  bookingId: z.string().min(1),
  txHash: z.string().optional(),
  bankRef: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const createWalletSchema = z.object({
  coin: z.enum(["BITCOIN", "ETHEREUM", "USDT_TRC20", "LITECOIN", "BUSD"]),
  label: z.string().min(1, "Label is required"),
  address: z.string().min(10, "Wallet address is required"),
  network: z.string().optional(),
});

// ─── Bank Account ─────────────────────────────────────────────────────────────

export const createBankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountName: z.string().min(2, "Account name is required"),
  accountNumber: z.string().min(4, "Account number is required"),
  routingNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  iban: z.string().optional(),
  currency: z.string().default("USD"),
  country: z.string().optional(),
});

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  celebrityId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

// ─── Admin Email ──────────────────────────────────────────────────────────────

export const sendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1, "At least one recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateCelebrityInput = z.infer<typeof createCelebritySchema>;
export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;
