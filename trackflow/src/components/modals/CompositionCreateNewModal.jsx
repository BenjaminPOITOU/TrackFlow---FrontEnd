import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCompositionStatuses } from "@/lib/api/enum";

import { CompositionForm } from "../compositions/CompositionForm";

import { MiniVisualizer } from "../MiniVisualizer";
import { createCompositionByProjectId } from "@/lib/api/compositions";
import { toast } from "sonner";

export default function CompositionCreateNewModal({
  isOpen,
  onOpenChange,
  projectId,
  onResponseCreateCompositionChange,
}) {
  const [compositionStatuses, setCompositionStatuses] = useState(null);
  const [createCompositionResponse, setCreationCompositionResponse] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    compositionStatus: "",
    subGender: [],
    description: "",
    illustration: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      if (name === "subGender") {
      return { ...prevFormData, [name]: value ? [value] : [] };
    }
    return { ...prevFormData, [name]: value };
    });
  };

  const handleStatusChange = (value) => {
    setFormData((prevFormData) => {
      return { ...prevFormData, compositionStatus: value };
    });
  };

  useEffect(() => {
    const fetchCompositionEnum = async () => {
      if (projectId) {
        setIsLoading(true);
        setCompositionStatuses(null);

        try {
          const fetchData = await getCompositionStatuses();
          setCompositionStatuses(fetchData);
          setIsLoading(false);
        } catch (error) {
          setError(error);
          console.log(
            "Something went wrong with getCompositionStatuses Api Call. Error Status : ",
            error
          );
          setIsLoading(false);
          setCompositionStatuses(null);
        }
      } else {
        setIsLoading(false);
        setCompositionStatuses(null);
        console.log("projectId unknown : ", projectId);
      }
    };

    fetchCompositionEnum();
  }, []);

  async function handleOnSubmit(event) {
    event.preventDefault();
    console.log("Données envoyées à l'API:", formData);

    if (!projectId) {
      console.log("Project ID not found");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
    const responseCreateModal = await createCompositionByProjectId(  
      projectId,
      formData
    );

    console.log("Réponse API création:", responseCreateModal);
    onResponseCreateCompositionChange(responseCreateModal); 
    onOpenChange(false);
    setFormData({ title: "", compositionStatus: "", subGender: [], description: "", illustration: "" });
    toast.success("Composition has been created successfully !")
    return;
    } catch (error) {
      setError(error);
      console.log(
        "Something went wrong with creataCompositionByProjectId Api call : ",
        error
      );
      toast.error("Composition creation failed...");
      setIsLoading(false);
      return;
    }finally{

        setIsLoading(false);
    }
  }

  function handleOnCancel() {
    onOpenChange(false);
  }

  return (
    <Dialog className="flex flex-col" open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 sm:max-w-3xl my-2 p-2 border border-gray-300">
        <div className="w-full p-3 border border-gray-300">
          <DialogHeader className="flex px-4 items-center gap-3">
            <div className="flex flex-col gap-1">
              <DialogTitle>NEW_COMPOSITION</DialogTitle>
              <DialogDescription>
                CREATE A NEW COMPOSITION FOR YOUR PROJECT
              </DialogDescription>
            </div>
            <MiniVisualizer className="w-12 h-12" type="cube" />
          </DialogHeader>

          <div className="h-px w-72 bg-gray-300 my-4"></div>

          <CompositionForm
            compositionStatuses={compositionStatuses}
            formData={formData}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
            onSubmit={handleOnSubmit}
            onCancel={handleOnCancel}
          />

          <div className="h-px w-72 bg-gray-300 my-4"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
