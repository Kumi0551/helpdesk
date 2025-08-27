import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-cyan-400 to-purple-800">
          Your HelpDesk Solution
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your one-stop solution for all your needs.
        </p>
        <Link
          href="/signin"
          className="mt-8 bg-cyan-500 border-2 border-cyan-500 text-white font-semibold hover:border-purple-800 hover:bg-purple-800 hover:text-white rounded-full px-6 py-3 inline-block transition-colors duration-300"
        >
          Log In to your account
        </Link>
      </div>
    </div>
  );
}