import { deleteCompositionById } from "@/lib/api/compositions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function AlertDialogCompostion({
  isOpen,
  onClose,
  projectId,
  composition,
  onCompositionDeleted,
}) {
  const handleConfirmDelete = async () => {
    try {
      await deleteCompositionById(projectId, composition.id);
      toast.success(`La composition "${composition.title}" a été supprimée.`);

      onCompositionDeleted(composition.id);

      onClose(); 
    } catch (error) {
      toast.error("Échec de la suppression de la composition.");
      console.error(error);
    }
  };

  return (
  
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La composition "{composition.title}" sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="cursor-pointer bg-gray-300 text-zinc-800 hover:bg-gray-400">
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  );
}