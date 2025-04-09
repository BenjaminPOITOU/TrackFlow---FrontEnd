"use client"

import {
  CardHeader,
} from "../ui/card";

import { useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"

export default function UserMenu() {

      const [name, setName] = useState('BENJAMIN');
    const [username, setUsername] = useState('Benji'); 

      const handleSaveChanges = () => {

    console.log("Saving changes:", { name, username });

  };

return(
  
    <CardHeader>
     <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="cursor-pointer hover:bg-bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ">{name} ACCOUNT </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" 
            value={name} 
            onChange={() => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" 
            value={username} 
            onChange={() => setUsername(e.target.value)}
            className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </CardHeader>

  );
}
