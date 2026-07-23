import { UploadCloud, X } from 'lucide-react';
import { useState, useRef, DragEvent } from 'react';

interface FileUploadProps { onChange?: (files: File[]) => void; maxFiles?: number; }

export function FileUpload({ onChange, maxFiles = 5 }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, maxFiles - previews.length);
    setPreviews((p) => [...p, ...arr.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
    onChange?.(arr);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-3 cursor-pointer p-8 rounded transition-all duration-200"
        style={{
          border: `2px dashed ${dragging ? 'rgba(0,245,255,0.6)' : 'rgba(0,245,255,0.2)'}`,
          background: dragging ? 'rgba(0,245,255,0.06)' : 'rgba(0,245,255,0.02)',
          borderRadius: 8,
        }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
          <UploadCloud size={20} style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.6))' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'rgba(224,247,255,0.7)' }}>Sürükle & bırak</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(224,247,255,0.35)' }}>veya tıkla — PNG, JPG, WEBP (maks. {maxFiles})</p>
        </div>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {previews.map((p, i) => (
            <div key={i} className="relative group rounded overflow-hidden aspect-square"
              style={{ border: '1px solid rgba(0,245,255,0.15)', background: 'rgba(0,245,255,0.04)' }}>
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <button onClick={() => setPreviews((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: '#ff00ff', boxShadow: '0 0 8px #ff00ff' }}>
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
