import fetcher from "./api-helpers";

/**
 * Uploads an audio file and its associated compositionId.
 * Corresponds to: POST /api/uploads/audio
 *
 * @param {File} file - The audio file to upload.
 * @param {number} compositionId - The ID of the composition context.
 * @returns {Promise<object>} A promise that resolves to the upload response (AudioUploadResponseDto).
 */
export async function uploadAudio(file, compositionId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("compositionId", String(compositionId));
  const endpoint = `/api/uploads/audio`;
  try {
    return await fetcher(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Failed to upload audio file:", error);
    throw new Error("Could not upload the audio file.");
  }
}