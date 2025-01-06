interface ImageContentSectionProps {
  imagePosition: "left" | "right" | "top" | "bottom";
  imageUrl: string;
  content: React.ReactNode;
  imageClassName?: string;
  contentClassName?: string;
}

const ImageContentSection: React.FC<ImageContentSectionProps> = ({
  imagePosition,
  imageUrl,
  content,
  imageClassName = "object-cover w-full h-96",
  contentClassName = "p-8 space-y-6",
}) => {
  const gridClass =
    imagePosition === "left" || imagePosition === "right"
      ? "grid md:grid-cols-2 gap-8 items-center"
      : "grid gap-8 items-center";

  const imageOrder =
    imagePosition === "right" || imagePosition === "bottom" ? "md:order-2" : "";

  return (
    <div className={gridClass}>
      <div
        className={`relative overflow-hidden ${imageClassName} ${imageOrder}`}
      >
        <img
          src={imageUrl}
          alt="Content Image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className={contentClassName}>{content}</div>
    </div>
  );
};

export default ImageContentSection;
