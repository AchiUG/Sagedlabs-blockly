import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Young Sages | AI Thinking for Kids 8-14 | SAGED",
  description:
    "An 8-week adventure where children ages 8-14 learn to think like AI through African folktales, interactive games, and hands-on coding with Leuk the Hare. Now enrolling for Season 1!",
  keywords: [
    "AI education for kids",
    "coding for children",
    "STEM education Africa",
    "AI thinking skills",
    "Leuk the Hare",
    "African folktales",
    "computational thinking",
    "young sages",
    "kids programming",
    "AI literacy",
  ],
  openGraph: {
    title: "Young Sages | AI Thinking for Kids 8-14",
    description:
      "Learn to think like AI through African folktales and interactive games. An 8-week adventure for ages 8-14.",
    type: "website",
    url: "https://sagedlabs.com/young-sages",
    siteName: "SAGED",
    images: [
      {
        url: "/images/young-sages-og.png",
        width: 1200,
        height: 630,
        alt: "Young Sages - AI Thinking for Kids featuring Leuk the Hare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Sages | AI Thinking for Kids 8-14",
    description:
      "Learn to think like AI through African folktales and interactive games. An 8-week adventure for ages 8-14. Now enrolling!",
    images: ["/images/young-sages-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function YoungSagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
