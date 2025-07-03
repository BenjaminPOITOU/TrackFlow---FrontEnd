"use client";

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

/**
 * Manages the selection and display of musical instruments for a version.
 * This is a "presentational" component. It receives all necessary data via props
 * and does not fetch data itself. Its only job is to render the UI and
 * call the functions provided by its parent.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.allInstruments - The complete list of available instruments, each with a 'label' and 'value'.
 * @param {boolean} props.isLoading - Indicates if the instrument list is being loaded by the parent.
 * @param {Array<string>} [props.currentInstruments] - An array of the currently selected instrument values (e.g., ['GUITARE', 'PIANO']).
 * @param {Function} props.onAddInstrument - Callback function executed when an instrument is added. Receives the instrument value (string).
 * @param {Function} props.onRemoveInstrument - Callback function executed when an instrument is removed. Receives the instrument value (string).
 * @returns {JSX.Element} The rendered instruments manager component.
 */
export const InstrumentsManager = ({ allInstruments, isLoading, currentInstruments, onAddInstrument, onRemoveInstrument }) => {
  const [instrumentToAdd, setInstrumentToAdd] = useState('');



  const handleAddClick = () => {
    if (!instrumentToAdd) return;
    onAddInstrument(instrumentToAdd);
    setInstrumentToAdd(''); 
  };


  const availableInstruments = allInstruments.filter(
    (inst) => !(currentInstruments || []).includes(inst.value)
  );
  
  /**
   * Finds the display label for a given instrument value and converts it to uppercase.
   * @param {string} instrumentValue - The value of the instrument (e.g., 'GUITARE').
   * @returns {string} The corresponding display label in uppercase (e.g., 'GUITARE') or the value itself if not found.
   */
  const getInstrumentLabel = (instrumentValue) => {
    const instrument = allInstruments.find(inst => inst.value === instrumentValue);
    return (instrument ? instrument.label : instrumentValue).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Chargement des instruments...</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-300 mb-2">Instruments</h3>
      
      {currentInstruments?.length > 0 ? (
        <ul className="mb-2 space-y-1">
          {currentInstruments.map((instrumentValue) => (
            <li key={instrumentValue} className="flex items-center justify-between bg-zinc-700 p-2 rounded-md text-sm text-white">
              <span>{getInstrumentLabel(instrumentValue)}</span> 
              <button
                type="button"
                onClick={() => onRemoveInstrument(instrumentValue)}
                className="text-red-400 hover:text-red-500 font-bold cursor-pointer"
              >
                <X size={18}/>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-2">Aucun instrument ajouté.</p>
      )}

      <div className="flex space-x-2">
        <select
          value={instrumentToAdd}
          onChange={(e) => setInstrumentToAdd(e.target.value)}
          className="flex-grow p-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 cursor-pointer"
          disabled={availableInstruments.length === 0}
        >
          <option value="" disabled>
            {availableInstruments.length > 0
              ? "Choisir un instrument..."
              : "Tous les instruments ont été ajoutés"}
          </option>
          {availableInstruments.map((instrument) => (
            <option key={instrument.value} value={instrument.value}>
              {instrument.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!instrumentToAdd} 
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};