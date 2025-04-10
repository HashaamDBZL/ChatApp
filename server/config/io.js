export const server = http.createServer(app);
export const io = socketIO(server, {
  cors: {
    origin: "*", // adjust as needed
  },
});
