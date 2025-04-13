

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import SelectEnum from "../selects/SelectEnum";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MiniVisualizer } from "../MiniVisualizer";

export default function CompositionCreateNewModal({ isOpen, onOpenChange }) {
  // États pour les champs du formulaire
  const [compositionTitle, setCompositionTitle] = useState("");
  const [compositionStatus, setCompositionStatus] = useState("");
  const [projectGenre, setProjectGenre] = useState("ELECTRONIC"); // Valeur d'exemple
  const [subGenre, setSubGenre] = useState("");
  const [description, setDescription] = useState("");

  // Énumération des statuts de composition
  const compositionStatusOptions = [
    { label: "DRAFT", value: "EBAUCHE" },
    { label: "IN PROGRESS", value: "EN_COURS" },
    { label: "TO FINALIZE", value: "A_FINALISER" },
    { label: "COMPLETED", value: "TERMINE" }
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const compositionData = {
      title: compositionTitle,
      status: compositionStatus,
      projectGenre: projectGenre,
      subGenre: subGenre,
      description: description
    };

    console.log("Composition data:", compositionData);
    
    // Simuler une création réussie
    toast.success("Composition created successfully!");
    
    // Réinitialiser le formulaire
    setCompositionTitle("");
    setCompositionStatus("");
    setSubGenre("");
    setDescription("");
    
    // Fermer la modale
    onOpenChange(false);
  };

  return (
    <Dialog className="flex flex-col" open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 sm:max-w-3xl my-2 p-2 border border-gray-300">
        <div className="w-full p-3 border border-gray-300">
          <DialogHeader className="flex px-4 items-center gap-3">
            <div className="flex flex-col gap-1">
              <DialogTitle>NEW_COMPOSITION</DialogTitle>
              <DialogDescription>CREATE A NEW COMPOSITION FOR YOUR PROJECT</DialogDescription>
            </div>
            <MiniVisualizer className="w-12 h-12" type="cube" />
          </DialogHeader>

          <div className="h-px w-72 bg-gray-300 my-4"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Titre */}
            <div className="grid md:grid-cols-2 gap-x-6 pb-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="compositionTitle">COMPOSITION_TITLE</Label>
                <Input
                  id="compositionTitle"
                  placeholder="Enter composition title..."
                  className="bg-zinc-700"
                  name="compositionTitle"
                  value={compositionTitle}
                  onChange={(event) => setCompositionTitle(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* Section des champs de formulaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
              <div className="flex flex-col justify-start gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="projectGenre">PROJECT_GENRE</Label>
                  <Input
                    id="projectGenre"
                    className="bg-zinc-800 text-gray-400"
                    name="projectGenre"
                    value={projectGenre}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="compositionStatus">COMPOSITION_STATUS</Label>
                  <SelectEnum
                    options={compositionStatusOptions}
                    name="compositionStatus"
                    placeholder="Select status..."
                    value={compositionStatus}
                    onValueChange={setCompositionStatus}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subGenre">SUB_GENRE</Label>
                  <Input
                    id="subGenre"
                    placeholder="Enter sub-genre..."
                    className="bg-zinc-700"
                    name="subGenre"
                    value={subGenre}
                    onChange={(event) => setSubGenre(event.target.value)}
                  />
                </div>
              </div>

              {/* Colonne de Droite - Description */}
              <div className="flex flex-col justify-start gap-2 flex-grow">
                <Label htmlFor="description">DESCRIPTION</Label>
                <Textarea
                  id="description"
                  className="bg-zinc-700 border-zinc-600 text-gray-300 min-h-[180px] max-h-[250px] flex-grow"
                  placeholder="Add description for your composition..."
                  name="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-end items-center gap-3 pt-4 px-0 pb-0">
              <Button
                className="border border-gray-300 p-2 cursor-pointer"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                CANCEL
              </Button>
              <Button
                className="border border-zinc-900 bg-gray-300 text-zinc-900 cursor-pointer"
                type="submit"
              >
                CREATE_COMPOSITION
              </Button>
            </DialogFooter>
          </form>
          <div className="h-px w-72 bg-gray-300 my-4"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



 
  