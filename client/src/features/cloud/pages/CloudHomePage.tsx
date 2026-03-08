import { useCloudFiles } from "../hooks/useCloudFiles";

export default function CloudHomePage() {
  console.log("CloudHomePage rendered");

  const { files, loading, error } = useCloudFiles();

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Cloud Files</h1>
      {files.map((file) => (
        <div key={file.fileId}>
          <div>{file.title || file.originalName}</div>
          <div>{file.originalName}</div>
        </div>
      ))}
    </div>
  );
}
