const fakeEnv : Record<string, string | undefined> = {S3_BUCKET_URL: process.env.S3_BUCKET_URL,}
// next.js just does a full-text string replacement for process.env.<all variables defined on next.config>

const check_env = (string: string) : string => {
  if (fakeEnv[string] === undefined) {
    console.error(`${string} not defined!`)
  }
  return string
} 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const boolean_env = (string: string) => {
  return check_env(string) && fakeEnv[string] === "true"
}

const string_env : (string: string | undefined) => string = (string) => {
  return (string && check_env(string) && fakeEnv[string]) as string
}

export const S3_BUCKET_URL = string_env("S3_BUCKET_URL")
