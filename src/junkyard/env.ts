const stringEnv : (varName: string, def?: string) => string = (varName, def = undefined) => {
  if (process.env[varName]) {
    return process.env[varName]
  } else {
    if (!def) {
      throw `${varName} not defined!`
    }
    return def
  }
}

export const S3_BUCKET_URL = stringEnv("S3_BUCKET_URL")
