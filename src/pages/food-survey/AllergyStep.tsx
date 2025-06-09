
const allergyOptions = [
  "Peanuts",
  "Tree nuts",
  "Dairy",
  "Eggs",
  "Shellfish",
  "Wheat",
  "Soy",
  "No allergies",
  "Other",
];

interface AllergyStepProps {
  data: any;
  updateData: (updated: Partial<any>) => void;
  handleNextStep: (next: () => void) => void;
  nextStep?: () => void;
  previousStep?: () => void;
}

export function AllergyStep({
  data,
  updateData,
  nextStep,
  previousStep,
  handleNextStep,
}: AllergyStepProps) {
  const handleOptionClick = (option: string) => {
    let current: string[] = data.allergies || [];

    if (option === "No allergies") {
      updateData({ allergies: ["No allergies"], otherAllergy: "" });
      return;
    }

    if (current.includes("No allergies")) {
      current = [];
    }

    if (option === "Other") {
      const hasOther = current.includes("Other");
      updateData({
        allergies: hasOther
          ? current.filter((a: string) => a !== "Other")
          : [...current, "Other"],
        otherAllergy: hasOther ? "" : data.otherAllergy || "",
      });
      return;
    }

    const updated = current.includes(option)
      ? current.filter((a: string) => a !== option)
      : [...current.filter((a: string) => a !== "Other"), option];

    updateData({ allergies: updated });
  };

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 text-xl text-center p-5">
      <h2 className="text-2xl font-semibold mb-4">
        Do you have any food allergies?
      </h2>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {allergyOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`px-3 py-1 rounded-md ${
              data.allergies?.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } hover:bg-blue-600 cursor-pointer`}
          >
            {option}
          </button>
        ))}
      </div>

      {data.allergies?.includes("Other") && (
        <input
          type="text"
          value={data.otherAllergy || ""}
          onChange={(e) => updateData({ otherAllergy: e.target.value })}
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
