// ==============================
//  LOGOUT HANDLER
// ==============================
function handleLogout() {
    alert("You have been logged out!");
    window.location.href = "login.html";
}



// ==============================
//  POST FUNCTIONALITY
// ==============================
const postButton = document.getElementById("postButton");
const postContent = document.getElementById("postContent");
const feedArea = document.querySelector(".feed-area");

postButton.addEventListener("click", () => {
    const content = postContent.value.trim();

    if (content === "") {
        alert("Write something before posting!");
        return;
    }

    // Create a new post card
    const newPost = document.createElement("article");
    newPost.classList.add("card", "post-card");

    newPost.innerHTML = `
        <div class="post-top">
            <div class="avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                </svg>
            </div>
            <div>
                <strong>You</strong>
                <span>Just now · #NewPost</span>
            </div>
        </div>

        <div class="post-content">
            <p>${content}</p>
        </div>

        <div class="post-actions">
            <a href="#"><span class="heart">❤</span> 0 Likes</a>
            <a href="#">💬 0 Comments</a>
        </div>
    `;

    // Insert new post at top of feed (below search + create post card)
    const createPostCard = document.querySelector(".create-post-card");
    feedArea.insertBefore(newPost, createPostCard.nextSibling);

    // Clear textarea
    postContent.value = "";
});
