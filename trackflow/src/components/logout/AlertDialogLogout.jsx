import React from "react";
import { useRouter} from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function AlertDialogLogout({isOpen, onClose}) {

const router = useRouter();
  const handleConfirmLogout = async () => {
    try {
        router.push("/");
   
    } catch (error) {
      toast.error("Échec de la sortie du site");
      console.error(error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir fermer votre session ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmLogout}
            className="cursor-pointer bg-gray-300 text-zinc-800 hover:bg-gray-400"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
