"use client";

import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChatSessionProvider } from "./ChatSessionProvider";
import { ElevenLabsProvider } from "./ElevenLabsProvider";
import { TextChatbot } from "./TextChatbot";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ElevenLabsProvider>
      <ChatSessionProvider>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-end p-3 sm:p-5">
          <div className="pointer-events-auto flex flex-col items-end gap-3">
            <AnimatePresence>
              {open && (
                <motion.div
                  key="chat-panel"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[min(70vh,34rem)] w-[min(100vw-1.5rem,24rem)] overflow-hidden"
                  role="dialog"
                  aria-label="Vyuha assistant chat"
                >
                  <TextChatbot onClose={() => setOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close chat" : "Open chat"}
              whileTap={{ scale: 0.96 }}
              className="inline-flex h-12 items-center gap-2 border border-cyan-400/35 bg-black/80 px-4 font-display text-[11px] uppercase tracking-[0.2em] text-cyan-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
            >
              {open ? (
                <X className="size-4" />
              ) : (
                <MessageCircle className="size-4" />
              )}
              {open ? "Close" : "Chat"}
            </motion.button>
          </div>
        </div>
      </ChatSessionProvider>
    </ElevenLabsProvider>
  );
}
