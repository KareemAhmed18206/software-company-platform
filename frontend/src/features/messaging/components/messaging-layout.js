"use client";

import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api/client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSocket } from "../hooks/use-socket";

export function MessagingLayout({ counterpartRole }) {
  const { token, user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const counterpart = useMemo(
    () =>
      activeConversation?.participants?.find(
        (participant) => participant.id !== user.id
      ) || null,
    [activeConversation, user.id]
  );

  const loadConversations = async () => {
    const response = await apiRequest("/messaging/conversations", { token });
    setConversations(response.conversations);

    if (!activeConversation && response.conversations.length > 0) {
      setActiveConversation(response.conversations[0]);
    }
  };

  const loadMessages = async (conversationId) => {
    const response = await apiRequest(
      `/messaging/conversations/${conversationId}/messages`,
      { token }
    );
    setActiveConversation(response.conversation);
    setMessages(response.messages);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await apiRequest("/messaging/conversations", {
          token
        });

        if (!isMounted) {
          return;
        }

        setConversations(response.conversations);

        if (response.conversations.length > 0) {
          const history = await apiRequest(
            `/messaging/conversations/${response.conversations[0].id}/messages`,
            { token }
          );

          if (!isMounted) {
            return;
          }

          setActiveConversation(history.conversation);
          setMessages(history.messages);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!socket || !activeConversation?.id) {
      return undefined;
    }

    socket.emit("conversation:join", activeConversation.id);

    const handleNewMessage = (message) => {
      if (message.conversationId === activeConversation.id) {
        setMessages((current) => [...current, message]);
      }
      loadConversations();
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.emit("conversation:leave", activeConversation.id);
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, activeConversation?.id]);

  const handleSelectConversation = async (conversation) => {
    await loadMessages(conversation.id);
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if (!activeConversation?.id || !content.trim()) {
      return;
    }

    setError("");

    try {
      const response = await apiRequest(
        `/messaging/conversations/${activeConversation.id}/messages`,
        {
          method: "POST",
          token,
          body: {
            content
          }
        }
      );

      setMessages((current) => [...current, response.message]);
      setContent("");
      await loadConversations();
    } catch (sendError) {
      setError(sendError.message);
    }
  };

  const handleCreateConversation = async () => {
    setError("");
    setIsCreatingConversation(true);

    try {
      const contactsResponse = await apiRequest(
        `/users/contacts/${counterpartRole}`,
        { token }
      );

      const firstContact = contactsResponse.contacts[0];

      if (!firstContact) {
        setError(`No ${counterpartRole} account is available yet.`);
        return;
      }

      const response = await apiRequest("/messaging/conversations", {
        method: "POST",
        token,
        body: {
          otherUserId: firstContact.id,
          title: `${user.name} / ${firstContact.name}`
        }
      });

      await loadConversations();
      await loadMessages(response.conversation.id);
    } catch (creationError) {
      setError(creationError.message);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Loading messaging workspace...
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
          Conversations
        </p>
        <div className="mt-4 space-y-3">
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">
                No conversations yet. Start a direct conversation with your {counterpartRole}.
              </p>
              <button
                type="button"
                disabled={isCreatingConversation}
                onClick={handleCreateConversation}
                className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreatingConversation ? "Creating..." : "Start conversation"}
              </button>
            </div>
          ) : null}

          {conversations.map((conversation) => {
            const participant = conversation.participants.find(
              (entry) => entry.id !== user.id
            );

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  activeConversation?.id === conversation.id
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/10 bg-slate-950/60 hover:border-white/20"
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  {participant?.name || counterpartRole}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {participant?.role || counterpartRole}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <div className="border-b border-white/10 pb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
            Live Chat
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {counterpart?.name || `Your ${counterpartRole} conversation`}
          </h2>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 max-h-[26rem] space-y-3 overflow-auto pr-2">
          {messages.map((message) => {
            const ownMessage = message.sender?.id === user.id;

            return (
              <div
                key={message.id}
                className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl rounded-[1.5rem] px-4 py-3 text-sm leading-7 ${
                    ownMessage
                      ? "bg-brand text-slate-950"
                      : "bg-slate-950/70 text-slate-100"
                  }`}
                >
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] opacity-70">
                    {message.sender?.name}
                  </div>
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="mt-5 flex gap-3">
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-white/10 bg-slate-950 px-5 py-3 text-sm text-white outline-none transition focus:border-brand"
          />
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
