import React, { useState } from "react";
import StepWizard from "react-step-wizard";
import { DietStep } from "./DietStep";
import { AllergyStep } from "./AllergyStep";
import { DislikeStep } from "./DislikeStep";
import { GoalStep } from "./GoalStep";
import { CuisineStep } from "./CuisineStep";
import axios from "axios";
import { auth } from "../../lib/firebase";

interface SurveyData {
  dietType: string[];
  allergies: string[];
  dislikedIngredients: string;
  goal: string[];
  preferredCuisines: string[];
  otherDiet?: string;
  otherAllergy?: string;
  otherGoal?: string;
  otherCuisine?: string;
}

const initialData: SurveyData = {
  dietType: [],
  allergies: [],
  dislikedIngredients: "",
  goal: [],
  preferredCuisines: [],
};

export default function PersonalizationSurvey({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [data, setData] = useState<SurveyData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const updateData = (updated: Partial<SurveyData>) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  const onStepChange = (stats: any) => {
    setCurrentStep(stats.activeStep);
    setError(null);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          data.dietType.length > 0 ||
          (data.otherDiet && data.otherDiet.length > 0)
        );
      case 2:
        return (
          data.allergies.length > 0 ||
          (data.otherAllergy && data.otherAllergy.length > 0)
        );
      case 3:
        return data.dislikedIngredients.length > 0;
      case 4:
        return (
          data.goal.length > 0 || (data.otherGoal && data.otherGoal.length > 0)
        );
      case 5:
        return (
          data.preferredCuisines.length > 0 ||
          (data.otherCuisine && data.otherCuisine.length > 0)
        );
      default:
        return true;
    }
  };

  const handleNextStep = (nextStep: () => void) => {
    if (validateStep()) {
      nextStep();
    } else {
      setError("Please complete this step before proceeding.");
    }
  };

  const handleFinalSubmit = async () => {
    if (validateStep()) {
      onSubmit({ ...data, status: "active" });
    } else {
      setError("Please complete this step before submitting.");
    }

    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setError("Authentication failed. Please log in again.");
          return;
        }
  
        const response = await axios.post(
          "/.netlify/functions/server/user-preference",
          {
            ...data,
            status: "active",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("✅ Preferences saved:", response.data);
        onSubmit(response.data);
      } catch (err) {
        console.error("❌ Failed to save preferences:", err);
        setError("An error occurred while saving preferences.");
      }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 h-screen flex flex-col items-center justify-center px-4">
      <div className="flex justify-center mb-5 animate-pulse">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full mx-2 transition-colors duration-300 ${
              step === currentStep ? "bg-blue-500" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <StepWizard
        onStepChange={onStepChange}
        isHashEnabled={false}
        nav={<div />}
      >
        <DietStep
          data={data}
          updateData={updateData}
          handleNextStep={handleNextStep}
        />
        <AllergyStep
          data={data}
          updateData={updateData}
          handleNextStep={handleNextStep}
        />
        <DislikeStep
          data={data}
          updateData={updateData}
          handleNextStep={handleNextStep}
        />
        <GoalStep
          data={data}
          updateData={updateData}
          handleNextStep={handleNextStep}
        />
        <CuisineStep
          data={data}
          updateData={updateData}
          handleFinalSubmit={handleFinalSubmit}
        />
      </StepWizard>
    </div>
  );
}
