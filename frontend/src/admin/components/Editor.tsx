import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  // Custom image handler for resizable images
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // In a real application, you would upload the file to your server here
          // and get back the URL. For now, we'll use a local URL
          const url = URL.createObjectURL(file);

          const quill = (ReactQuill as any)
            .findDOMNode(this)
            ?.querySelector(".ql-editor");
          const range = (ReactQuill as any).getEditor().getSelection(true);

          // Insert the image with custom class for resizing
          (ReactQuill as any)
            .getEditor()
            .insertEmbed(range.index, "image", url);
          (ReactQuill as any)
            .getEditor()
            .insertText(range.index + 1, "\n", "user");
          (ReactQuill as any)
            .getEditor()
            .setSelection(range.index + 2, "silent");

          // Add resize handles to the image
          setTimeout(() => {
            const img = quill?.querySelector('img[src="' + url + '"]');
            if (img) {
              img.className = "resizable-image";
              img.setAttribute("draggable", "true");
            }
          }, 0);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          ["link", "image", "video"],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "color",
    "background",
  ];

  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="editor-input"
      />
      <style>{`
        .editor-container {
          height: 400px;
        }
        .editor-input {
          height: 350px;
        }
        :global(.ql-editor img.resizable-image) {
          cursor: move;
          display: inline-block;
          max-width: 100%;
          height: auto;
          resize: both;
          overflow: hidden;
          min-width: 50px;
          min-height: 50px;
          border: 1px solid transparent;
        }
        :global(.ql-editor img.resizable-image:hover) {
          border: 1px solid #ccc;
        }
        :global(.ql-editor) {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
