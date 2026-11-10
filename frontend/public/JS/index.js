async function loadWelcomeGif() {
  const welcomeContent = document.getElementById("welcome-content");

  if (!welcomeContent) {
    return;
  }

  const renderGif = () => {
    const box = document.createElement("div");
    box.className = "welcome-box";

    const img = document.createElement("img");
    img.src = "https://media1.tenor.com/m/51BTuWL-8gIAAAAd/belly-dance.gif";
    img.alt = "Welcome Gif";
    img.className = "welcome-gif";
    img.loading = "eager";
    img.decoding = "async";

    box.appendChild(img);
    welcomeContent.innerHTML = "";
    welcomeContent.appendChild(box);
  };

  try {
    const response = await fetch("/api/v1/auth/me");

    if (response.ok) {
      const user = await response.json();

      if (user && user.authenticated) {
        renderGif();
        return;
      }
    }
  } catch (err) {
    console.error("Auth check failed, showing welcome GIF anyway:", err);
  }

  renderGif();
}

document.addEventListener("DOMContentLoaded", loadWelcomeGif);