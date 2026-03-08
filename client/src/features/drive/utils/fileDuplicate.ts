export type DuplicateCheckFile = {
  id?: string;
  name: string;
  size: number;
  isTrashed?: boolean;
};

function buildDuplicateKey(name: string, size: number) {
  return `${name}__${size}`;
}

export function findDuplicatesWithinSelection(selectedFiles: File[]) {
  const seen = new Set<string>();
  const duplicates: File[] = [];

  for (const file of selectedFiles) {
    const key = buildDuplicateKey(file.name, file.size);

    if (seen.has(key)) {
      duplicates.push(file);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

export function findDuplicateFiles(
  selectedFiles: File[],
  existingFiles: DuplicateCheckFile[],
) {
  const existingSet = new Set(
    existingFiles
      .filter((f) => !f.isTrashed)
      .map((f) => buildDuplicateKey(f.name, f.size)),
  );

  return selectedFiles.filter((file) =>
    existingSet.has(buildDuplicateKey(file.name, file.size)),
  );
}

export function dedupeSelectedFilesKeepLast(selectedFiles: File[]) {
  const map = new Map<string, File>();

  for (const file of selectedFiles) {
    const key = buildDuplicateKey(file.name, file.size);
    map.set(key, file);
  }

  return Array.from(map.values());
}

export function buildDuplicateNamesText(files: Array<{ name: string }>) {
  return files.map((f) => f.name).join(", ");
}
