export function CompositionCard({ composition, background }) {
  return (
    <div className="w-full">
    <div className={`p-4 rounded w-full ${background}`}>
      <h3 className="font-semibold text-lg text-gray-300">
        {composition.title || "Composition Sans Titre"}
      </h3>
      
    </div>
    </div>
  );
}
