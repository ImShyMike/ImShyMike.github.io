document.addEventListener('DOMContentLoaded', () => {
    const typewriter = document.getElementById('typewriter');
    let deleting = true;
    let typing = false;
    let text = typewriter.textContent || typewriter.innerText;
    let index = text.length;

    function enableCursor() {
        typing = true;
        typewriter.style.borderRight = '4px solid #cacaca';
    }

    function isTyping() { return typing }
    
    function type() {
        typing = true;
        if (deleting) {
            if (index > 0) {
                typewriter.textContent = text.slice(0, --index);
                setTimeout(type, 150);
            } else {
                deleting = false;
                setTimeout(type, 300);
            }
        } else {
            if (index < text.length) {
                typewriter.textContent = text.slice(0, ++index);
                setTimeout(type, 150);
            } else {
                typewriter.style.borderRight = '4px solid rgba(0, 0, 0, 0)';
                typing = false;
                index = text.length;
                deleting = true;
            }
        }
    }

    typewriter.addEventListener('mouseover', () => {
        if (!isTyping()) {
            enableCursor();
            type();
        }
    });

    setTimeout(enableCursor, 500)
    setTimeout(type, 500)
});