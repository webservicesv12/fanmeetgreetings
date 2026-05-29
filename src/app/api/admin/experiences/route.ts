import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Default experience type config (used as fallback)
const DEFAULT_EXPERIENCES = [
  { type: "MEET_AND_GREET",    label: "Meet & Greet",      icon: "🤝", defaultPrice: 5000,  defaultDuration: 30,  description: "Personal one-on-one meeting" },
  { type: "VIDEO_CALL",        label: "Video Call",         icon: "📹", defaultPrice: 1500,  defaultDuration: 15,  description: "Live virtual session" },
  { type: "BIRTHDAY_SHOUTOUT", label: "Birthday Shoutout",  icon: "🎂", defaultPrice: 500,   defaultDuration: 5,   description: "Personal video message" },
  { type: "VIP_DINNER",        label: "VIP Dinner",         icon: "🍽️", defaultPrice: 15000, defaultDuration: 120, description: "Exclusive private dining" },
  { type: "LIVE_APPEARANCE",   label: "Live Appearance",    icon: "🎤", defaultPrice: 25000, defaultDuration: 60,  description: "Event/venue appearance" },
  { type: "PRIVATE_CONCERT",   label: "Private Concert",    icon: "🎵", defaultPrice: 50000, defaultDuration: 90,  description: "Exclusive private performance" },
  { type: "PHOTO_SESSION",     label: "Photo Session",      icon: "📸", defaultPrice: 3000,  defaultDuration: 45,  description: "Professional photo shoot" },
];

const isAdmin = async () => {
  const session = await auth();
  return session?.user && (session.user as any).role === "ADMIN" ? session : null;
};

export async function GET() {
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const setting = await prisma.siteSettings.findUnique({ where: { key: "experience_types" } });
  const experiences = setting ? JSON.parse(setting.value) : DEFAULT_EXPERIENCES;

  return NextResponse.json({ experiences });
}

export async function PATCH(req: NextRequest) {
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { experiences } = await req.json();

  await prisma.siteSettings.upsert({
    where: { key: "experience_types" },
    create: { key: "experience_types", value: JSON.stringify(experiences) },
    update: { value: JSON.stringify(experiences) },
  });

  return NextResponse.json({ experiences });
}
