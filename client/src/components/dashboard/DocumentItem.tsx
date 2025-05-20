import { cn, getFileIcon, getFileIconClass } from "@/lib/utils";
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
  
  // Mapeamento de cores baseado no tipo de arquivo
  const typeColorMap: Record<string, string> = {
    pdf: "bg-red-100 text-red-700",
    doc: "bg-blue-100 text-blue-700",
    docx: "bg-blue-100 text-blue-700",
    xls: "bg-green-100 text-green-700",
    xlsx: "bg-green-100 text-green-700",
    xml: "bg-purple-100 text-purple-700",
    jpg: "bg-yellow-100 text-yellow-700",
    png: "bg-yellow-100 text-yellow-700",
    default: "bg-gray-100 text-gray-700"
  };
  
  const colorClass = typeColorMap[fileType.toLowerCase()] || typeColorMap.default;
  
  return (
    <li className="flex items-center p-2 hover:bg-gray-50 rounded-md -mx-2 transition-colors duration-200 group">
      <div className={cn(
        "flex-shrink-0 h-10 w-10 rounded flex items-center justify-center",
        colorClass
      )}>
        <span className="material-icons">{iconName}</span>
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-500 mt-1">
          {uploadDate} por {uploadedBy}
        </p>
      </div>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(id)}
          className="ml-2 text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span className="material-icons">download</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span className="material-icons text-sm">visibility</span>
        </Button>
      </div>
    </li>
  );
}
