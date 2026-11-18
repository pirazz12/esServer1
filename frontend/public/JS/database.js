const form = document.getElementById("database-form");
const loginMessage = document.getElementById("database-login-message");
const input = document.getElementById("database-message");
const status = document.getElementById("database-status");
const messagesContainer = document.getElementById("database-messages");
const jsonButton = document.getElementById("database-json-button");
const jsonPanel = document.getElementById("database-json");

async function loadMessages() {
    const response = await fetch("/api/v1/data/messages");
    if (!response.ok) {
        messagesContainer.textContent = "Impossibile caricare i messaggi.";
        return;
    }

    const result = await response.json();
    messagesContainer.innerHTML = "";

    if (!result.messages?.length) {
        messagesContainer.textContent = "Nessun messaggio salvato.";
        return;
    }

    result.messages.forEach((message) => {
        const item = document.createElement("article");
        item.className = "database-message";
        item.textContent = message.text;
        messagesContainer.appendChild(item);
    });
}

async function loadDatabaseStatus() {
    const response = await fetch("/api/v1/data/db-status");
    if (!response.ok) return;

    const result = await response.json();
    jsonPanel.textContent = JSON.stringify(result.data, null, 2);
}

async function initializeDatabasePage() {
    const response = await fetch("/api/v1/auth/me");
    const user = await response.json();

    if (!user.authenticated) {
        loginMessage.hidden = false;
        form.hidden = true;
        jsonButton.hidden = true;
        messagesContainer.textContent = "Effettua il login per vedere i messaggi.";
        return;
    }

    loginMessage.hidden = true;
    form.hidden = false;
    jsonButton.hidden = false;
    await loadMessages();
    await loadDatabaseStatus();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "Salvataggio in corso...";

    try {
        const response = await fetch("/api/v1/data/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input.value })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Errore durante il salvataggio");
        }

        input.value = "";
        status.textContent = "Messaggio salvato su MongoDB.";
        await loadMessages();
        await loadDatabaseStatus();
    } catch (error) {
        status.textContent = error.message;
    }
});

jsonButton.addEventListener("click", () => {
    jsonPanel.hidden = !jsonPanel.hidden;
    jsonButton.textContent = jsonPanel.hidden ? "Mostra stato database" : "Nascondi stato database";
});

window.addEventListener("DOMContentLoaded", initializeDatabasePage);
