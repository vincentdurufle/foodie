import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  formData.append('api_key', process.env.HIPPO_API_KEY ?? '');
  try {
    const response = await axios.post(
      `https://api.imghippo.com/v1/upload`,
      formData,
      {
        headers: {
          contentType: 'multipart/form-data',
        },
      }
    );
    if (response.data.success && response.data.status === 200) {
      return NextResponse.json(response.data.data);
    }

    return NextResponse.json(response.data, {
      status: 400,
    });
  } catch (error) {
    console.error(error instanceof AxiosError ? error.response?.data : error);
    return NextResponse.json(error, { status: 400 });
  }
}
