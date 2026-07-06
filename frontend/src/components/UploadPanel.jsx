import UploadDropzone from "./UploadDropzone";

function UploadPanel({ onUpload, uploading }) {
  return (
    <section className="upload-panel">
      <div className="upload-header">
        <p className="eyebrow">Upload Dataset</p>

        <h2>Turn Excel into Insights</h2>

        <p>
          Upload an Excel or CSV file. SheetIQ AI will automatically analyze
          your data, generate charts, KPIs and an AI-powered summary.
        </p>
      </div>

      <UploadDropzone onUpload={onUpload} uploading={uploading} />
    </section>
  );
}

export default UploadPanel;