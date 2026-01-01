# repo2pdf-cli

[![npm version](https://img.shields.io/npm/v/repo2pdf-cli.svg)](https://www.npmjs.com/package/repo2pdf-cli)
![GitHub issues](https://img.shields.io/github/issues/liberzon/repo2pdf)
![CI](https://github.com/liberzon/repo2pdf/actions/workflows/ci.yml/badge.svg)

> Forked from [BankkRoll/repo2pdf](https://github.com/BankkRoll/repo2pdf)

This fork replaces the interactive question-and-answer CLI with a non-interactive,
flag-based interface. The goal is to support automation, CI/CD pipelines, and
scripting scenarios where interactive prompts are impractical or impossible.

The upstream project remains excellent for exploratory use and users who prefer
guided setup. This fork prioritizes deterministic, reproducible execution with
explicit command-line arguments.

---

## Who This Fork Is For

**Use this fork if you need:**

- CI/CD pipelines generating documentation artifacts
- Scripts that batch-convert multiple repositories
- Automation workflows requiring deterministic, reproducible output
- Explicit flags over interactive prompts

**Use [upstream](https://github.com/BankkRoll/repo2pdf) if you prefer:**

- Guided, step-by-step configuration
- Interactive terminal workflows
- Exploring available options through prompts

---

## Quick Comparison

### Upstream (interactive prompts)

```
$ npx repo2pdf-cli
? Do you want to use a local repository? Yes
? Please provide the full path to the local repository: /path/to/repo
? Select the features you want to include: Add line numbers, Add highlighting
? Please provide an output file name: output.pdf
```

### This fork (flag-based)

```shell
npx repo2pdf-cli /path/to/repo --line-numbers -o output.pdf
```

Single command. No prompts. Scriptable.

---

## Table of Contents

- [Installation and Usage](#installation-and-usage)
  - [Installing and Using repo2pdf-cli with NPX](#installing-and-using-repo2pdf-cli-with-npx)
  - [Installing and Using repo2pdf-cli by Cloning the Repository](#installing-and-using-repo2pdf-cli-by-cloning-the-repository)
- [Configuration](#configuration)
- [Troubleshooting / FAQ](#troubleshooting--faq)
- [Contributing](#contributing-to-repo2pdf-cli)
- [License](#license)

---

## Installation and Usage

repo2pdf-cli can be installed by either [directly using NPX](#installing-and-using-repo2pdf-cli-with-npx) or [cloning the repository from GitHub](#installing-and-using-repo2pdf-cli-by-cloning-the-repository).

---

### Installing and Using repo2pdf-cli with NPX

This method downloads and installs the latest version of repo2pdf-cli from the NPM registry.

#### Basic Usage (with defaults)

The simplest way to use repo2pdf-cli is to provide just the path to your local repository. By default, it will:

- Enable syntax highlighting
- Remove comments
- Remove empty lines
- Generate a PDF with the same name as the repository

```shell
npx repo2pdf-cli /path/to/your/repository
```

For example:

```shell
npx repo2pdf-cli /path/to/my-project
```

This will create `my-project.pdf` in your current directory.

#### Customizing with Flags

You can customize the behavior using command-line flags:

```shell
npx repo2pdf-cli [options] <path>
```

**Available Options:**

- `-o, --output <filename>` - Specify custom output filename
- `--no-highlighting` - Disable syntax highlighting
- `--keep-comments` - Keep comments in the code
- `--keep-empty-lines` - Keep empty lines in the code
- `--line-numbers` - Add line numbers to the PDF
- `--page-numbers` - Add page numbers to the PDF
- `--one-pdf-per-file` - Generate one PDF per file
- `--output-folder <folder>` - Output folder for one-pdf-per-file mode

**Examples:**

```shell
# Custom output filename
npx repo2pdf-cli /path/to/repo -o my-project.pdf

# Add line numbers and page numbers
npx repo2pdf-cli /path/to/repo --line-numbers --page-numbers

# Keep comments and empty lines
npx repo2pdf-cli /path/to/repo --keep-comments --keep-empty-lines

# Disable highlighting and add line numbers
npx repo2pdf-cli /path/to/repo --no-highlighting --line-numbers

# Generate one PDF per file
npx repo2pdf-cli /path/to/repo --one-pdf-per-file --output-folder ./pdfs
```

---

### Installing and Using repo2pdf-cli by Cloning the Repository

This method involves manually cloning the repo2pdf-cli repository and setting it up on your local machine.

1. Clone the repository:

```shell
git clone https://github.com/liberzon/repo2pdf
```

2. Navigate to the repo2pdf directory:

```shell
cd repo2pdf
```

3. Install the dependencies:

```shell
npm install
```

4. Build the script:

```shell
npm run build
```

5. Run the CLI:

```shell
# Using the cli alias with arguments
npm run cli -- /path/to/your/repository

# With options
npm run cli -- /path/to/repo --line-numbers -o output.pdf

# Or use npm start (legacy method)
npm start
```

**Examples:**

```shell
# Basic usage
npm run cli -- /path/to/my-project

# With custom output and options
npm run cli -- /path/to/repo -o custom.pdf --line-numbers --page-numbers

# Show help
npm run cli -- --help
```

Please note that you need to have Node >= 18 installed on your system in order to run repo2pdf-cli.

---

## Configuration

repo2pdf-cli automatically ignores certain file types and directories (e.g., `.png`, `.git`).
To customize the files and directories to ignore, you can add a `repo2pdf.ignore` file.

### Ignore File Lookup Priority

The tool searches for `repo2pdf.ignore` in the following order:

1. **Current working directory** (where you run the command) - Use this for project-specific ignore rules
2. **Target repository directory** (the directory being converted) - Falls back to this if not found in current directory

This allows you to maintain a common ignore configuration in your working directory that applies to all repositories you convert, or use repository-specific ignore files.

**Example:**

```shell
# If you're in /Users/you/projects and run:
npx repo2pdf-cli /path/to/repo

# It will look for:
# 1. /Users/you/projects/repo2pdf.ignore (current directory - preferred)
# 2. /path/to/repo/repo2pdf.ignore (target directory - fallback)
```

### Example of file structure

```json
{
  "ignoredFiles": ["tsconfig.json", "dist", "node_modules"],
  "ignoredExtensions": [".raw"]
}
```

---

## Troubleshooting / FAQ

<details>
  <summary>Q: Why is this a fork instead of a contribution to upstream?</summary>

The upstream project is designed around an interactive, prompt-based UX. Replacing that with a flag-based CLI is a fundamental change to the user experience, not a bug fix or incremental feature. Rather than proposing a breaking change that might not align with upstream's goals, this fork rebuilds the CLI layer while keeping the core PDF generation logic intact.

If upstream maintainers are interested in adopting this approach or merging portions of it, that conversation is welcome.

</details>

<details>
  <summary>Q: I'm getting an error "Failed to install [package-name]". What should I do?</summary>
  A: Make sure you have Node.js and npm installed on your system. Try running the following command to install the required package manually:

```shell
npm install [package-name]
```

</details>

<details>
  <summary>Q: How can I customize the styling of the generated PDF?</summary>
  A: You can modify the code in `clone.ts` or `syntax.ts` to change the font, font size, colors, and other styling options for the PDF document.

```typescript
// Example: Changing font size in syntax.ts
doc.fontSize(12);
```

</details>

<details>
  <summary>Q: What types of files are supported for conversion to PDF?</summary>
  A: Currently, repo2pdf-cli supports all text-based files for conversion to PDF. Binary files like images or compiled binaries are ignored.
</details>

<details>
  <summary>Q: How can I modify the ignored files list?</summary>
  A: You can add a `repo2pdf.ignore` file in either your current working directory (preferred) or in the target repository directory. The tool checks the current directory first, then falls back to the target directory. Here's an example of how to structure this file:

```json
{
  "ignoredFiles": ["tsconfig.json"],
  "ignoredExtensions": [".md"]
}
```

</details>

<details>
  <summary>Q: How can I include line numbers in the generated PDF?</summary>
  A: Use the `--line-numbers` flag when running the command:

```shell
npx repo2pdf-cli /path/to/repo --line-numbers
```

</details>

<details>
  <summary>Q: How can I generate a PDF for a local repository?</summary>
  A: Simply provide the path to your local repository as the first argument:

```shell
npx repo2pdf-cli /path/to/your/local/repo
```

</details>

<details>
  <summary>Q: Can I keep comments in the code?</summary>
  A: Yes! By default, comments are removed. To keep them, use the `--keep-comments` flag:

```shell
npx repo2pdf-cli /path/to/repo --keep-comments
```

</details>

---

## Contributing to repo2pdf-cli

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Open an issue on GitHub detailing the bug.
2. Describe the problem in depth. Share the steps to reproduce the issue and any error messages you received.
3. If possible, provide information about your operating system and Node.js version.

### Suggesting Enhancements

1. Open an issue on GitHub to share your suggestions.
2. Be as detailed as possible, explaining what you want to achieve and why it would be beneficial to the project.

### Writing Code

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes in your branch.
4. Submit a pull request from your branch to the main repo2pdf-cli repository.

In your pull request, please provide a clear description of the changes you've made.

---

## License

repo2pdf-cli is open source software, licensed under the MIT License. See the `LICENSE` file for more information.
