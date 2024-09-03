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
                index = text.length;
                deleting = true;
                setTimeout(function () {
                    typing = false; 
                }, 750);
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

    let discordPresence = document.getElementById("discord-status")
    let counter = 0
    function updateDiscordStatus() {
        counter++
        discordPresence.src = "https://lanyard.cnrad.dev/api/582648583635992622?idleMessage=Not%20doing%20anything%20:p&bg=1f1f1f&update=" + counter.toString()
        setTimeout(updateDiscordStatus, 15000)
    }

    setTimeout(updateDiscordStatus, 15000)
});