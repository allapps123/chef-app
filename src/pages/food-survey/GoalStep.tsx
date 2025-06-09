
const goalOptions = [
  "Lose weight",
  "Build muscle",
  "Eat healthier",
  "Manage a medical condition (e.g. diabetes)",
  "Save money",
  "Learn to cook",
  "Try new cuisines",
  "Other",
];

interface GoalStepProps {
  data: any;
  updateData: (updated: Partial<any>) => void;
  handleNextStep: (next: () => void) => void;
  nextStep?: () => void;
  previousStep?: () => void;
}

export function GoalStep({
  data,
  updateData,
  nextStep,
  previousStep,
  handleNextStep,
}: GoalStepProps) {
  const handleOptionClick = (option: string) => {
    const currentGoals = Array.isArray(data.goal)
      ? data.goal.filter((g: string) => g !== "Other")
      : [];

    const updatedGoals = currentGoals.includes(option)
      ? currentGoals.filter((g: string) => g !== option)
      : [...currentGoals, option];

    if (option === "Other") {
      updateData({ goal: [...currentGoals, "Other"] });
    } else {
      updateData({ goal: updatedGoals });
    }
  };

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 text-xl text-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        What are your current health or lifestyle goals?
      </h2>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {goalOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`px-3 py-1 rounded-md ${
              data.goal?.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } hover:bg-blue-600 cursor-pointer`}
          >
            {option}
          </button>
        ))}
      </div>

      {data.goal?.includes("Other") && (
        <input
          type="text"
          value={data.otherGoal || ""}
          onChange={(e) => updateData({ otherGoal: e.target.value })}
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
