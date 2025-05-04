import { ClipboardPlus } from "lucide-react";
import { TimeAndCategory } from "./TimeAndCategory";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";

export function AddAnnotationBlock({
  onAnnotationSubmit,
  isSubmitting,
  currentTime,
}) {
  const [isTextAreaDisable, setIsTextAreaDisable] = useState(true);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [showSynchBtn, setShowSynchBtn] = useState(true);
  const [isAnnotationBtnClicked, setIsAnnotationBtnClicked] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    category: "Mixage",
    status: "À traiter",
    timePosition: "",
  });

  const isFormValid = () => {
    return formData.content && formData.content.trim() !== "";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let dataToSend={};

    if (!isFormValid()) {
      console.log("Veuillez ajouter du contenu à votre annotation.");
      return;
    }

    if (!showSubmitBtn) {
      dataToSend = { ...formData, timePosition: null };
      setIsTextAreaDisable(false);
      setShowSubmitBtn(true);
    } else {
      dataToSend = { ...formData };
      setIsTextAreaDisable(true);
      setShowSubmitBtn(false);
    }

    const success = await onAnnotationSubmit(dataToSend);

    if (success) {
      setFormData({
        content: "",
        category: "Mixage",
        status: "À traiter",
        timePosition: "",
      });

      setIsAnnotationBtnClicked(false);
    }
  }
  function handleTimePositionInput() {
    if (!isAnnotationBtnClicked) {
      setFormData((prev) => ({ ...prev, timePosition: currentTime }));
      setIsAnnotationBtnClicked(true);
    }
    setShowSubmitBtn(true);
    setIsTextAreaDisable(false);
  }

  function handleTextareaCancel() {
    setFormData((prev) => ({ ...prev, content: "" }));
    setIsTextAreaDisable(true);
    setShowSubmitBtn(false);
  }

  const toggleSynchBtn = () => {
    const newSynchState = !showSynchBtn;
    setShowSynchBtn(newSynchState);
    setFormData((prev) => ({
      ...prev,
      content: "",
      timePosition: newSynchState ? currentTime : "",
    }));

    if (newSynchState) {
      setIsTextAreaDisable(true);
      setShowSubmitBtn(false);
    } else {
      setIsTextAreaDisable(false);
      setShowSubmitBtn(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col justify-start gap-2 border border-gray-300 p-2 rounded "
    >
      <div className="relative flex justify-between px-2 items-center">
        <div className="flex justify-start items-center pb-2 gap-2">
          <ClipboardPlus size={20} color="#e0e0e0" />
          <span className="text-md  flex-grow"> AJOUTER UNE ANNOTATION</span>
        </div>
      </div>

      <div className="w-75 border border-gray-300"></div>

      <TimeAndCategory
        type="button"
        btnSynchStatus={showSynchBtn}
        onBtnSynchStatus={toggleSynchBtn}
        value={formData}
        onChange={setFormData}
        currentTime={currentTime}
        isAnnotationBtnClicked={isAnnotationBtnClicked}
      />

      <div className="flex flex-col gap-1 justify-start items-start w-full max-w-full">
        <span className="text-lg">Descritpion</span>

        <Textarea
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Ajouter votre annotation..."
          className=" w-full min-h-28 max-h-42 border border-gray-300 overflow-y-auto bg-neutral-700 whitespace-pre-wrap break-all resize-none box-border"
          disabled={isTextAreaDisable}
        />
      </div>

      <div className="flex justify-end items-center gap-2">
        {showSynchBtn && showSubmitBtn && (
          <button
            type="button"
            onClick={handleTextareaCancel}
            className="border border-gray-300 px-3 py-2 bg-neutral-800 text-gray-300 rounded cursor-pointer hover:bg-neutral-700"
          >
            {" "}
            Annuler{" "}
          </button>
        )}

        {!showSubmitBtn && showSynchBtn && (
          <button
            type="button"
            onClick={handleTimePositionInput}
            className="border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400"
          >
            {" "}
            Annoter{" "}
          </button>
        )}

        {(showSubmitBtn || !showSynchBtn) && (
          <button
            type="submit"
            className="transition-all ease-out border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400"
            disabled={isSubmitting}
          >
            {" "}
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        )}
      </div>
    </form>
  );
}
