/* ---------------------------------------------------------
   SocioSphere — FINAL UPDATED script.js (LIKE + COMMENT added)
--------------------------------------------------------- */

console.log("SocioSphere script.js loaded");

/* =============== CONFIG =============== */
const API_BASE = "http://localhost:5000/api";
const CLOUD_NAME = "dzp4fps06";
const UPLOAD_PRESET = "socio_unsigned";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

/* =============== HELPERS =============== */
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: "Bearer " + token } : {};
}
function showToast(msg) { alert(msg); }
function requireLogin() {
  if (!localStorage.getItem("token")) {
    showToast("You must be logged in.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}
function safeQuery(q) { return document.querySelector(q); }

/* =============== ELEMENTS =============== */
const postButton = safeQuery("#postButton");
const mediaInput = safeQuery("#mediaInput");
const previewModal = safeQuery("#previewModal");
const mediaPreview = safeQuery("#mediaPreview");
const captionInput = safeQuery("#captionInput");
const confirmPostBtn = safeQuery("#confirmPost");
const statusBox = safeQuery("#status");
const postContentInput = safeQuery("#postContent");
const feedArea = safeQuery(".feed-area");
const headerAvatarInitials = safeQuery("#headerAvatarInitials");

/* =============== CLOUDINARY UPLOAD =============== */
async function uploadToCloudinary(file) {
  if (!file) return null;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  try {
    const r = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
    const data = await r.json();
    if (!data.secure_url) {
      console.error("Cloudinary error:", data);
      return null;
    }
    return data.secure_url;
  } catch (err) {
    console.error("Upload error", err);
    return null;
  }
}

/* =============== BACKEND CALLS =============== */
async function apiCreatePost({ caption, media }) {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ caption, media })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Failed to create post");
      return null;
    }
    return data;
  } catch (err) {
    showToast("Server error");
    return null;
  }
}

async function apiFetchFeed() {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      headers: { ...authHeader() }
    });

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Fetch Feed Error:", err);
    return [];
  }
}

async function apiToggleLike(postId) {
  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() }
  });
  return res.json();
}

async function apiAddComment(postId, text) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ text })
  });
  return res.json();
}

/* =============== RENDER POST =============== */
function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "card post-card";

  const user = post.author?.username || "User";
  const time = new Date(post.createdAt).toLocaleString();

  let mediaHtml = "";
  if (post.media) {
    if (post.media.includes(".mp4") || post.media.includes("video")) {
      mediaHtml = `
        <video controls style="width:100%;border-radius:8px;margin-top:10px">
          <source src="${post.media}">
        </video>`;
    } else {
      mediaHtml = `
        <img src="${post.media}" style="width:100%;border-radius:8px;margin-top:10px">`;
    }
  }

  const isLiked = post.likes?.includes(JSON.parse(localStorage.getItem("user"))?._id);

  article.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="post-avatar">${user[0]}</div>
      <div>
        <strong>${user}</strong><br>
        <small>${time}</small>
      </div>
    </div>

    <p style="margin-top:10px;">${post.caption || ""}</p>

    ${mediaHtml}

    <div style="margin-top:10px; display:flex; gap:20px; font-size:20px;">
      <span class="like-btn" data-id="${post._id}" style="cursor:pointer;">
        ${isLiked ? "❤️" : "🤍"} ${post.likes.length}
      </span>

      <span class="comment-btn" data-id="${post._id}" style="cursor:pointer;">
        💬 ${post.commentsCount}
      </span>
    </div>

    <div class="comment-box" style="margin-top:10px; display:none;">
      <input class="comment-input" data-id="${post._id}"
        placeholder="Write a comment..."
        style="width:100%; padding:6px; border-radius:5px;">
    </div>
  `;

  return article;
}

/* =============== RENDER FEED =============== */
async function renderFeed() {
  if (!feedArea) return;

  feedArea.querySelectorAll(".post-card").forEach(el => el.remove());

  const posts = await apiFetchFeed();
  const createCard = feedArea.querySelector(".create-post-card");

  posts.forEach(post => {
    const card = createPostCard(post);
    feedArea.insertBefore(card, createCard.nextSibling);
  });

  attachLikeHandlers();
  attachCommentHandlers();
}

/* =============== LIKE HANDLING =============== */
function attachLikeHandlers() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const r = await apiToggleLike(id);
      await renderFeed();
    });
  });
}

/* =============== COMMENT HANDLING =============== */
function attachCommentHandlers() {
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.id;
      const box = btn.parentElement.nextElementSibling;
      box.style.display = box.style.display === "none" ? "block" : "none";

      const input = box.querySelector(".comment-input");
      input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          await apiAddComment(postId, input.value.trim());
          input.value = "";
          await renderFeed();
        }
      });
    });
  });
}

/* =============== POST CREATION FLOW =============== */
let selectedFile = null;

postButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  mediaInput.value = "";
  mediaInput.click();
});

mediaInput.addEventListener("change", () => {
  const f = mediaInput.files[0];
  if (!f) return;

  selectedFile = f;
  const url = URL.createObjectURL(f);

  mediaPreview.innerHTML = f.type.startsWith("video")
    ? `<video controls style="width:100%;border-radius:8px"><source src="${url}"></video>`
    : `<img src="${url}" style="width:100%;border-radius:8px">`;

  previewModal.style.display = "block";
});

confirmPostBtn.addEventListener("click", async () => {
  if (!selectedFile) return showToast("Choose a file");

  statusBox.innerText = "Uploading media...";

  const uploadedUrl = await uploadToCloudinary(selectedFile);
  if (!uploadedUrl) {
    statusBox.innerText = "";
    return showToast("Upload failed");
  }

  const caption =
    (postContentInput.value.trim() + "\n" + captionInput.value.trim()).trim();

  const newPost = await apiCreatePost({ caption, media: uploadedUrl });
  statusBox.innerText = "";

  if (newPost) {
    showToast("Posted!");
    previewModal.style.display = "none";
    captionInput.value = "";
    postContentInput.value = "";
    selectedFile = null;
    await renderFeed();
  }
});

/* =============== HEADER AVATAR =============== */
function initHeaderAvatar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user) return;

  const name = user.username || user.email || "U";
  headerAvatarInitials.textContent = name.substring(0, 2).toUpperCase();
}
initHeaderAvatar();

/* =============== INIT =============== */
document.addEventListener("DOMContentLoaded", async () => {
  await renderFeed();
});
