import api from '../../services/api';

jest.mock('../../utils/storage', () => ({
  getToken: jest.fn(() => Promise.resolve('mock-access-token')),
  saveToken: jest.fn(),
  clearToken: jest.fn(),
  clearAllTokens: jest.fn(),
}));

global.fetch = jest.fn();

const mockFetch = (status, body) => {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValueOnce(body),
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('api client', () => {
  test('GET request builds correct URL', async () => {
    mockFetch(200, { data: 'ok' });
    await api.get('/test/');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/test/'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  test('POST request sends body as JSON', async () => {
    mockFetch(200, { data: 'ok' });
    await api.post('/test/', { name: 'foo' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'foo' }),
      }),
    );
  });

  test('PATCH request uses PATCH method', async () => {
    mockFetch(200, { data: 'ok' });
    await api.patch('/test/', { field: 'val' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  test('DELETE request uses DELETE method', async () => {
    mockFetch(200, { data: 'ok' });
    await api.delete('/test/');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  test('injects Authorization header when auth=true', async () => {
    mockFetch(200, { data: 'ok' });
    await api.get('/members/me/');
    const calls = global.fetch.mock.calls[0];
    const headers = calls[1].headers;
    expect(headers['Authorization']).toContain('Bearer');
  });

  test('omits Authorization header when auth=false', async () => {
    mockFetch(200, { data: 'ok' });
    await api.post('/auth/login/', { email: 'a@b.com', password: 'x' }, false);
    const calls = global.fetch.mock.calls[0];
    const headers = calls[1].headers;
    expect(headers['Authorization']).toBeUndefined();
  });

  test('sets Content-Type header', async () => {
    mockFetch(200, { data: 'ok' });
    await api.get('/test/');
    const headers = global.fetch.mock.calls[0][1].headers;
    expect(headers['Content-Type']).toBe('application/json');
  });

  test('returns parsed JSON on success', async () => {
    mockFetch(200, { status: 'success', data: { id: 1 } });
    const result = await api.get('/test/');
    expect(result).toEqual({ status: 'success', data: { id: 1 } });
  });

  test('throws error with message on HTTP error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValueOnce({ message: 'Bad request' }),
    });
    await expect(api.get('/test/')).rejects.toThrow('Bad request');
  });

  test('throws error with detail field if message missing', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValueOnce({ detail: 'Not found' }),
    });
    await expect(api.get('/test/')).rejects.toThrow('Not found');
  });

  test('throws generic error on non-JSON error response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockRejectedValueOnce(new Error('parse fail')),
    });
    await expect(api.get('/test/')).rejects.toThrow('Request failed (500)');
  });
});
