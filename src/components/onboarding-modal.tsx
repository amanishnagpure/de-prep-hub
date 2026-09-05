"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SQL_ROUTES } from "@/lib/sql";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const STORAGE_KEY = "de-prep-hub-onboarded-v1";

export function OnboardingModal() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start here</DialogTitle>
          <DialogDescription>One path. Four weeks. SQL first.</DialogDescription>
        </DialogHeader>

        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Read SQL Notes (Easy → Medium)</li>
          <li>2. Solve 25 practice problems</li>
          <li>3. Mark 15 LeetCode must-do confident</li>
          <li>4. Run a 45-min mock before real interviews</li>
        </ol>

        <DialogFooter className="gap-2 sm:gap-0">
          <button type="button" onClick={dismiss} className={buttonVariants({ variant: "outline" })}>
            Got it
          </button>
          <Link
            href={SQL_ROUTES.notes}
            onClick={dismiss}
            className={cn(buttonVariants(), "bg-cyan-600 hover:bg-cyan-600/90")}
          >
            Open SQL Lab
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
