let textareaCopy;

// 影响输入框文本布局的样式属性
const ContextStyleProps = [
    'width',
    'font-family',
    'font-size',
    'line-height',
    'text-indent',
    'letter-spacing',
    'text-transform',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'border-width',
    'box-sizing'
];

const HiddenStyle = {
    height: '0',
    visibility: 'hidden',
    overflow: 'hidden',
    position: 'absolute',
    top: '-1000px',
    bottom: '-1000px',
    zIndex: '-1000'
};

const getTextareaCopy = textarea => {
    if (!textareaCopy) {
        textareaCopy = document.createElement('textarea');
        for (const key in HiddenStyle) {
            textareaCopy.style[key] = HiddenStyle[key];
        }
        document.body.appendChild(textareaCopy);
    }
    const style = getComputedStyle(textarea);
    ContextStyleProps.forEach(prop => {
        textareaCopy.style[prop] = style[prop];
    });
    textareaCopy.value = textarea.value;
    return textareaCopy;
};

// 计算 textarea 元素的 height、minHeight、maxHeight 值
export const calculateTextareaHeight = (textarea, autosize) => {
    const height = getTextareaHeightByRows(textarea, 'auto');
    const result = {
        height,
        minHeight: '',
        maxHeight: ''
    };
    const { minRows, maxRows } = autosize;
    if (minRows) {
        result.minHeight = getTextareaHeightByRows(textarea, minRows);
    }
    if (maxRows) {
        result.maxHeight = getTextareaHeightByRows(textarea, maxRows);
    }
    return result;
};

export const getTextareaHeightByRows = (textarea, rows = 1) => {
    const textareaCopy = getTextareaCopy(textarea);
    let value = '';
    if (rows === 'auto') {
        value = textarea.value || textarea.placeholder;
    } else {
        for (let i = 0; i < rows - 1; i++) {
            value += '\n';
        }
    }
    textareaCopy.value = value;
    const style = getComputedStyle(textareaCopy);
    let height = textareaCopy.scrollHeight;
    if (style.boxSizing === 'content-box') {
        const paddingTop = parseFloat(style.paddingTop);
        const paddingBottom = parseFloat(style.paddingBottom);
        height -= paddingTop + paddingBottom;
    } else {
        const borderTopWidth = parseFloat(style.borderTopWidth);
        const borderBottomWidth = parseFloat(style.borderBottomWidth);
        height += borderTopWidth + borderBottomWidth;
    }

    return height + 'px';
};

export const removeTextareaCopy = () => {
    if (!textareaCopy) {
        return;
    }
    textareaCopy.remove();
    textareaCopy = null;
};
