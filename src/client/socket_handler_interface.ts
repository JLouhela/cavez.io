export interface ISocketHandler {
  connect(): void;
  joinGame(userName: string, roomIndex: number): void;
}
