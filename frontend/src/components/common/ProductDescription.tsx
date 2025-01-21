import QRCodeComponent from "./QRCodeComponent";

interface ProductDescriptionProps {
  features: string;
  pdfUrl: string | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  features,
  pdfUrl,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Product Details</h2>
      <div
        className="text-gray-800 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: features }}
      />
      {pdfUrl && ( // Check if pdfUrl exists before rendering
        <>
          <h3 className="text-lg font-semibold mt-8">
            Scan the QR Code to Open the Report
          </h3>
          <QRCodeComponent value={pdfUrl} size={200} />
        </>
      )}
    </div>
  );
};

export default ProductDescription;
