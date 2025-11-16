"use client";

import React, {useCallback} from 'react';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import {common, createLowlight} from 'lowlight';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Code2,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({content, onChange}) => {
    const [linkUrl, setLinkUrl] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We'll use CodeBlockLowlight instead
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Highlight.configure({
                multicolor: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-muted p-4 rounded-lg font-mono text-sm',
                },
            }),
        ],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor || !linkUrl) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({href: linkUrl})
                .run();
        }
        setLinkUrl('');
        setIsLinkDialogOpen(false);
    }, [editor, linkUrl]);

    const addImage = useCallback(() => {
        if (!editor || !imageUrl) return;

        editor.chain().focus().setImage({src: imageUrl}).run();
        setImageUrl('');
        setIsImageDialogOpen(false);
    }, [editor, imageUrl]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
                               onClick,
                               active,
                               disabled,
                               children
                           }: {
        onClick: () => void;
        active?: boolean;
        disabled?: boolean;
        children: React.ReactNode
    }) => (
        <Button
            type="button"
            variant={active ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={`h-8 w-8 p-0 ${active ? 'bg-primary/10 text-primary' : ''}`}
        >
            {children}
        </Button>
    );

    return (
        <div className="border rounded-lg overflow-hidden bg-background">
            {/* Toolbar */}
            <div className="border-b bg-muted/30 p-2">
                <div className="flex flex-wrap gap-1">
                    {/* Text Formatting */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                        >
                            <Bold className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                        >
                            <Italic className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={editor.isActive('underline')}
                        >
                            <UnderlineIcon className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            active={editor.isActive('strike')}
                        >
                            <Strikethrough className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            active={editor.isActive('highlight')}
                        >
                            <Highlighter className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Headings */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                            active={editor.isActive('heading', {level: 1})}
                        >
                            <Heading1 className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                            active={editor.isActive('heading', {level: 2})}
                        >
                            <Heading2 className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                            active={editor.isActive('heading', {level: 3})}
                        >
                            <Heading3 className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Lists */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive('bulletList')}
                        >
                            <List className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={editor.isActive('orderedList')}
                        >
                            <ListOrdered className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            active={editor.isActive('blockquote')}
                        >
                            <Quote className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Code */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            active={editor.isActive('code')}
                        >
                            <Code className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            active={editor.isActive('codeBlock')}
                        >
                            <Code2 className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Alignment */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            active={editor.isActive({textAlign: 'left'})}
                        >
                            <AlignLeft className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            active={editor.isActive({textAlign: 'center'})}
                        >
                            <AlignCenter className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            active={editor.isActive({textAlign: 'right'})}
                        >
                            <AlignRight className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Link Dialog */}
                    <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <Link2 className="w-4 h-4"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Insert Link</DialogTitle>
                                <DialogDescription>
                                    Add a hyperlink to the selected text
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="link-url">URL</Label>
                                    <Input
                                        id="link-url"
                                        placeholder="https://example.com"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setLink();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={setLink}>Insert Link</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Image Dialog */}
                    <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <ImageIcon className="w-4 h-4"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Insert Image</DialogTitle>
                                <DialogDescription>
                                    Add an image from a URL
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image-url">Image URL</Label>
                                    <Input
                                        id="image-url"
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addImage();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={addImage}>Insert Image</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Separator orientation="vertical" className="h-8 mx-1"/>

                    {/* Undo/Redo */}
                    <div className="flex gap-1 ml-auto">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                        >
                            <Undo className="w-4 h-4"/>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                        >
                            <Redo className="w-4 h-4"/>
                        </ToolbarButton>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="bg-background"/>
        </div>
    );
};

export default RichTextEditor;