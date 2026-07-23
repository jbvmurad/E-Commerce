import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { FileImage, FileText, Paperclip, UploadCloud, X } from 'lucide-react';
import { AiAttachment } from '../../types/ai';

interface AiAttachmentPickerProps {
  attachments: AiAttachment[];
  onChange: (attachments: AiAttachment[]) => void;
  accent?: string;
  compact?: boolean;
  maxFiles?: number;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AiAttachmentPicker({
  attachments,
  onChange,
  accent = '#ff00ff',
  compact = false,
  maxFiles = 5,
}: AiAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError('');

    const validFiles = Array.from(fileList).filter((file) => {
      const supported = file.type === 'application/pdf' || file.type.startsWith('image/');
      return supported && file.size <= MAX_FILE_SIZE;
    });

    if (validFiles.length !== fileList.length) {
      setError('Yalnızca PDF veya görsel, dosya başına en fazla 15 MB.');
    }

    const available = Math.max(0, maxFiles - attachments.length);
    const additions: AiAttachment[] = validFiles.slice(0, available).map((file) => ({
      id: createId(),
      file,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    if (validFiles.length > available) setError(`En fazla ${maxFiles} dosya ekleyebilirsin.`);
    onChange([...attachments, ...additions]);
  };

  const removeFile = (id: string) => {
    const target = attachments.find((item) => item.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(attachments.filter((item) => item.id !== id));
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div>
      {!compact && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg cursor-pointer transition-all"
          style={{
            border: `1px dashed ${dragging ? accent : `${accent}45`}`,
            background: dragging ? `${accent}12` : `${accent}07`,
          }}
        >
          <UploadCloud size={20} style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent})` }} />
          <div>
            <p style={{ color: 'rgba(224,247,255,.78)', fontSize: 12, fontWeight: 600 }}>PDF veya görsel yükle</p>
            <p style={{ color: 'rgba(224,247,255,.35)', fontSize: 10 }}>Sürükle-bırak ya da seç • Maks. 15 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {compact && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Dosya ekle"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ color: 'rgba(224,247,255,.55)', border: `1px solid ${accent}28`, background: `${accent}08` }}
        >
          <Paperclip size={17} />
        </button>
      )}

      {attachments.length > 0 && (
        <div className={`flex gap-2 overflow-x-auto ${compact ? 'mt-2' : 'mt-3'}`}>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative flex items-center gap-2 rounded-lg shrink-0"
              style={{
                padding: compact ? '6px 8px' : '8px 10px',
                border: `1px solid ${accent}28`,
                background: 'rgba(2,4,8,.86)',
                maxWidth: compact ? 190 : 240,
              }}
            >
              {attachment.previewUrl ? (
                <img src={attachment.previewUrl} alt="" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${accent}12` }}>
                  {attachment.mimeType === 'application/pdf'
                    ? <FileText size={15} style={{ color: accent }} />
                    : <FileImage size={15} style={{ color: accent }} />}
                </div>
              )}
              <div className="min-w-0 pr-5">
                <p className="truncate" style={{ color: 'rgba(224,247,255,.72)', fontSize: 10, maxWidth: compact ? 105 : 150 }}>{attachment.name}</p>
                <p style={{ color: 'rgba(224,247,255,.3)', fontSize: 9 }}>{formatBytes(attachment.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(attachment.id)}
                className="absolute right-1.5 top-1.5 w-4 h-4 flex items-center justify-center rounded-full"
                style={{ color: 'rgba(224,247,255,.55)', background: `${accent}14` }}
                aria-label={`${attachment.name} dosyasını kaldır`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2" style={{ color: '#ff7777', fontSize: 10 }}>{error}</p>}
    </div>
  );
}
