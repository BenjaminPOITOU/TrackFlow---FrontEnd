'use client'
import React from 'react';


export const BranchSelector = ({ branches, selectedBranchId, onBranchChange, isLoading, compositionId }) => {




  return (
    <div>
      <label htmlFor="branch-select" className="block text-xl font-medium text-gray-300 mb-1">
        Branche de destination
      </label>
      <select
        id="branch-select"
        className="block w-full p-2 border border-zinc-700 rounded-md shadow-sm cursor-pointer"
        value={selectedBranchId ?? ''}
        onChange={(e) => onBranchChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="" disabled>
          {isLoading ? 'Chargement des branches...' : 'Sélectionnez une branche'}
        </option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
};

