module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  rules: {
    "max-nesting-depth": 3,
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "no-descending-specificity": null,
  },
};