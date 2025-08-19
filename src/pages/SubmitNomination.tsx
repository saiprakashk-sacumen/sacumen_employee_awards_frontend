import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Checkbox } from "../components/ui/Checkbox";
import { Award, Star, Users, Heart, Shield, Target } from "lucide-react";
import { CoreValue } from "../types";
import {
  getProjects,
  getEmployeesByProject,
  submitNomination,
} from "../utils/api";

const coreValueOptions = [
  {
    value: "customer_delight" as CoreValue,
    label: "Customer Delight",
    icon: <Heart className="h-4 w-4" />,
    description: "Goes above and beyond to ensure customer satisfaction",
  },
  {
    value: "innovation" as CoreValue,
    label: "Innovation",
    icon: <Star className="h-4 w-4" />,
    description: "Brings creative solutions and new ideas to challenges",
  },
  {
    value: "team_work" as CoreValue,
    label: "Team Work",
    icon: <Users className="h-4 w-4" />,
    description: "Collaborates effectively and supports team members",
  },
  {
    value: "being_fair" as CoreValue,
    label: "Being Fair",
    icon: <Shield className="h-4 w-4" />,
    description: "Demonstrates integrity and treats everyone equitably",
  },
  {
    value: "ownership" as CoreValue,
    label: "Ownership",
    icon: <Target className="h-4 w-4" />,
    description: "Takes responsibility and drives results proactively",
  },
];

export function SubmitNomination() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCoreValue, setSelectedCoreValue] = useState<CoreValue | null>(
    null
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [projects, setProjects] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const selectedProject = watch("projectAligned");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectName: string) => {
    setValue("resourceName", "");

    try {
      setLoadingEmployees(true);
      const data = await getEmployeesByProject(projectName);
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedCoreValue) {
      alert("Please select one core value");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitNomination({
        nominee_id: data.resourceName, // employee id
        project_name: data.projectAligned,
        justification_text: data.verbiage,
        customer_email: data.supportingAcknowledgement,
        core_value: selectedCoreValue,
        rating: Number(data.overallRating),
        nomination_type: data.nominationType,
      });

      setSubmitSuccess(true);
      reset();
      setSelectedCoreValue(null);
      setEmployees([]);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit nomination:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: "Poor",
      2: "Below Average",
      3: "Average",
      4: "Good",
      5: "Excellent",
    };
    return labels[rating as keyof typeof labels] || "";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submit Nomination
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Nominate an outstanding team member for recognition
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                Nomination Submitted Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Your nomination has been submitted and will be reviewed by the
                awards committee.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Nomination Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Selection */}
              <Select
                label="Project *"
                {...register("projectAligned", {
                  required: "Project is required",
                })}
                value={watch("projectAligned") || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("projectAligned", value, { shouldValidate: true });
                  handleProjectChange(value);
                }}
                options={[
                  {
                    value: "",
                    label: loadingProjects ? "Loading..." : "Select project",
                  },
                  ...projects.map((p) => ({ value: p, label: p })),
                ]}
                error={
                  typeof errors.projectAligned?.message === "string"
                    ? errors.projectAligned.message
                    : undefined
                }
              />

              {/* Employee Selection */}
              <Select
                label="Resource Name *"
                {...register("resourceName", {
                  required: "Employee is required",
                })}
                options={[
                  {
                    value: "",
                    label: loadingEmployees
                      ? "Loading..."
                      : !selectedProject
                      ? "Select project first"
                      : "Select employee",
                  },
                  ...employees.map((emp) => ({
                    value: emp.id, // "EMP004"
                    label: emp.name ?? emp.email ?? emp.id,
                  })),
                ]}
                error={
                  typeof errors.resourceName?.message === "string"
                    ? errors.resourceName.message
                    : undefined
                }
                disabled={!selectedProject || loadingEmployees}
              />
            </div>
          </div>

          {/* Nomination Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Nomination Details
            </h2>
            <div className="space-y-6">
              <Textarea
                label="Verbiage for Nomination *"
                {...register("verbiage", {
                  required: "Nomination description is required",
                  minLength: {
                    value: 50,
                    message: "Please provide at least 50 characters",
                  },
                })}
                error={
                  typeof errors.verbiage?.message === "string"
                    ? errors.verbiage.message
                    : undefined
                }
                placeholder="Describe why this person deserves recognition..."
                rows={6}
              />

              <Textarea
                label="Supporting Acknowledgement (Adds Value) *"
                {...register("supportingAcknowledgement", {
                  required: "Supporting acknowledgement is required",
                })}
                error={
                  typeof errors.supportingAcknowledgement?.message === "string"
                    ? errors.supportingAcknowledgement.message
                    : undefined
                }
                placeholder="Provide additional context, client feedback..."
                rows={4}
              />
            </div>
          </div>

          {/* Core Values Alignment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Core Value Alignment *
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreValueOptions.map((option) => (
                <Card
                  key={option.value}
                  padding="sm"
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedCoreValue === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div
                    onClick={() => setSelectedCoreValue(option.value)}
                    className="flex items-start space-x-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCoreValue === option.value}
                      onChange={() => setSelectedCoreValue(option.value)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {option.icon}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {!selectedCoreValue && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Please select one core value
              </p>
            )}
          </div>

          {/* Overall Rating */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Overall Rating *
            </h2>
            <Select
              label="Overall Rating"
              {...register("overallRating", {
                required: "Overall rating is required",
                valueAsNumber: true,
              })}
              options={[
                { value: "", label: "Select rating" },
                { value: "5", label: "5 - Excellent" },
                { value: "4", label: "4 - Good" },
                { value: "3", label: "3 - Average" },
              ]}
              error={
                typeof errors.overallRating?.message === "string"
                  ? errors.overallRating.message
                  : undefined
              }
            />

            {watch("overallRating") && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Number(watch("overallRating"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getRatingLabel(Number(watch("overallRating")))}
                </span>
              </div>
            )}
          </div>
          <Select
            label="Nomination Type *"
            {...register("nominationType", {
              required: "Nomination type is required",
            })}
            options={[
              { value: "", label: "Select nomination type" },
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly" },
            ]}
            error={
              typeof errors.nominationType?.message === "string"
                ? errors.nominationType.message
                : undefined
            }
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !selectedCoreValue}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Nomination"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
