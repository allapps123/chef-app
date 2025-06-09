
interface DislikeStepProps {
  data: any;
  updateData: (updated: Partial<any>) => void;
  handleNextStep: (next: () => void) => void;
  nextStep?: () => void;
  previousStep?: () => void;
}

export function DislikeStep({
  data,
  updateData,
  nextStep,
  previousStep,
  handleNextStep,
}: DislikeStepProps) {
  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 text-xl text-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        Ingredients you dislike or want to avoid?
      </h2>
      <input
        type="text"
        value={data.dislikedIngredients}
        onChange={(e) => updateData({ dislikedIngredients: e.target.value })}
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
        placeholder="e.g. Cilantro, Garlic"
      />

      <div className="mt-5">
        {previousStep && (
          <button
            onClick={previousStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>
        )}
        {nextStep && (
          <button
            onClick={() => handleNextStep(nextStep)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
