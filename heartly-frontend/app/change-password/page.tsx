"use client";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold">Change Password</h1>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-yellow-800">
            This page is being migrated from Supabase to SuperTokens authentication.
            Please use the SuperTokens password reset flow instead.
          </p>
        </div>
      </div>
    </div>
  );
}