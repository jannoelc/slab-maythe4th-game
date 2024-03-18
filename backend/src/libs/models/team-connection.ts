export interface TeamConnection {
  teamId: string;

  connectionIds: Array<{ id: string; connectionDate: number }>;
}
