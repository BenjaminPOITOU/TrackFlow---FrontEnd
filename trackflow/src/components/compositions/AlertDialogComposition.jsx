import { deleteCompositionById } from "@/lib/api/compositions";
// Importez votre composant de dialogue (ex: de ShadCN)
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

      onClose(); // On ferme la modale
    } catch (error) {
      toast.error("Échec de la suppression de la composition.");
      console.error(error); // L'erreur API 500 apparaîtra ici
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La composition "{composition.title}" sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}