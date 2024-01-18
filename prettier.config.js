/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  arrowParens: "avoid",
  importOrder: ["^.+\\.s?css$", "<THIRD_PARTY_MODULES>", "^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "prettier-plugin-packagejson",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["clsx", "cn", "cva"],
};

export default config;
