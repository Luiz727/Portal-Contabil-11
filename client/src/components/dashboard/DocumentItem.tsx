import { getFileIcon, getFileIconClass } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DocumentItemProps = {
  id: number;
  name: string;
  fileType: string;
  uploadedBy: string;
  uploadDate: string;
  onDownload: (id: number) => void;
};

export default function DocumentItem({
  id,
  name,
  fileType,
  uploadedBy,
  uploadDate,
  onDownload,
}: DocumentItemProps) {
  const iconName = getFileIcon(fileType);
  const iconClass = getFileIconClass(fileType);
  
  return (
    <li className="flex items-center">
      <div className={`flex-shrink-0 h-10 w-10 rounded ${iconClass} flex items-center justify-center`}>
        <span className="material-icons">{iconName}</span>
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <p className="text-sm font-medium text-neutral-800 truncate">{name}</p>
        <p className="text-xs text-neutral-500 mt-1">
          {uploadDate} por {uploadedBy}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownload(id)}
        className="ml-2 text-neutral-400 hover:text-neutral-500"
      >
        <span className="material-icons">download</span>
      </Button>
    </li>
  );
}
