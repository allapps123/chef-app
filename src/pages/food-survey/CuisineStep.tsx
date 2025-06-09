
const cuisines = [
  "Vietnamese",
  "Thai",
  "Japanese",
  "Italian",
  "Mexican",
  "Indian",
  "Mediterranean",
  "Other",
];

interface CuisineStepProps {
  data: any;
  updateData: (updated: Partial<any>) => void;
  previousStep?: () => void;
  handleFinalSubmit: () => void;
}

export function CuisineStep({
  data,
  updateData,
  previousStep,
  handleFinalSubmit,
}: CuisineStepProps) {
  const toggleCuisine = (cuisine: string) => {
    const current = Array.isArray(data.preferredCuisines)
      ? data.preferredCuisines.filter((c: string) => c !== "Other")
      : [];

    const updated = current.includes(cuisine)
      ? current.filter((c: string) => c !== cuisine)
      : [...current, cuisine];

    if (cuisine === "Other") {
      updateData({ preferredCuisines: [...current, "Other"] });
    } else {
      updateData({ preferredCuisines: updated });
    }
  };

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 text-xl text-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        Which cuisines do you enjoy or want to explore more?
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => toggleCuisine(cuisine)}
            className={`px-3 py-1 rounded-md ${
              data.preferredCuisines?.includes(cuisine)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } hover:bg-blue-600 cursor-pointer`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {data.preferredCuisines?.includes("Other") && (
        <input
          type="text"
          value={data.otherCuisine || ""}
          onChange={(e) => updateData({ otherCuisine: e.target.value })}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          placeholder="Please specify"
        />
      )}

      <div className="mt-5">
        {previousStep && (
          <button
            onClick={previousStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>
        )}
        <button
          onClick={handleFinalSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
