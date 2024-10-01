const stringToUrl = (string) => {
  return String(string)
    .replace("'", "")
    .replace("~[^\\pL0-9_]+~u", "-")
    .trim("-")
    .toLowerCase()
    .replace("~[^\\pL0-9_]+~u", "-");
};

module.exports = {
  stringToUrl,
};
