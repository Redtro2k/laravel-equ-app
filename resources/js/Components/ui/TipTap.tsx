import React from 'react';
import RichTextEditor, { type UseEditorOptions } from 'reactjs-tiptap-editor';
import { BaseKit, Bold, BulletList, Heading, Italic } from 'reactjs-tiptap-editor/extension-bundle'
import 'reactjs-tiptap-editor/style.css'
import '../../../css/tiptap.css'

interface TextEditorProps {
    content?: string;
    onChange?: (value: string) => void;
    options?: Partial<UseEditorOptions>; // Allows overriding default options
    editable?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
   content = '',
   onChange,
   options = {},
   editable = true,
}) => {
    const defaultOptions: UseEditorOptions = {
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
        onFocus: () => console.log('Editor focused'),
        onBlur: () => console.log('Editor blurred'),
        editable,
        autofocus: 'start',
        ...options, // Allow users to override options
    };
    return (
        <RichTextEditor
            content={content}
            output="html"
            useEditorOptions={defaultOptions}
            dark={false}
            extensions={[BaseKit.configure({
                multiColumn: true,
                placeholder: {
                    showOnlyCurrent: true,
                    placeholder: "Write your remarks here..."
                },
            }), Heading, Bold, BulletList, Italic]}
        />
    );
};

export default TextEditor;
