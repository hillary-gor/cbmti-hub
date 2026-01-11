"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import clsx from "clsx";

interface SignOutButtonProps {
  isCollapsed?: boolean;
}

export function SignOutButton({ isCollapsed = false }: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/auth/signout", { method: "POST" });
        
        if (res.ok) {
          setOpen(false);
          router.push("/");
          router.refresh(); 
        }
      } catch (error) {
        console.error("Sign out failed", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={clsx(
            "text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full",
            isCollapsed
              ? "justify-center p-3"
              : "flex items-center gap-2 text-sm font-medium"
          )}
          title="Sign Out"
        >
          <LogOut className={clsx("w-4 h-4", isCollapsed ? "" : "mr-2")} />
          {!isCollapsed && <span>Sign out</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 rounded-full mb-3">
             <LogOut className="w-6 h-6 text-red-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              Sign out of your account?
            </DialogTitle>
            <DialogDescription className="text-center">
              You’ll need to log in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-row justify-center gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Yes, sign out"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}