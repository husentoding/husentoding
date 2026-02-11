/** @type {import('next').NextConfig} */
const repository = process.env.GITHUB_REPOSITORY ?? ""
const repositoryName = repository.split("/")[1] ?? ""
const isUserOrOrgPagesRepo = repositoryName.endsWith(".github.io")
const repositoryBasePath = repositoryName && !isUserOrOrgPagesRepo ? `/${repositoryName}` : ""
const isProduction = process.env.NODE_ENV === "production"
const deploymentBasePath = repository ? `${repositoryBasePath}/fadila` : "/fadila"
const basePath = isProduction ? deploymentBasePath : ""

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
