import type { Meta } from "@sly-cli/sly";

/**
 * @type {import('@sly-cli/sly/dist').Transformer}
 */
export default function transformIcon(input: string, meta: Meta) {
  return prependLicenseInfo(input, meta);
}

function prependLicenseInfo(input: string, meta: Meta): string {
  return [
    `<!-- Downloaded from ${meta.name} -->`,
    `<!-- License ${meta.license} -->`,
    `<!-- ${meta.source} -->`,
    input,
  ].join("\n");
}
