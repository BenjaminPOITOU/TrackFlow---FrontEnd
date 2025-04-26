export function DescriptionVersion({versionDescription}) {
  return (
    <div className="flex flex-col items-start justify-center rounded border border-gray-300 w-full text-gray-300 bg-neutral-800 gap-2 p-2">
      <span>DESCRIPTION</span>
      <p>
        {" "}
        {versionDescription}
      </p>
    </div>
  );
}
