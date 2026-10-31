type Props = { files: File[]; editing: boolean; copying?: boolean; currentCount: number };

/** Texto bajo el input de imágenes: lista los archivos o avisa que se conservan o se copian */
export function ImageFilesHint({ files, editing, copying, currentCount }: Props) {
  if (files.length > 0) {
    return (
      <p className="-mt-2 text-xs text-zinc-500">
        {files.length} imagen(es): {files.map((f) => f.name).join(", ")}
        {editing && " — reemplazarán a las actuales."}
      </p>
    );
  }
  if (!editing && !copying) return null;
  const action = copying ? "copian" : "conservan";
  return (
    <p className="-mt-2 text-xs text-zinc-500">
      Sin archivos nuevos se {action} las {currentCount} imagen(es) {copying ? "en el equipo nuevo." : "actuales."}
    </p>
  );
}
