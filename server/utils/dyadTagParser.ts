// Simplified version of the original dyad tag parser

export interface DyadWriteTag {
  path: string;
  content: string;
}

export interface DyadRenameTag {
  path: string;
  newPath: string;
}

export function getDyadWriteTags(text: string): DyadWriteTag[] {
  const writeRegex = /<dyad-write\s+path="([^"]+)"\s*>(.*?)<\/dyad-write>/gs;
  const tags: DyadWriteTag[] = [];
  let match;
  
  while ((match = writeRegex.exec(text)) !== null) {
    tags.push({
      path: match[1],
      content: match[2]
    });
  }
  
  return tags;
}

export function getDyadDeleteTags(text: string): string[] {
  const deleteRegex = /<dyad-delete\s+path="([^"]+)"\s*><\/dyad-delete>/gs;
  const paths: string[] = [];
  let match;
  
  while ((match = deleteRegex.exec(text)) !== null) {
    paths.push(match[1]);
  }
  
  return paths;
}

export function getDyadRenameTags(text: string): DyadRenameTag[] {
  const renameRegex = /<dyad-rename\s+path="([^"]+)"\s+newPath="([^"]+)"\s*><\/dyad-rename>/gs;
  const tags: DyadRenameTag[] = [];
  let match;
  
  while ((match = renameRegex.exec(text)) !== null) {
    tags.push({
      path: match[1],
      newPath: match[2]
    });
  }
  
  return tags;
}
