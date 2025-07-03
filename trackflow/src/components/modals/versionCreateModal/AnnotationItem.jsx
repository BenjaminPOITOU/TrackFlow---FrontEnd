import React from 'react';
import { X } from 'lucide-react';

export const AnnotationItem = ({ annotation, onToggle }) => {
  return (

    <li className="flex items-center justify-between py-2 border-b border-zinc-700">
      
   
      <span className={`text-sm ${annotation.resolved ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
        {annotation.content}
      </span>

    
      <div className="flex items-center space-x-4">
        <label htmlFor={`resolved-${annotation.id}`} className="flex items-center cursor-pointer">
          <input
            id={`resolved-${annotation.id}`}
            type="checkbox"
            checked={annotation.resolved}
            onChange={() => onToggle(annotation.id)}
            className="h-4 w-4 bg-zinc-800 border-gray-400 rounded text-indigo-500 focus:ring-indigo-600"
          />
          <span className="ml-2 text-xs text-gray-400">
            Résolue
          </span>
        </label>
      </div>
    </li>
  );
};