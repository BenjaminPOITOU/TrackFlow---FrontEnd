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
import { SquarePower, User } from "lucide-react";

/**
 * Renders a user menu button that, when clicked, opens a side panel with user profile details.
 *
 * @param {object} props - The component props.
 * @param {{firstName: string, lastName: string}} props.userData - An object containing the user's data.
 * @returns {JSX.Element} The JSX for the UserMenu component.
 */

export default function UserMenu({ userData, isCollapsed, handleAlert }) {
  const firstName = userData?.firstName;
  const lastName = userData?.lastName;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {!isCollapsed ? (
          <button className="flex justify-center items-center w-full gap-2 cursor-pointer hover:text-gray-400 text-gray-300">
            <span>{firstName}</span>
            <span>{lastName}</span>
          </button>
        ) : (
          <div className="flex justify-center items-center">
            <User color="#e0e0e0" className="items-center" size={30} />
          </div>
        )}
      </SheetTrigger>

      <SheetContent className="bg-zinc-800 text-gray-300 px-4">
        <SheetHeader>
          <SheetTitle>{`Resumé du profil de ${firstName}`} </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <Label
              htmlFor="firstName"
              className="text-right col-span-1 sm:col-span-1"
            >
              Prénom :
            </Label>
            <Label className="col-span-1 sm:col-span-2">{firstName}</Label>
            <div className="hidden sm:block sm:col-span-3" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <Label
              htmlFor="lastName"
              className="text-right col-span-1 sm:col-span-1"
            >
              Nom :
            </Label>
            <Label className="col-span-1 sm:col-span-2">{lastName}</Label>
            <div className="hidden sm:block sm:col-span-3" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="logout" className="text-right col-span-1 sm:col-span-1">
              Sortir :
            </Label>
            <Label htmlFor="logout" className="text-right">
              <button
                onClick={() => handleAlert(true)}
                className="cursor-pointer"
              >
                <SquarePower color="#c80404" size={25} />
              </button>
            </Label>
            <Label id="logout" value={lastName} className="col-span-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
