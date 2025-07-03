"use client"

import { useState } from "react";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function UserMenu({ isCollapsed }) {
  const [name, setName] = useState('BENJAMIN');
  const [username, setUsername] = useState('Benji'); 

  const handleSaveChanges = () => {
    console.log("Saving changes:", { name, username });
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        {/* Version icône, affichée par défaut et quand la sidebar est réduite sur grand écran */}
        <div className={`flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-700/50 transition-colors ${!isCollapsed && "lg:hidden"}`}>
          <UserCircle2 size={24} />
        </div>

        {/* Version texte, affichée uniquement sur grand écran et quand la sidebar n'est PAS réduite */}
        <div className={`hidden h-10 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground ${!isCollapsed && "lg:inline-flex items-center justify-center"}`}>
          {name} ACCOUNT
        </div>
      </SheetTrigger>
      
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier le profil</SheetTitle>
          <SheetDescription>
            Apportez des modifications à votre profil ici. Cliquez sur Enregistrer lorsque vous avez terminé.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Pseudo
            </Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3" 
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={handleSaveChanges}>Enregistrer les modifications</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}