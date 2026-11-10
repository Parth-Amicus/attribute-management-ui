import { getHttpErrorMessage } from './http.interceptor';

describe('getHttpErrorMessage', () => {
  it.each([
    [400, 'Invalid request'],
    [401, 'Please log in'],
    [403, 'Access denied'],
    [404, 'Not found'],
    [500, 'Server error, try again'],
    [503, 'Server error, try again'],
    [0, 'Unable to complete request, try again']
  ])('maps HTTP status %i to a friendly message', (status, message) => {
    expect(getHttpErrorMessage(status)).toBe(message);
  });
});
