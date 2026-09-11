"use client";

import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ModalCtx = createContext<{ close: () => void }>({ close: () => {} });
export const useModal = () => useContext(ModalCtx);

/**
 * A trigger button that opens a modal containing `children`.
 * `render` receives a `close` fn so forms can dismiss on submit.
 */
export function Modal({
  trigger,
  title,
  children,
}: {
  trigger: (open: () => void) => React.ReactNode;
  title: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {trigger(() => setOpen(true))}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="card relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-b-none rounded-t-[22px] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-[22px] sm:p-6 sm:pb-6"
              style={{ boxShadow: "var(--shadow-lg)" }}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                <button
                  onClick={close}
                  className="pressable -mr-1 rounded-full p-2 text-secondary hover:bg-[var(--border)]"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <ModalCtx.Provider value={{ close }}>
                {typeof children === "function" ? children(close) : children}
              </ModalCtx.Provider>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
