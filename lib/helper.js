export const handleChange = (event, setFormData) => {
  const { name, value } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}

export const normalizeEmail = (input = "") => {
  return input
    .toString()
    .normalize("NFKC")
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, "") 
    .toLowerCase();
}