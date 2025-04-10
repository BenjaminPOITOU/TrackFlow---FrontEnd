import { Funnel, ArrowDownNarrowWide, LayoutGrid, List } from "lucide-react";

export function ProjectListHeader() {
  return (
    <div className="flex justify-between rounded items-center w-full h-20 border border-gray-300 px-4">
      <div className="flex justify-center items-center gap-2">
        <button className="border rounded flex justify-center items-center w-full gap-4 p-2 border-gray-300 hover:bg-zinc-500 cursor-pointer">
          <span> Filter </span> <Funnel color="#e0e0e0" />
        </button>
        <button className="border rounded flex justify-center items-center w-full gap-4 p-2 border-gray-300 hover:bg-zinc-500 cursor-pointer">
          <span> Sort </span><ArrowDownNarrowWide color="#e0e0e0" />
        </button>
      </div>
      <div className="flex justify-center items-center w-56">
        <div className="w-full text-center"> VIEW_MODE: </div>
        <div className="flex justify-center items-center w-full gap-2 p-2">
          <button className="border rounded border-gray-300 p-1 hover:bg-zinc-500 cursor-pointer">
            <LayoutGrid color="#e0e0e0" />
          </button>
          <button className="border rounded border-gray-300 p-1 hover:bg-zinc-500 cursor-pointer">
            <List color="#e0e0e0" />
          </button>
        </div>
      </div>
    </div>
  );
}
