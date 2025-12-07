// socketService.js

const initializeSocketServer = (io, redisClient) => {
    console.log("🔥 Socket server initialized");

    io.on("connection", async (socket) => {
        console.log("🟢 User connected:", socket.id);

        // ---- 1) When a user joins the chat ----
        socket.on("join_chat", async (userData) => {
            try {
                const { userId, username, profilePic } = userData;

                // Store user data in Redis
                await redisClient.hSet(`user:${socket.id}`, {
                    userId,
                    username,
                    profilePic
                });

                console.log(`📌 User joined: ${username}`);

                // Store socket in user's room
                socket.join(userId);
            } catch (err) {
                console.error("Redis store error:", err);
            }
        });

        // ---- 2) Handle sending messages ----
        socket.on("send_message", async (data) => {
            try {
                const { roomId, text } = data;

                // Get user data from Redis
                const userInfo = await redisClient.hGetAll(`user:${socket.id}`);

                const messagePayload = {
                    text,
                    senderId: userInfo.userId,
                    username: userInfo.username,
                    profilePic: userInfo.profilePic,
                    timestamp: Date.now()
                };

                console.log("📨 Sending message:", messagePayload);

                // Emit message to the room
                io.to(roomId).emit("receive_message", messagePayload);
            } catch (err) {
                console.error("❌ Message sending error:", err);
            }
        });

        // ---- 3) On disconnect ----
        socket.on("disconnect", async () => {
            await redisClient.del(`user:${socket.id}`);
            console.log("🔴 User disconnected:", socket.id);
        });
    });
};

module.exports = initializeSocketServer;
