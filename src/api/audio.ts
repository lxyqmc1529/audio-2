import type { AudioInfo, GetAllAudioRes, UpdateAudioPayload } from '@/api/model';
import { request } from '@/utils/request';

const Api = {
  Upload: '/audio/upload',
  Detect: '/audio/detect',
  List: '/audio/list',
  UpdateAudio: '/audio/:id',
  GetAll: '/audio/getAll'
};

export function uploadAudio(payload: FormData) {
  return request.post<AudioInfo[]>({
    url: Api.Upload,
    data: payload,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 5 * 60 * 1000,
  });
}

export function detectAudio(payload: { ids: string[] }) {
  return request.post<AudioInfo[]>({
    url: Api.Detect,
    data: payload,
  });
}

export function listDetect(page: number, limit: number) {
  return request.get<GetAllAudioRes>({
    url: Api.List,
    params: { page, limit },
  });
}

export function updateAudio(id: string, payload: UpdateAudioPayload) {
  return request.post<GetAllAudioRes>({
    url: Api.UpdateAudio.replace(/:id/, id),
    data: payload,
  });
}

export function getAllDetect() {
  return request.get<AudioInfo[]>({
    url: Api.GetAll,
  })
}