"use client";

import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

/**
 * A reusable confirmation dialog for critical actions.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {(open: boolean) => void} props.onOpenChange - Function to control the dialog state.
 * @param {() => void} props.onConfirm - The function to call when the action is confirmed.
 * @param {boolean} props.isConfirming - Loading state for the confirmation button.
 * @param {React.ReactNode} props.titleIcon - Icon to display in the title.
 * @param {string} props.title - The dialog title.
 * @param {string} props.description - The dialog description text.
 * @param {string} props.confirmText - Text for the confirmation button.
 * @param {'warning' | 'danger'} props.variant - The visual variant of the dialog.
 * @returns {JSX.Element} A reusable alert dialog component.
 */
export default function ActionConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isConfirming,
  titleIcon,
  title,
  description,
  confirmText,
  variant,
}) {
  const variantClasses = {
    warning: "border-yellow-600",
    danger: "border-red-600",
  };

  const buttonVariantClasses = {
    warning: "bg-yellow-600 text-black hover:bg-yellow-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const handleConfirmClick = (e) => {
    console.log("[Dialog] 2. Bouton de confirmation cliqué.");
    onConfirm(e);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`bg-zinc-900 ${variantClasses[variant] || 'border-border'}`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {titleIcon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-zinc-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className={buttonVariantClasses[variant]} onClick={handleConfirmClick} disabled={isConfirming}>
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}