const config = {
  // Run type-check on changes to TypeScript files
  "**/*.{ts,tsx}": () => "npm run type-check",
  // Run ESLint on all Typescript/Javascript files
  "*.{js,jsx,ts,tsx}": "eslint --fix",
  // Run Prettier on all files
  "*.{js,jsx,ts,tsx,md,html,css}": "prettier --write",
  // If you want to check that your tests work on every commit, then uncomment
  // two lines below. They are left commented because tests generally take longer
  // than we want a pre-commit hook to take
  //"**/__tests__/**/*": (filenames) => `vitest ${filenames.join(" ")}`,
  //"**/*{spec,test}.(t,j)s?(x)": (filenames) => `vitest ${filenames.join(" ")}`,
};

export default config;
