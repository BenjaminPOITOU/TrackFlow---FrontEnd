import React from 'react';
import { AnnotationItem } from './AnnotationItem';

export const AnnotationsList = ({ annotations, onToggle, isLoading }) => {
  if (isLoading) {
    return <div className="text-center text-gray-500 py-4">Chargement des annotations...</div>;
  }
  
  if (annotations.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucune annotation sur la version précédente.</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-medium mb-2 text-gray-300">Annotations actuelles</h3>
      <ul className="max-h-48 overflow-y-auto pr-2">
        {annotations.map(annotation => (
          <AnnotationItem
            key={annotation.id}
            annotation={annotation}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
};

