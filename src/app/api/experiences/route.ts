import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_EXPERIENCES = [
  { type: "MEET_AND_GREET",    label: "Meet & Greet",      icon: "🤝", defaultPrice: 5000,  defaultDuration: 30,  description: "Personal one-on-one meeting",     isCustom: false },
  { type: "VIDEO_CALL",        label: "Video Call",         icon: "📹", defaultPrice: 1500,  defaultDuration: 15,  description: "Live virtual session",            isCustom: false },
  { type: "BIRTHDAY_SHOUTOUT", label: "Birthday Shoutout",  icon: "🎂", defaultPrice: 500,   defaultDuration: 5,   description: "Personal video message",          isCustom: false },
  { type: "VIP_DINNER",        label: "VIP Dinner",         icon: "🍽️", defaultPrice: 15000, defaultDuration: 120, description: "Exclusive private dining",         isCustom: false },
  { type: "LIVE_APPEARANCE",   label: "Live Appearance",    icon: "🎤", defaultPrice: 25000, defaultDuration: 60,  description: "Event/venue appearance",          isCustom: false },
  { type: "PRIVATE_CONCERT",   label: "Private Concert",    icon: "🎵", defaultPrice: 50000, defaultDuration: 90,  description: "Exclusive private performance",   isCustom: false },
  { type: "PHOTO_SESSION",     label: "Photo Session",      icon: "📸", defaultPrice: 3000,  defaultDuration: 45,  description: "Professional photo shoot",        isCustom: false },
];

export async function GET() {
  const setting = await prisma.siteSettings.findUnique({ where: { key: "experience_types" } });
  const experiences = setting ? JSON.parse(setting.value) : DEFAULT_EXPERIENCES;
  return NextResponse.json({ experiences });
}
