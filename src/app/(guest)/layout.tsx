import { GuestGuard } from "@/components/auth/Guards";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
