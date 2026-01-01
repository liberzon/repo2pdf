# repo2pdf-cli Quick Reference

## Basic Usage

Convert a local repository to PDF with default settings:

```bash
npx repo2pdf-cli /path/to/repository
```

**Default Settings:**

- ✅ Syntax highlighting enabled
- ✅ Comments removed
- ✅ Empty lines removed
- 📄 Output filename = repository name + `.pdf`

## Examples

### Default behavior

```bash
npx repo2pdf-cli /path/to/my-project
# Creates: my-project.pdf
```

### Custom output filename

```bash
npx repo2pdf-cli /path/to/repo -o my-project.pdf
```

### Add line numbers

```bash
npx repo2pdf-cli /path/to/repo --line-numbers
```

### Add page numbers

```bash
npx repo2pdf-cli /path/to/repo --page-numbers
```

### Keep comments and empty lines

```bash
npx repo2pdf-cli /path/to/repo --keep-comments --keep-empty-lines
```

### Disable syntax highlighting

```bash
npx repo2pdf-cli /path/to/repo --no-highlighting
```

### Generate one PDF per file

```bash
npx repo2pdf-cli /path/to/repo --one-pdf-per-file --output-folder ./pdfs
```

### Combined options

```bash
npx repo2pdf-cli /path/to/repo \
  --line-numbers \
  --page-numbers \
  --keep-comments \
  -o detailed-report.pdf
```

## All Available Options

| Flag                       | Description                    | Default                  |
| -------------------------- | ------------------------------ | ------------------------ |
| `-o, --output <filename>`  | Custom output filename         | Repository name + `.pdf` |
| `--line-numbers`           | Add line numbers to code       | Disabled                 |
| `--page-numbers`           | Add page numbers to PDF        | Disabled                 |
| `--no-highlighting`        | Disable syntax highlighting    | Enabled                  |
| `--keep-comments`          | Keep code comments             | Remove comments          |
| `--keep-empty-lines`       | Keep empty lines               | Remove empty lines       |
| `--one-pdf-per-file`       | Generate separate PDF per file | Single PDF               |
| `--output-folder <folder>` | Folder for multiple PDFs       | `./output`               |

## Help Command

```bash
npx repo2pdf-cli --help
```

## Version

```bash
npx repo2pdf-cli --version
```

## Local Development

If you've cloned the repository locally, you can use the npm alias:

```bash
# Basic usage
npm run cli -- /path/to/repository

# With options (note the -- separator)
npm run cli -- /path/to/repo --line-numbers -o output.pdf

# Show help
npm run cli -- --help
```

The `--` separator is required to pass arguments through npm to the underlying script.

## Configuration

### Ignore Files

Customize which files and directories to ignore by creating a `repo2pdf.ignore` file.

**Lookup Priority:**

1. Current working directory (where you run the command) ← **checked first**
2. Target repository directory (fallback)

**Example `repo2pdf.ignore` file:**

```json
{
  "ignoredFiles": ["tsconfig.json", "dist", "node_modules"],
  "ignoredExtensions": [".raw", ".log", ".lock"]
}
```

**Usage scenarios:**

```bash
# Use a common ignore file in your working directory for all conversions
cd /Users/you/projects
echo '{"ignoredFiles": ["node_modules", "dist"]}' > repo2pdf.ignore
npx repo2pdf-cli /path/to/repo1  # Uses /Users/you/projects/repo2pdf.ignore
npx repo2pdf-cli /path/to/repo2  # Uses /Users/you/projects/repo2pdf.ignore

# Or use repository-specific ignore files
npx repo2pdf-cli /path/to/repo   # Uses /path/to/repo/repo2pdf.ignore if exists
```
