"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { MessagingLayout } from "@/features/messaging/components/messaging-layout";

export default function ClientMessagesPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardLayout
        title="Messages"
        description="Talk with the admin team in real time and keep your conversation history in one place."
      >
        <MessagingLayout counterpartRole="admin" />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

