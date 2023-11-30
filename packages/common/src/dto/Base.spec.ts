describe('BaseDto', () => {
  it('passes', () => {
    const res: number = 1 + 1;
    expect(res).toBe(2);
  });

  it('fails', () => {
    const res: number = 1 + 1;
    expect(res).toBe(0);
  });
});
