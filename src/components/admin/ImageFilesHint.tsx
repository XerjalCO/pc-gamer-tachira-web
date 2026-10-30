type Props = { files: File[]; editing: boolean; currentCount: number };

/** Texto bajo el input de imágenes: lista los archivos elegidos o avisa que se conservan las actuales */
export function ImageFilesHint({ files, editing, currentCount }: Props) {
  if (files.length > 0) {
    return (
      <p className="-mt-2 text-xs text-zinc-500">
        {files.length} imagen(es): {files.map((f) => f.name).join(", ")}
        {editing && " — reemplazarán a las actuales."}
      </p>
    );
  }
  if (!editing) return null;
  return (
    <p className="-mt-2 text-xs text-zinc-500">
      Sin archivos nuevos se conservan las {currentCount} imagen(es) actuales.
    </p>
  );
}
