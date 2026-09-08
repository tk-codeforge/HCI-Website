import imageCompression from 'browser-image-compression';
import api from '@/utils/api';

const API_BASE_URL =
    (process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_API_DEV_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL) || 'https://apidev.hcinterior.in';

const normalizeMediaUrl = (url = '') => {
    if (!url) return '';
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return url;
};

// 🌟 MODERN ASYNC PROMPT UI (Unchanged, exactly as you designed it)
let isPromptActive = false;
const promptQueue = [];

const processPromptQueue = () => {
    if (isPromptActive || promptQueue.length === 0) return;
    isPromptActive = true;

    const { resolve, defaultText } = promptQueue.shift();

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '999999', display: 'flex',
        alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
        fontFamily: 'var(--font-outfit), var(--font-poppins), sans-serif'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
        backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px',
        width: '450px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease-out'
    });

    const title = document.createElement('h3');
    title.innerHTML = '🖼️ SEO Alt Text Required';
    Object.assign(title.style, { margin: '0 0 12px 0', fontSize: '1.4rem', color: '#111', fontWeight: '700' });

    const desc = document.createElement('p');
    desc.innerText = 'To improve SEO and accessibility, please provide a short, descriptive text for this image.';
    Object.assign(desc.style, { margin: '0 0 20px 0', fontSize: '0.95rem', color: '#555', lineHeight: '1.5' });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g., A minimalist white living room setup';
    input.value = defaultText || '';
    Object.assign(input.style, {
        width: '100%', padding: '14px 16px', borderRadius: '8px', border: '2px solid #e2e8f0',
        marginBottom: '24px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    });
    input.onfocus = () => input.style.borderColor = '#ff914d';
    input.onblur = () => input.style.borderColor = '#e2e8f0';

    const btnWrapper = document.createElement('div');
    Object.assign(btnWrapper.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });

    const errorMsg = document.createElement('span');
    errorMsg.innerText = '* Alt text is required';
    Object.assign(errorMsg.style, { color: '#e74c3c', fontSize: '0.85rem', opacity: '0', transition: 'opacity 0.2s', fontWeight: '600' });

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Save & Continue';
    Object.assign(saveBtn.style, {
        backgroundColor: '#ff914d', color: '#fff', border: 'none', padding: '12px 28px',
        borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem',
        transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(255, 145, 77, 0.3)'
    });

    btnWrapper.append(errorMsg, saveBtn);
    box.append(title, desc, input, btnWrapper);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => input.focus(), 50);

    const handleSave = () => {
        const val = input.value.trim();
        if (!val) {
            errorMsg.style.opacity = '1';
            input.style.borderColor = '#e74c3c';
        } else {
            document.body.removeChild(overlay);
            isPromptActive = false;
            resolve(val);
            processPromptQueue(); 
        }
    };

    saveBtn.onclick = handleSave;
    input.onkeydown = (e) => { if (e.key === 'Enter') handleSave(); };
};

export const requireAltTextPrompt = () => {
    return new Promise((resolve) => {
        promptQueue.push({ resolve, defaultText: '' });
        processPromptQueue();
    });
};

class MyUploadAdapter {
    // 🌟 Capture the Editor instance in the constructor
    constructor(loader, editor) {
        this.loader = loader;
        this.editor = editor; 
    }

    async upload() {
        try {
            const file = await this.loader.file;
            const altText = await requireAltTextPrompt();

            let uploadFile = file;
            try {
                // Safe compression fallback
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: false, fileType: 'image/webp' };
                uploadFile = await imageCompression(file, options);
            } catch (e) { 
                console.warn("Compression fallback", e); 
            }

            const formData = new FormData();
            formData.append('image', uploadFile, uploadFile.name || 'upload.webp');
            formData.append('alt_text', altText);

            const response = await api.post('/cms-parent-child/upload-image', formData);
            
            const data = response.data;
            const finalUrl = data.url || (data.data && data.data.url) || '';

            if (!finalUrl) throw new Error("Image URL is missing from response.");

            const imageUrl = normalizeMediaUrl(finalUrl);

            // 🌟 THE FIX: The Safe SEO Injection Method
            // We wait 500ms for CKEditor to completely finish its upload swap process.
            // Then we manually scan the document for the new URL and add the Alt Text.
            // No event listeners needed = No more crashes!
            setTimeout(() => {
                if (this.editor && this.editor.model) {
                    this.editor.model.change(writer => {
                        const root = this.editor.model.document.getRoot();
                        const range = writer.createRangeIn(root);
                        
                        for (const item of range.getItems()) {
                            // Find the exact image we just uploaded
                            if ((item.is('element', 'imageBlock') || item.is('element', 'imageInline')) && item.getAttribute('src') === imageUrl) {
                                writer.setAttribute('alt', altText, item);
                            }
                        }
                    });
                }
            }, 500);

            return { default: imageUrl };

        } catch (error) {
            console.error("Upload Error:", error);
            return Promise.reject(error?.message || "Failed to upload");
        }
    }

    abort() {}
}

// 🌟 Pass the editor instance into the adapter when initializing
export default function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader, editor);
    };
}