import * as fs from "fs";
import * as path from "path";

export interface IgnoreConfig {
  ignoredFiles: string[];
  ignoredExtensions: string[];
}

export default async function loadIgnoreConfig(
  rootDir: string,
): Promise<IgnoreConfig | null> {
  // First, check in the current working directory
  const cwdIgnoreConfigPath = path.join(process.cwd(), "repo2pdf.ignore");
  console.log(
    "Looking for repo2pdf.ignore in current directory:",
    process.cwd(),
  );

  try {
    const data = await fs.promises.readFile(cwdIgnoreConfigPath, "utf8");
    const config = JSON.parse(data) as IgnoreConfig;
    console.log("IgnoreConfig loaded from current directory:", config);
    return config;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // If not found in current directory, check in the target directory
      const targetIgnoreConfigPath = path.join(rootDir, "repo2pdf.ignore");
      console.log(
        "Not found in current directory. Looking in target directory:",
        rootDir,
      );

      try {
        const data = await fs.promises.readFile(targetIgnoreConfigPath, "utf8");
        const config = JSON.parse(data) as IgnoreConfig;
        console.log("IgnoreConfig loaded from target directory:", config);
        return config;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          console.log("No repo2pdf.ignore file found in either location.");
          return null;
        }
        throw err;
      }
    }
    throw err;
  }
}
