const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return path
  }

  if (!BASE_PATH) {
    return path
  }

  if (path.startsWith(`${BASE_PATH}/`) || path === BASE_PATH) {
    return path
  }

  return `${BASE_PATH}${path}`
}
