console.log("Profile.js loaded");

const API_BASE = "http://localhost:5000/api";

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: "Bearer " + token } : {};
}

async function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.querySelector("#profileName").textContent = user.username;
    document.querySelector("#profileEmail").textContent = user.email;

    loadUserPosts(user._id);
}

async function loadUserPosts(userId) {
    const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
        headers: { ...authHeader() }
    });

    const posts = await res.json();
    const container = document.querySelector("#profilePosts");
    container.innerHTML = "";

    if (!posts.length) {
        container.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    posts.forEach(p => {
        const div = document.createElement("div");
        div.className = "card post-card";

        div.innerHTML = `
            <p>${p.caption}</p>
            ${p.media ? `<img src="${p.media}" style="width:100%;border-radius:8px">` : ""}
            <p>❤️ ${p.likes.length} — 💬 ${p.commentsCount}</p>
        `;

        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadProfile);
