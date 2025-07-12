"use client";

/**
 * @file components/logout/LogoutDialog.js (or .tsx)
 * @description A specialized component that wraps a generic confirmation dialog to create a user logout prompt.
 * It is responsible for handling the API call to the logout endpoint and providing user feedback via toasts.
 */
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionConfirmationDialog from "@/components/shared/ActionConfirmationDialog";
import { LogOut } from "lucide-react";


/**
 * Renders a confirmation dialog specifically for logging out the user.
 *
 * This component demonstrates the composition pattern. It doesn't build a dialog from scratch;
 * instead, it configures and wraps the reusable `ActionConfirmationDialog` component.
 * It provides the specific logic (`handleLogout`) and content (title, description, icon)
 * required for the logout action.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls whether the dialog is currently visible.
 * @param {function(): void} props.onClose - A callback function invoked when the dialog should be closed (e.g., by the user cancelling the action).
 * @returns {JSX.Element} A configured `ActionConfirmationDialog` for logout confirmation.
 */
export default function LogoutDialog({ isOpen, onClose }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Logout API failed");

      toast.success("Vous avez été déconnecté.");
      router.push("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion.");
      console.error(error);
    }
  };

  return (
    <ActionConfirmationDialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      onConfirm={handleLogout}
      isConfirming={false}
      title="Fermer la session ?"
      titleIcon={<LogOut className="h-5 w-5 text-gray-300" />}
      description="Cela vous déconnectera immédiatement de la plateforme."
      confirmText="Se déconnecter"
      variant="danger"
    />
  );
}
