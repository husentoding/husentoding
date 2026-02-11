/** @type {import('next').NextConfig} */
const repository = process.env.GITHUB_REPOSITORY ?? ""
const repositoryName = repository.split("/")[1] ?? ""
const isUserOrOrgPagesRepo = repositoryName.endsWith(".github.io")
const repositoryBasePath = repositoryName && !isUserOrOrgPagesRepo ? `/${repositoryName}` : ""
const basePath = `${repositoryBasePath}/fadila`

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
