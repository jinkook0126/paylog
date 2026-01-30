import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addTransaction } from '../transaction';

const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;

describe('addTransaction (거래 추가)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    process.env.BASE_URL = 'http://test';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => undefined,
    });
  });

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch);
  });

  it('POST /api/transaction 호출 + body에 거래 데이터 직렬화', async () => {
    const transaction = {
      name: '커피',
      category: 1,
      amount: 4500,
      memo: '스타벅스',
      picture: null,
      paymentMethod: 'card',
      created_at: new Date('2025-01-15T12:00:00.000Z'),
    };

    await addTransaction(transaction);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test/api/transaction',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body as string);
    expect(body).toMatchObject({
      name: '커피',
      category: 1,
      amount: 4500,
      memo: '스타벅스',
      picture: null,
      paymentMethod: 'card',
    });
    expect(body.created_at).toBeDefined();
  });

  it('응답 ok false면 에러 throw', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(addTransaction({
      name: 'a',
      category: 1,
      amount: 1000,
      memo: null,
      picture: null,
      paymentMethod: 'card',
      created_at: new Date(),
    })).rejects.toThrow(/HTTP error! status: 500/);
  });
});
