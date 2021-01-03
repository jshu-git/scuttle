const playAgain = (G, ctx, id) => {
    G.gameOver.playAgain.push(id);
};

const setNewRoom = (G, ctx, roomID) => {
    G.gameOver.newRoomID = roomID;
};

export { playAgain, setNewRoom };
