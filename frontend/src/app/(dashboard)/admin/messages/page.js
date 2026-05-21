"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { MessagingLayout } from "@/features/messaging/components/messaging-layout";

export default function AdminMessagesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout
        title="Messaging"
        description="Real-time admin messaging with conversation history and live updates through Socket.io."
      >
        <MessagingLayout counterpartRole="client" />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

