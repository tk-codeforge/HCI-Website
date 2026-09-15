"use client";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DOMPurify from 'isomorphic-dompurify';
import {
    Autoformat,
    BlockQuote,
    Bold,
    ClassicEditor,
    Essentials,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    HtmlEmbed,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    SourceEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Undo
} from 'ckeditor5';
import CustomUploadAdapterPlugin, { requireAltTextPrompt } from './CustomUploadAdapter';
import 'ckeditor5/ckeditor5.css';

import { Plugin, ButtonView } from 'ckeditor5';

const ARROW_SVG_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" fill="%23333333"/></svg>`;
const ARROW_DATA_URI = `data:image/svg+xml,${encodeURIComponent(ARROW_SVG_MARKUP)}`;

class InsertArrowIcon extends Plugin {
    init() {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        editor.ui.componentFactory.add('insertArrowIcon', (locale) => {
            const button = new ButtonView(locale);

            button.set({
                label: 'Insert Arrow Icon',
                withText: false,
                tooltip: true,
                icon: `<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`
            });

            // 🔒 Critical guard: only enabled when there's a real text caret.
            // Prevents the button from ever firing while a table/row/cell/widget
            // is selected as an object — which is what was wiping your table.
            button.bind('isEnabled').to(selection, 'isCollapsed');

            button.on('execute', () => {
                editor.model.change((writer) => {
                    const imageElement = writer.createElement('imageInline', {
                        src: ARROW_DATA_URI,
                        alt: 'Arrow icon'
                    });
                    editor.model.insertContent(imageElement, selection.getFirstPosition());
                });
            });

            return button;
        });
    }
}

function MandatoryAltTextPlugin(editor) {
    editor.model.document.on('change:data', () => {
        const differ = editor.model.document.differ;
        if (!differ) return;

        const changes = differ.getChanges();

        for (const entry of changes) {
            // 1. Detect completely new images (e.g., Pasted from an external website)
            if (entry.type === 'insert' && (entry.name === 'imageBlock' || entry.name === 'imageInline')) {
                const imageElement = entry.position.nodeAfter;

                if (!imageElement) continue;

                // Skip if currently being uploaded by our adapter (adapter handles the prompt)
                if (imageElement.hasAttribute('uploadId') || imageElement.hasAttribute('uploadStatus')) {
                    continue;
                }

                if (!imageElement.getAttribute('alt')) {
                    requireAltTextPrompt().then(altText => {
                        // Use enqueueChange for asynchronous prompt responses
                        editor.model.enqueueChange('transparent', (writer) => {
                            writer.setAttribute('alt', altText, imageElement);
                        });
                    });
                }
            }

            // 2. Detect when an uploaded image gets its final URL applied by the adapter
            if (entry.type === 'attribute' && entry.attributeKey === 'src') {
                for (const item of entry.range.getItems()) {
                    if (item.is('element', 'imageBlock') || item.is('element', 'imageInline')) {
                        const newSrc = entry.attributeNewValue;
                        const uploadedAlt = getUploadedImageAlt(newSrc);
                        
                        if (uploadedAlt && item.getAttribute('alt') !== uploadedAlt) {
                            
                            // 🌟 FINAL FIX: Do NOT use setTimeout or enqueueChange here.
                            // We must use immediate change() logic with a safety check.
                            editor.model.change((writer) => {
                                // Before trying to touch the item, check if it's still 
                                // valid in the model and not currently locked/being removed.
                                if (writer.model.document.differ.isItemValid(item)) {
                                    // Make sure we are applying within a transparent (undos-skipping) batch
                                    writer.setAttribute('alt', uploadedAlt, item);
                                } else {
                                    console.warn("Skipping deferred alt-text update: Image element became invalid.");
                                }
                            });
                            
                        }
                    }
                }
            }
        }
    });
}
const sanitizeEmbeddedHtml = (inputHtml) => {
    const sanitizedHtml = DOMPurify.sanitize(inputHtml, {
        ADD_TAGS: ['iframe', 'section', 'article', 'main', 'aside', 'form'],
        ADD_ATTR: [
            'allow',
            'allowfullscreen',
            'aria-label',
            'aria-labelledby',
            'class',
            'frameborder',
            'id',
            'loading',
            'name',
            'rel',
            'role',
            'scrolling',
            'style',
            'target',
            'title'
        ],
        FORBID_TAGS: ['script']
    });

    return {
        html: sanitizedHtml,
        hasChanged: sanitizedHtml !== inputHtml
    };
};

const editorConfig = {
    licenseKey: 'GPL',
    plugins: [
        Autoformat,
        BlockQuote,
        Bold,
        Essentials,
        FontSize,
        GeneralHtmlSupport,
        Heading,
        HtmlEmbed,
        Image,
        ImageCaption,
        ImageInsert,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        ListProperties,
        MediaEmbed,
        Paragraph,
        PasteFromOffice,
        SourceEditing,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        Undo
    ],
    extraPlugins: [CustomUploadAdapterPlugin, InsertArrowIcon],
    toolbar: {
        items: [
            'undo', 'redo', '|',
            'heading', '|',
            'fontSize',
            'bold', 'italic', 'blockQuote', '|',
            'link', 'imageUpload', 'insertTable', 'mediaEmbed', 'htmlEmbed', 'sourceEditing', '|',
            'bulletedList', 'numberedList', 'outdent', 'indent', 'insertArrowIcon'
        ],
        shouldNotGroupWhenFull: true
    },
    fontSize: {
        options: [
            10,11,12,13,14,15,'default',16,17,18,19,20,
        ]
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' }
        ]
    },
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
            openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }
        }
    },
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    image: {
        resizeUnit: 'px',
        resizeOptions: [
        { name: 'resizeImage:original', value: null, label: 'Original' },
         { name: 'resizeImage:25', value: '25', label: '25px' },
        { name: 'resizeImage:30', value: '30', label: '30px' },
        { name: 'resizeImage:40', value: '40', label: '40px' },
        { name: 'resizeImage:50', value: '50', label: '50px' }
    ],
        toolbar: [
            'imageResize',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'imageTextAlternative'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'toggleTableCaption',
            'tableProperties',
            'tableCellProperties'
        ]
    },
    htmlSupport: {
        allow: [
            {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
            }
        ],
        disallow: [
            {
                name: 'script'
            },
            { styles: ['font-size'] }
        ]
    },
    htmlEmbed: {
        showPreviews: true,
        sanitizeHtml: sanitizeEmbeddedHtml
    },
    mediaEmbed: {
        previewsInData: true
    }
};

const CKEditorComponent = ({ pageData, setPageData }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={pageData}
            onChange={(event, editor) => {
                const data = editor.getData();
                setPageData(data);
            }}
            config={editorConfig}
        />
    );
};

export default CKEditorComponent;