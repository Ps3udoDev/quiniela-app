import Link from "next/link";
import { AuthCard } from "@/components/organisms/auth-card";
import { FieldBackdrop } from "@/components/atoms/field-backdrop";
import { WordMark } from "@/components/atoms/word-mark";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <FieldBackdrop />
      <Link href="/" className="relative mb-8">
        <WordMark className="text-2xl" />
      </Link>
      <div className="relative">
        <AuthCard mode="login" />
      </div>
    </div>
  );
}
