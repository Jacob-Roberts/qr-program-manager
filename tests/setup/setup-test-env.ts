import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
loadEnvConfig(projectDir)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "#/env.js";

// we need these to be imported first 👆
