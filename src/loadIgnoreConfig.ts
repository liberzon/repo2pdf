import * as fs from "fs";
import * as path from "path";

export interface IgnoreConfig {
  ignoredFiles: string[];
  ignoredExtensions: string[];
}

async function tryLoadConfig(configPath: string): Promise<IgnoreConfig | null> {
  try {
    const data = await fs.promises.readFile(configPath, "utf8");
    const config = JSON.parse(data) as IgnoreConfig;
    console.log("IgnoreConfig loaded from:", configPath);
    return config;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export default async function loadIgnoreConfig(
  rootDir: string,
  packageDir?: string,
): Promise<IgnoreConfig | null> {
  // 1. Check in the current working directory
  const cwdIgnoreConfigPath = path.join(process.cwd(), "repo2pdf.ignore");
  console.log(
    "Looking for repo2pdf.ignore in current directory:",
    process.cwd(),
  );
  let config = await tryLoadConfig(cwdIgnoreConfigPath);
  if (config) return config;

  // 2. Check in the target directory
  const targetIgnoreConfigPath = path.join(rootDir, "repo2pdf.ignore");
  console.log(
    "Not found in current directory. Looking in target directory:",
    rootDir,
  );
  config = await tryLoadConfig(targetIgnoreConfigPath);
  if (config) return config;

  // 3. Check in the package installation directory
  if (packageDir) {
    const packageIgnoreConfigPath = path.join(packageDir, "repo2pdf.ignore");
    console.log(
      "Not found in target directory. Looking in package directory:",
      packageDir,
    );
    config = await tryLoadConfig(packageIgnoreConfigPath);
    if (config) return config;
  }

  console.log("No repo2pdf.ignore file found in any location.");
  return null;
}
