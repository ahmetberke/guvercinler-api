export function slugify(text: string = ""): string {
  const map: { [key: string]: string } = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "C",
    Ğ: "G",
    İ: "I",
    Ö: "O",
    Ş: "S",
    Ü: "U",
  };

  for (let key in map) {
    text = text.replace(new RegExp(key, "g"), map[key]);
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces and non-alphanumeric characters with '-'
    .replace(/-+$/g, ""); // Remove trailing '-'
}
