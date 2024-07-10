export enum AudioStatus {
  wait = 'wait',
  success = 'success',
  fail = 'fail',
}

export interface AudioInfo {
  id: string;
  fileKey: string;
  status: AudioStatus;
  result: string;
  tag: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAudioRes {
  data: AudioInfo[];
  total: number;
  page: number;
}

export interface UpdateAudioPayload {
  result?: string;
  tag?: string;
}
