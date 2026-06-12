// UI helper used by document preview inputs.
export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

export const fileToBase64 = async (file) => {
  const dataUrl = await fileToDataUrl(file);
  return dataUrl.split(",")[1] || "";
};

// Static UI-only assistant response.
export const openAiChat = async () =>
  "This is a UI-only assistant preview. Live support answers are not connected in this version.";
