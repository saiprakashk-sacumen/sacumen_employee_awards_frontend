import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useToast } from "../components/ui/Toast";
import { User } from "../types";
import { Users, Search, Plus } from "lucide-react";
import api, {
  getManagers,
  getProjects,
  assignManagerToProject,
} from "../utils/api";

export function OnboardingManager() {
  const { showToast } = useToast();
  const [mappings, setMappings] = useState<any[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  // Assignment form state
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Approve manager dropdown
  const [pendingManagerId, setPendingManagerId] = useState("");

  // Table state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
    fetchApprovedMappings();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [managersData, projectsData] = await Promise.all([
        getManagers(),
        getProjects(),
      ]);
      setManagers(managersData);
      setProjects(projectsData);

      const approvedManagers = managersData.filter((m: User) => m.is_approved);
      if (approvedManagers.length === 0) {
        showToast(
          "error",
          "No Approved Managers",
          "There are no approved managers to assign projects to."
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("error", "Error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedMappings = async () => {
    try {
      const response = await api.get("/managers/approved");
      setMappings(response.data);
    } catch (error) {
      console.error("Failed to fetch approved manager mappings:", error);
      showToast("error", "Error", "Failed to load manager-project mappings");
    }
  };

  const handleApproveManager = async () => {
    if (!pendingManagerId) {
      showToast(
        "warning",
        "Select Manager",
        "Please select a manager to approve"
      );
      return;
    }
    try {
      await api.patch(`/managers/${pendingManagerId}/approve`);
      showToast(
        "success",
        "Manager Approved",
        "The manager has been approved."
      );
      setPendingManagerId(""); // reset dropdown
      fetchData();
      fetchApprovedMappings();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve manager";
      showToast("error", "Approval Failed", errorMessage);
    }
  };

  const handleAssignment = async () => {
    if (!selectedManagerId || !selectedProjectId) {
      showToast(
        "warning",
        "Missing Information",
        "Please select both manager and project"
      );
      return;
    }

    setIsAssigning(true);
    try {
      // Assign manager to project
      await assignManagerToProject(
        selectedProjectId,
        Number(selectedManagerId)
      );

      showToast(
        "success",
        "Assignment Successful",
        `Manager has been assigned to ${selectedProjectId}`
      );

      // Reset form
      setSelectedManagerId("");
      setSelectedProjectId("");

      // Refetch both managers & mappings to update table immediately
      await fetchData();
      await fetchApprovedMappings(); // wait for new data before updating state
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to assign manager";
      showToast("error", "Assignment Failed", errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingManagers = managers.filter((m) => !m.is_approved);
  const approvedManagers = managers.filter((m) => m.is_approved);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Onboarding Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage manager-project assignments and team structures
        </p>
      </div>

      {/* Approve Managers Section */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Approve Managers
          </h2>
        </div>

        {pendingManagers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No managers pending approval
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label="Select Manager to Approve"
              value={pendingManagerId}
              onChange={(e) => setPendingManagerId(e.target.value)}
              options={[
                { value: "", label: "Choose a manager..." },
                ...pendingManagers.map((manager) => ({
                  value: (manager.id ?? "").toString(),
                  label: manager.name ?? manager.email ?? "",
                })),
              ]}
            />
            <Button onClick={handleApproveManager} className="mb-1">
              Approve
            </Button>
          </div>
        )}
      </Card>

      {/* Assign Section */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Plus className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assign Manager to Project
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Select
            label="Select Manager to Assign"
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
            options={[
              { value: "", label: "Choose a manager..." },
              ...approvedManagers.map((manager) => ({
                value: (manager.id ?? "").toString(),
                label: manager.name ?? manager.email ?? "",
              })),
            ]}
          />

          <Select
            label="Select Project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            options={[
              { value: "", label: "Choose a project..." },
              ...projects.map((project) => ({
                value: project,
                label: project,
              })),
            ]}
          />

          <Button
            onClick={handleAssignment}
            isLoading={isAssigning}
            disabled={!selectedManagerId || !selectedProjectId}
            className="mb-1"
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </Card>

      {/* Manager-Project Mappings Table */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manager-Project Mappings
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search mappings..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Employees
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mappings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No approved managers found
                  </td>
                </tr>
              ) : (
                mappings
                  .filter((m) =>
                    m.manager_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((manager) => (
                    <tr
                      key={manager.manager_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {manager.manager_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {manager.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {manager.projects || "No Project Assigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {manager.total_employees ?? 0}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
