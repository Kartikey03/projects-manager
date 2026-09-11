"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { saveManager } from "@/app/dashboard/actions";
import type { Manager } from "@/lib/types";

export function ManagerEditor({
  manager,
  trigger,
}: {
  manager?: Manager;
  trigger: (open: () => void) => React.ReactNode;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Modal trigger={trigger} title={manager ? "Edit person" : "Add a person"}>
      {(close) => (
        <form
          action={(fd) =>
            start(async () => {
              await saveManager(fd);
              close();
              router.refresh();
            })
          }
          className="space-y-4"
        >
          {manager && <input type="hidden" name="id" value={manager.id} />}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Name<span style={{ color: "var(--red)" }}> *</span>
            </span>
            <input
              name="name"
              required
              defaultValue={manager?.name}
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="Who brings you this work"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Phone</span>
              <input
                name="phone"
                defaultValue={manager?.phone ?? ""}
                className="input w-full px-4 py-2.5 text-sm"
                placeholder="+91…"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                name="email"
                defaultValue={manager?.email ?? ""}
                className="input w-full px-4 py-2.5 text-sm"
                placeholder="name@email.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Notes</span>
            <textarea
              name="notes"
              defaultValue={manager?.notes ?? ""}
              rows={3}
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="Commission split, how you met, anything useful…"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="btn-ghost px-5 py-2.5 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-60"
            >
              {pending && <Loader2 size={15} className="animate-spin" />}
              {manager ? "Save changes" : "Add person"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
