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

export const generateAssistantReply = async () =>
  "This is a frontend-only assistant preview. Live support answers are not connected in this version.";
