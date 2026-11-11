async function loadWelcomeGif() {
  const welcomeContent = document.getElementById("welcome-content");

  if (!welcomeContent) {
    return;
  }

  const sampleJson = {
    status: "ok",
    message: "Login completato con successo",
    user: {
      name: "Mario Rossi",
      role: "admin",
      authenticated: true
    },
    meta: {
      timestamp: new Date().toISOString(),
      environment: "development"
    }
  };

  const hideWelcome = () => {
    welcomeContent.innerHTML = "";
  };

  const renderGif = (userName = "amico") => {
    welcomeContent.innerHTML = "";

    const box = document.createElement("div");
    box.className = "welcome-box";

    const title = document.createElement("div");
    title.className = "welcome-title";
    title.textContent = `Benvenuto, ${userName}`;

    const img = document.createElement("img");
    img.src = "https://media1.tenor.com/m/51BTuWL-8gIAAAAd/belly-dance.gif";
    img.alt = "Welcome Gif";
    img.className = "welcome-gif";
    img.loading = "eager";
    img.decoding = "async";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "show-json-button";
    button.textContent = "Mostra JSON";

    const jsonPanel = document.createElement("pre");
    jsonPanel.id = "json-panel";
    jsonPanel.className = "json-panel";
    jsonPanel.hidden = true;
    jsonPanel.setAttribute("aria-live", "polite");

    button.addEventListener("click", () => {
      jsonPanel.textContent = JSON.stringify(sampleJson, null, 2);
      jsonPanel.hidden = false;
    });

    box.appendChild(title);
    box.appendChild(img);
    box.appendChild(button);
    box.appendChild(jsonPanel);
    welcomeContent.appendChild(box);
  };

  try {
    const response = await fetch("/api/v1/auth/me");

    if (!response.ok) {
      hideWelcome();
      return;
    }

    const user = await response.json();

    if (user && user.authenticated) {
      renderGif(user.firstName || user.displayName || "utente");
      return;
    }

    hideWelcome();
  } catch (err) {
    console.error("Auth check failed, hiding welcome panel:", err);
    hideWelcome();
  }
}

window.addEventListener("auth-state-change", (event) => {
  const user = event.detail;
  const welcomeContent = document.getElementById("welcome-content");

  if (!welcomeContent) {
    return;
  }

  if (user && user.authenticated) {
    welcomeContent.innerHTML = "";
    const name = user.firstName || user.displayName || "utente";

    const box = document.createElement("div");
    box.className = "welcome-box";

    const title = document.createElement("div");
    title.className = "welcome-title";
    title.textContent = `Benvenuto, ${name}`;

    const img = document.createElement("img");
    img.src = "https://media1.tenor.com/m/51BTuWL-8gIAAAAd/belly-dance.gif";
    img.alt = "Welcome Gif";
    img.className = "welcome-gif";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "show-json-button";
    button.textContent = "Mostra JSON";

    const jsonPanel = document.createElement("pre");
    jsonPanel.className = "json-panel";
    jsonPanel.hidden = true;
    jsonPanel.setAttribute("aria-live", "polite");

    button.addEventListener("click", () => {
      jsonPanel.textContent = JSON.stringify({
        status: "ok",
        message: "Login completato con successo",
        user: {
          name,
          authenticated: true
        }
      }, null, 2);
      jsonPanel.hidden = false;
    });

    box.appendChild(title);
    box.appendChild(img);
    box.appendChild(button);
    box.appendChild(jsonPanel);
    welcomeContent.appendChild(box);
    return;
  }

  welcomeContent.innerHTML = "";
});

document.addEventListener("DOMContentLoaded", loadWelcomeGif);