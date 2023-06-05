export class RoomConfig {
    public static rooms: { name: string, size: number }[] = [
        {
            name: "Room1",
            size: 8
        },
        {
            name: "Room2",
            size: 8
        },
        {
            name: "Room6",
            size: 8
        }
    ];

    public static getRoomIdByName(roomName) {
        let arrRoom = RoomConfig.rooms;
        for (let i = 0; i < arrRoom.length; i++) {
            if (arrRoom[i].name === roomName) {
                return i;
            }
        }
        return -1;
    }

}