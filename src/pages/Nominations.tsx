import React from 'react';
import { NominationsTable } from '../components/nominations/NominationsTable';

export function Nominations() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nomination Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and manage employee award nominations with AI insights
        </p>
      </div>

      {/* Nominations Table */}
      <NominationsTable />
    </div>
  );
}