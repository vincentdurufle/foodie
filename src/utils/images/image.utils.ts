import { ChangeEvent } from 'react';
import axios from 'axios';

type ImgHippo = {
  title: string;
  url: string;
  view_url: string;
  extension: string;
  size: number;
  created_at: Date;
};

const getImgHippo = (filename?: string) => {
  if (filename) {
    return `https://i.imghippo.com/files/${filename}`;
  }

  return 'https://placehold.co/400?text=No+image';
};

const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files) {
    throw new Error('No files selected');
  }
  const formData = new FormData();
  formData.append('file', event.target.files[0]);
  formData.append('title', event.target.files[0].name);
  const { data } = await axios.post<ImgHippo>('/api/images', formData, {
    headers: {
      contentType: 'multipart/form-data',
    },
  });

  const match = data.url.match(/[^/]*$/);

  if (!match) {
    throw new Error('No filename');
  }

  return {
    filename: match[0],
    extension: data.extension,
    size: data.size,
    title: data.title ?? '',
  };
};

export { uploadImage, getImgHippo };
