import { ErrorLogService } from './error-log';

describe('ErrorLogService', () => {
  it('records an error message without its stack trace', () => {
    const service = new ErrorLogService();
    const error = new Error('request failed');
    error.stack = 'Error: request failed\n at private-function';

    service.log(error, 'Application');

    expect(service.entries()).toHaveLength(1);
    expect(service.entries()[0]).toMatchObject({
      source: 'Application',
      message: 'Error: request failed'
    });
    expect(JSON.stringify(service.entries()[0])).not.toContain('private-function');
  });

  it('keeps newest entries first and clears the in-memory log', () => {
    const service = new ErrorLogService();

    service.log('first', 'Application');
    service.log('second', 'HTTP', 404);

    expect(service.entries().map(entry => entry.message)).toEqual([
      'second',
      'first'
    ]);
    expect(service.entries()[0].status).toBe(404);

    service.clear();

    expect(service.entries()).toEqual([]);
  });
});
