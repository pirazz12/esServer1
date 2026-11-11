async function loadNavbar() {
    const container = document.getElementById("navbar");
    //se la nav non c'è chiudi -->guard clause
    if (!container) return;

    // 1. Inserisce l'HTML della navbar -->caricamento dom
    const html = await (await fetch("/api/v1/components/navbar.html")).text();
    container.innerHTML = html;

    // 2. Chiede al backend chi è loggato
    const authArea = document.getElementById("auth-area");
    try {
        const response = await fetch("/api/v1/auth/me");//endpoint standard google

        if (!response.ok) {
            window.dispatchEvent(new CustomEvent("auth-state-change", { detail: null }));
            throw new Error(`HTTP ${response.status}`);
        }

        const user = await response.json();

        if (user.authenticated) {
            authArea.replaceChildren(); //quando autenticato toglie il contenuto "Login with google"
            console.log("Utente autenticato:", user.firstName || user.displayName);
            window.dispatchEvent(new CustomEvent("auth-state-change", { detail: user }));

            const brand = document.querySelector(".nav-logo");
            const hello = document.createElement("span");
            hello.className = "nav-welcome";
            hello.textContent = `Ciao, ${user.firstName || user.displayName || "utente"}`; //carico il welcome

            if (brand) {
                const existingWelcome = brand.querySelector(".nav-welcome");
                if (existingWelcome) existingWelcome.remove();
                brand.append(" ", hello);
            }

            const logout = document.createElement("a");//carico il link logout
            logout.href = "/api/v1/auth/logout";
            logout.textContent = "Logout";

            authArea.append(logout);
        } else {
            window.dispatchEvent(new CustomEvent("auth-state-change", { detail: null }));
        }
        // se non autenticato resta il link "Login With Google" già presente
    } catch (err) {
        // auth-service giù: la navbar resta in stato "non loggato"
        window.dispatchEvent(new CustomEvent("auth-state-change", { detail: null }));
        console.error("Impossibile verificare l'autenticazione:", err);
    }
}

window.addEventListener("DOMContentLoaded", loadNavbar);