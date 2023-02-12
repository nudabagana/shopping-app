import limitService from './limit.service';

describe('LimitService', () => {
  it('0-100 should pass"', () => {
    expect(() => limitService.validateTotal(50)).not.toThrowError();
  });

  it('101 should throw"', () => {
    expect(() => limitService.validateTotal(101)).toThrowError();
  });

  it('-1 should throw"', () => {
    expect(() => limitService.validateTotal(101)).toThrowError();
  });
});
