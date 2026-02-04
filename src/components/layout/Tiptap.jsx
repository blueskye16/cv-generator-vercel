import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaListUl,
  FaUnderline,
} from "react-icons/fa";

export default function Tiptap({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    shouldRerenderOnTransaction: false,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        spellcheck: "false",
        class: "focus:outline-hidden p-2 break-words",
      },
    },
  });

  const MenuBar = ({ editor }) => {
    const getButtonClass = (isActive) =>
      `relative cursor-pointer p-1 rounded-md ${isActive ? "bg-gray-700 text-white hover:bg-gray-500" : "hover:bg-gray-400"}`;
    const editorState = useEditorState({
      editor,
      selector: (ctx) => {
        return {
          isBold: ctx.editor.isActive("bold") ?? false,
          canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
          isItalic: ctx.editor.isActive("italic") ?? false,
          canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
          isUnderline: ctx.editor.isActive("underline") ?? false,
          canUnderline:
            ctx.editor.can().chain().toggleUnderline().run() ?? false,
          isBulletList: ctx.editor.isActive("bulletList") ?? false,
          isTextAlignActive: ctx.editor.isActive("center") ?? false,
        };
      },
    });

    return (
      <div className="border-b border-b-gray-400">
        <div className="flex flex-row flex-wrap gap-2 px-3 py-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={getButtonClass(editorState.isBold ? "bold" : "")}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={getButtonClass(editorState.isItalic ? "italic" : "")}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editorState.canUnderline}
            className={getButtonClass(
              editorState.isUnderline ? "underline" : "",
            )}
          >
            <FaUnderline />
          </button>
          <div className="border-l border-gray-400"></div>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={getButtonClass(
              editorState.isBulletList ? "bulletList" : "",
            )}
          >
            <FaListUl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
            className={getButtonClass(editor.isActive({ textAlign: "left" }))}
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleTextAlign("center").run()
            }
            className={getButtonClass(editor.isActive({ textAlign: "center" }))}
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleTextAlign("right").run()
            }
            className={getButtonClass(editor.isActive({ textAlign: "right" }))}
          >
            <FaAlignRight />
          </button>
        </div>
      </div>
    );
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="mt-2 min-h-48 rounded-md bg-gray-200 dark:bg-gray-700">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
