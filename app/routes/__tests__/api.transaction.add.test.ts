import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ActionFunctionArgs } from 'react-router';

const mockCreate = vi.fn();

vi.mock('~/lib/prisma', () => ({
  prisma: {
    transactions: { create: mockCreate },
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/img.png' } }),
        remove: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  }),
}));

const { action } = await import('../api.transaction');

function postRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/transaction', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/transaction (거래 추가)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('필수 필드(name, category, amount) 없으면 400 반환', async () => {
    const res = await action({ request: postRequest({}) } as ActionFunctionArgs);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing required fields/);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('name 없으면 400 반환', async () => {
    const res = await action({
      request: postRequest({ category: 1, amount: 1000, paymentMethod: 'card' }),
    } as ActionFunctionArgs);
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('category 없으면 400 반환', async () => {
    const res = await action({
      request: postRequest({ name: '커피', amount: 1000, paymentMethod: 'card' }),
    } as ActionFunctionArgs);
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('amount 없으면 400 반환', async () => {
    const res = await action({
      request: postRequest({ name: '커피', category: 1, paymentMethod: 'card' }),
    } as ActionFunctionArgs);
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('유효한 body면 201 + 생성된 거래 반환', async () => {
    const created = {
      id: 1,
      name: '커피',
      category: 1,
      amount: 4500,
      memo: null,
      picture: null,
      paymentMethod: 'card',
      created_at: new Date().toISOString(),
      categories: { id: 1, name: '식비', icon: '🍜', type: 'expense' },
    };
    mockCreate.mockResolvedValue(created);

    const body = {
      name: '커피',
      category: 1,
      amount: 4500,
      paymentMethod: 'card',
      created_at: new Date().toISOString(),
    };
    const res = await action({ request: postRequest(body) } as ActionFunctionArgs);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toMatchObject({ id: 1, name: '커피', category: 1, amount: 4500 });
    expect(json.categories).toEqual({ id: 1, name: '식비', icon: '🍜', type: 'expense' });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: '커피',
        category: 1,
        amount: 4500,
        memo: null,
        picture: null,
        paymentMethod: 'card',
      }),
      include: expect.objectContaining({
        categories: { select: { id: true, name: true, icon: true, type: true } },
      }),
    });
  });

  it('memo 포함 시 DB에 memo 저장', async () => {
    mockCreate.mockResolvedValue({
      id: 1,
      name: '점심',
      category: 1,
      amount: 8000,
      memo: '맛집',
      picture: null,
      paymentMethod: 'card',
      created_at: new Date().toISOString(),
      categories: { id: 1, name: '식비', icon: '🍜', type: 'expense' },
    });

    const body = {
      name: '점심',
      category: 1,
      amount: 8000,
      memo: '맛집',
      paymentMethod: 'card',
      created_at: new Date().toISOString(),
    };
    await action({ request: postRequest(body) } as ActionFunctionArgs);

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ memo: '맛집' }),
      include: expect.any(Object),
    });
  });

  it('잘못된 category(FK 제약)면 400 + Invalid category ID', async () => {
    mockCreate.mockRejectedValue(new Error('Foreign key constraint failed'));

    const res = await action({
      request: postRequest({
        name: '테스트',
        category: 99999,
        amount: 1000,
        paymentMethod: 'card',
        created_at: new Date().toISOString(),
      }),
    } as ActionFunctionArgs);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid category ID/);
  });
});
