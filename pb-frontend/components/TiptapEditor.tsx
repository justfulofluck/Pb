import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-4',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('bold') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Bold"
        >
          <span className="material-symbols-outlined text-sm">format_bold</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('italic') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Italic"
        >
          <span className="material-symbols-outlined text-sm">format_italic</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('strike') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Strikethrough"
        >
          <span className="material-symbols-outlined text-sm">strikethrough_s</span>
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Heading 2"
        >
          <span className="material-symbols-outlined text-sm">title</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Heading 3"
        >
          <span className="material-symbols-outlined text-sm">text_fields</span>
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Numbered List"
        >
          <span className="material-symbols-outlined text-sm">format_list_numbered</span>
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('link') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Add Link"
        >
          <span className="material-symbols-outlined text-sm">link</span>
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg text-sm font-bold hover:bg-slate-100 text-slate-600 transition-colors"
          title="Add Image"
        >
          <span className="material-symbols-outlined text-sm">image</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive('blockquote') ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Quote"
        >
          <span className="material-symbols-outlined text-sm">format_quote</span>
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-sm font-bold hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30"
          title="Undo"
        >
          <span className="material-symbols-outlined text-sm">undo</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-sm font-bold hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-30"
          title="Redo"
        >
          <span className="material-symbols-outlined text-sm">redo</span>
        </button>
      </div>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="bg-white min-h-[300px]"
      />
    </div>
  );
}