import { deleteCompositionById } from "@/lib/api/compositions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { AlertDialogCancel } from "../ui/alert-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export function AlertDialogCompostion({
  showDeleteConfirm,
  setShowDeleteConfirm,
  projectId,
  composition,
  onDeleteResponseChange
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



async function handleConfirmation(projectId, composition){

    setIsDeleting(true);
    if (composition && projectId) {
      setIsLoading(true);
      onDeleteResponseChange(null);

      const compositionId = composition.id;
      try {
        const fecthDeleteResponse = await deleteCompositionById(
          projectId,
          compositionId
        );
        onDeleteResponseChange(fecthDeleteResponse);
        setIsLoading(false);
        toast.success("Composition has been deleted successfully!");

      } catch (error) {
        setError(error);
        console.log(
          "Error with deleteCompositionById Api call. Error status : ",
          error
        );
        toast.error(`Delete composition failed: ${err.message}`);
        setIsLoading(false);
        onDeleteResponseChange(null);
      }
    } else {
      setIsLoading(false);
      console.log(
        `Something went wrong with composition : ${composition}  or projectId :${projectId}`
      );
    }

}



  return (
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent className="bg-zinc-900 border-red-600">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> Delete
            Composition Permanently?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 pt-2">
            This action is irreversible. All associated data (versions,
            branches, etc.) will be permanently deleted. Are you absolutely
            sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent hover:bg-zinc-700 border-zinc-600 text-zinc-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleConfirmation(projectId, composition)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Yes, Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
