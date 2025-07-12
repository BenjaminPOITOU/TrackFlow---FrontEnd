"use client";
/**
 * @file components/usermenu/UserMenu.jsx
 * @description A user menu component that acts as a trigger to open a side panel (`Sheet`)
 * displaying a summary of the logged-in user's profile.
 */

import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";


/**
 * Renders a user menu button that, when clicked, opens a side panel with user profile details.
 *
 * @param {object} props - The component props.
 * @param {{firstName: string, lastName: string}} props.userData - An object containing the user's data.
 * @returns {JSX.Element} The JSX for the UserMenu component.
 */

export default function UserMenu({ userData }) {
  const firstName = userData?.firstName;
  const lastName = userData?.lastName;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex justify-center items-center w-full gap-2 cursor-pointer hover:text-gray-400 text-gray-300">
          <span>{firstName}</span>
          <span>{lastName}</span>
        </button>
      </SheetTrigger>

      <SheetContent className="bg-zinc-800 text-gray-300 px-4">
        <SheetHeader>
          <SheetTitle>{`Resumé du profil de ${firstName}`}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Prénom :
            </Label>
            <Label htmlFor="name" className="text-right">
              {firstName}
            </Label>
            <Label id="firstName" value={firstName} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom :
            </Label>
            <Label htmlFor="name" className="text-right">
              {lastName}
            </Label>
            <Label id="lastName" value={lastName} className="col-span-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
