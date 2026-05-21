"use client";

import { useState } from "react";

import { useNotifications } from "../hooks/use-notifications";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAllRead } =
    useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
      >
        Notifications
        {unreadCount > 0 ? (
          <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-slate-950">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-14 z-50 w-[22rem] rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-brand-light transition hover:text-white"
            >
              Mark all read
            </button>
          </div>

          <div className="mt-4 max-h-96 space-y-3 overflow-auto">
            {isLoading ? (
              <p className="text-sm text-slate-400">Loading notifications...</p>
            ) : null}

            {!isLoading && notifications.length === 0 ? (
              <p className="text-sm text-slate-400">
                No notifications yet.
              </p>
            ) : null}

            {notifications.map((notification) => (
              <article
                key={notification.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {notification.title}
                  </p>
                  {!notification.isRead ? (
                    <span className="rounded-full bg-brand/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-light">
                      New
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {notification.message}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

