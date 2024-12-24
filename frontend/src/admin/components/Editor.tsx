import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          // Header dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          // Font style
          [{ font: [] }],
          // Formatting options
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          // List options
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          // Text alignment
          [{ align: [] }],
          // Insert options
          ["link", "image", "video"],
          // Text color and background color
          [{ color: [] }, { background: [] }],
          // Clear formatting
          ["clean"],
        ],
      }}
      formats={[
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
      ]}
    />
  );
};

export default Editor;
