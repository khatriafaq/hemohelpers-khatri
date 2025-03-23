
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface VerificationDocumentsProps {
  uploadedDocuments: File[];
  setUploadedDocuments: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function VerificationDocuments({
  uploadedDocuments,
  setUploadedDocuments
}: VerificationDocumentsProps) {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setUploadedDocuments((prev) => [...prev, ...newFiles]);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is pending verification.",
      });
    }
  };

  return (
    <>
      <div className="rounded-lg border border-dashed p-10 text-center">
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <Input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
          <Label
            htmlFor="document-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Select Files
          </Label>
        </div>
      </div>
      
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Documents</h3>
          <div className="border rounded-lg divide-y">
            {uploadedDocuments.map((file, index) => (
              <div key={index} className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mr-3">
                    <span className="text-xs">{file.name.split('.').pop()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate" style={{ maxWidth: "200px" }}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="text-xs py-1 px-2 rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
