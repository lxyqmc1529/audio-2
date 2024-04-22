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
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAudioRes {
  data: AudioInfo[];
  total: number;
  page: number;
}

export interface UpdateAudioPayload {
  result: string;
}
