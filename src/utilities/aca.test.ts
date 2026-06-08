import { acaToParams } from './aca';

describe('acaToParams', () => {
  it('returns params unchanged when ACA is undefined', () => {
    const params = { foo: 'bar' };
    const result = acaToParams(params, undefined);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('adds ACA and redirect=false when ACA is provided', () => {
    const params = { foo: 'bar' };
    const result = acaToParams(params, 'token-xyz');
    expect(result).toEqual({ foo: 'bar', ACA: 'token-xyz', redirect: false });
  });

  it('mutates the first argument (returns same reference)', () => {
    const params: Record<string, unknown> = {};
    const result = acaToParams(params, 'token-xyz');
    expect(result).toBe(params);
    expect(params).toHaveProperty('ACA', 'token-xyz');
  });

  it('overwrites pre-existing ACA / redirect keys', () => {
    const params = { ACA: 'old', redirect: true };
    const result = acaToParams(params, 'new');
    expect(result).toEqual({ ACA: 'new', redirect: false });
  });
});
