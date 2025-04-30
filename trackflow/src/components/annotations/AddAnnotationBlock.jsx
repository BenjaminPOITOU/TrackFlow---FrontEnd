import { ClipboardPlus, Plus } from "lucide-react";
import { TimeAndCategory } from "./TimeAndCategory";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

export function AddAnnotationBlock() {
  const [isTextAreaDisable, setIsTextAreaDisable] = useState(true);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [showSynchBtn, setShowSynchBtn] = useState(true);

  const [textValue, setTextValue] = useState("");

  function handleTextareaInput() {
    setShowSubmitBtn(true);

    if (showSynchBtn) {
      setIsTextAreaDisable(false);
    } else {
      setIsTextAreaDisable(true);
    }
  }

  function handleTextareaCancel() {
    setTextValue("");
    setIsTextAreaDisable(true);
    setShowSubmitBtn(false);
  }

  function handleSubmit() {
    setTextValue("");
    if (!showSynchBtn) {
      setIsTextAreaDisable(false);
      setShowSubmitBtn(true);
    }

    if (showSynchBtn) {
      setIsTextAreaDisable(true);
      setShowSubmitBtn(false);
    }
  }

  const toggleSynchBtn = () => {
    setShowSynchBtn(!showSynchBtn);
    setTextValue("");

    if (!showSynchBtn) {
      setIsTextAreaDisable(true);
      setShowSubmitBtn(false);
    }

    if (showSynchBtn) {
      setIsTextAreaDisable(false);
      setShowSubmitBtn(true);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start gap-2 border border-gray-300 p-2 rounded ">
      <div className="relative flex justify-between px-2 items-center">
        <div className="flex justify-start items-center pb-2 gap-2">
          <ClipboardPlus size={20} color="#e0e0e0" />
          <span className="text-md  flex-grow"> AJOUTER UNE ANNOTATION</span>
        </div>
      </div>

      <div className="w-75 border border-gray-300"></div>

      <TimeAndCategory
        btnSynchStatus={showSynchBtn}
        onBtnSynchStatus={toggleSynchBtn}
      />

      <div className="flex flex-col gap-1 justify-start items-start w-full max-w-full">
        <span className="text-lg">Descritpion</span>

        <Textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Ajouter votre annotation..."
          className=" w-full min-h-28 max-h-42 border border-gray-300 overflow-y-auto bg-neutral-700 whitespace-pre-wrap break-all resize-none box-border"
          disabled={isTextAreaDisable}
        />
      </div>

      <div className="flex justify-end items-center gap-2">
        {(showSynchBtn && showSubmitBtn) && (<button
          onClick={handleTextareaCancel}
          className="border border-gray-300 px-3 py-2 bg-neutral-800 text-gray-300 rounded cursor-pointer hover:bg-neutral-700"
        >
          {" "}
          Annuler{" "}
        </button>)}

        {(!showSubmitBtn && showSynchBtn) && (
          <button
            onClick={handleTextareaInput}
            className="border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400"
          >
            {" "}
            Annoter{" "}
          </button>
        )}

        {(showSubmitBtn || !showSynchBtn) && (
          <button
            onClick={handleSubmit}
            className="transition-all ease-out border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400"
          >
            {" "}
            Enregistrer{" "}
          </button>
        )}
      </div>
    </div>
  );
}
