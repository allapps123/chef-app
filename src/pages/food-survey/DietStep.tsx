
const dietaryOptions = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Lactose-free",
  "Other",
];

interface DietStepProps {
  data: any;
  updateData: (d: Partial<any>) => void;
  handleNextStep: (next: () => void) => void;
  nextStep?: () => void;
}

export function DietStep({
  data,
  updateData,
  nextStep,
  handleNextStep,
}: DietStepProps) {
  const handleOptionClick = (option: string) => {
    const current = data.dietType || [];

    if (option === "Other") {
      const hasOther = current.includes("Other");
      updateData({
        dietType: hasOther
          ? current.filter((d: string) => d !== "Other")
          : [...current, "Other"],
        otherDiet: hasOther ? "" : data.otherDiet || "",
      });
      return;
    }

    const updated = current.includes(option)
      ? current.filter((d: string) => d !== option)
      : [...current.filter((d: string) => d !== "Other"), option];

    updateData({ dietType: updated });
  };

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 text-xl text-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        What is your dietary preference?
      </h2>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {dietaryOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`px-3 py-1 rounded-md ${
              data.dietType?.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } hover:bg-blue-600 cursor-pointer`}
          >
            {option}
          </button>
        ))}
      </div>

      {data.dietType?.includes("Other") && (
        <input
          type="text"
          value={data.otherDiet || ""}
          onChange={(e) => updateData({ otherDiet: e.target.value })}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          placeholder="Please specify"
        />
      )}

      <div className="mt-5">
        <button
          onClick={() => {
            if (nextStep) handleNextStep(nextStep);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
