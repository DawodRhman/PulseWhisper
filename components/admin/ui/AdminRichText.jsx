"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, Undo, Redo, X } from "lucide-react";
import { useEffect, useState } from "react";

function ToolbarButton({ onClick, isActive, icon: Icon, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded transition ${isActive ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
            title={label}
        >
            <Icon size={16} />
        </button>
    );
}

export function AdminRichText({ label, value, onChange, disabled }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 hover:underline",
                },
            }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none p-3 focus:outline-none min-h-[120px] max-h-[400px] overflow-y-auto",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !disabled,
        immediatelyRender: false,
    });

    // Sync value changes from parent (e.g. form reset)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only set content if it's materially different to avoid cursor jumps
            // A simple check is usually enough, but ideal is strict equality or parsing
            if (editor.getText() === "" && value === "") return; // Avoid clearing if already empty and just synced

            // If the incoming value is empty, clear the editor
            if (!value) {
                editor.commands.setContent("");
                return;
            }

            // If needed, we can implement more complex diffing, but for simple forms:
            if (Math.abs(editor.getHTML().length - value.length) > 10) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <div className="h-32 rounded-lg border border-slate-200 bg-slate-50 animate-pulse" />
            </div>
        );
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className="space-y-1">
            {label && <span className="block text-xs font-semibold text-slate-500">{label}</span>}
            <div className={`rounded-lg border border-slate-200 bg-white overflow-hidden transition-shadow focus-within:ring-1 focus-within:ring-blue-500 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
                {/* Toolbar */}
                <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5 flex-wrap">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive("bold")}
                        icon={Bold}
                        label="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive("italic")}
                        icon={Italic}
                        label="Italic"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive("underline")}
                        icon={UnderlineIcon}
                        label="Underline"
                    />
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive("bulletList")}
                        icon={List}
                        label="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive("orderedList")}
                        icon={ListOrdered}
                        label="Ordered List"
                    />
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <ToolbarButton
                        onClick={setLink}
                        isActive={editor.isActive("link")}
                        icon={LinkIcon}
                        label="Link"
                    />
                    {editor.isActive("link") && (
                        <ToolbarButton
                            onClick={() => editor.chain().focus().unsetLink().run()}
                            isActive={false}
                            icon={X}
                            label="Remove Link"
                        />
                    )}
                    <div className="flex-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        icon={Undo}
                        label="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        icon={Redo}
                        label="Redo"
                    />
                </div>

                {/* Editor */}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
