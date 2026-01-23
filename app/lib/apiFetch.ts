export interface ApiFetchOptions extends RequestInit {
  // 추가 옵션이 필요하면 여기에 정의
}

/**
 * JSON 응답을 자동으로 파싱하는 헬퍼 함수
 *
 * @param url - 요청할 URL
 * @param options - fetch 옵션
 * @returns Promise<T> - 파싱된 JSON 데이터
 *
 * @example
 * const categories = await apiFetchJson<Category[]>('/api/category');
 */
export async function apiFetchJson<T>(
  url: string,
  options?: ApiFetchOptions
): Promise<T> {
  const isServer = typeof window === 'undefined';
  const finalUrl = isServer
    ? `${process.env.BASE_URL}${url}`
    : url;

  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
