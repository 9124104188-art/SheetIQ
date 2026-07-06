import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import "../styles/uploadDropzone.css";

function UploadDropzone({ onUpload, uploading }) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    onUpload(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-dropzone ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />

      <div className="dropzone-icon">
        {isDragActive ? (
          <FileSpreadsheet size={34} />
        ) : (
          <UploadCloud size={34} />
        )}
      </div>

      <h2>
        {isDragActive
          ? "Drop your Excel file here"
          : "Upload your dataset"}
      </h2>

      <p>
        Drag & drop your Excel file here, or click to browse from your computer.
      </p>

      <button type="button" className="upload-main-btn" disabled={uploading}>
        {uploading ? "Uploading..." : "Choose Excel File"}
      </button>

      <span className="upload-note">Supports .xlsx and .xls files</span>
    </div>
  );
}

export default UploadDropzone;