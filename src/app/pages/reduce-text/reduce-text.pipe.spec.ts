import { ReduceTextPipe } from "./reduce-text.pipe";

describe('Test Pipe - ReduceTextPipe', () => {
  let reduceTextPipe: ReduceTextPipe

  beforeEach(() => {
    reduceTextPipe = new ReduceTextPipe()
  });

  it('should create ReduceTextPipe', () => {
    expect(reduceTextPipe).toBeTruthy()
  });

  it('Use transform correctly', () => {
    const text = 'Hello, this is a text to test ReduceTextPipe pipe'

    const newText = reduceTextPipe.transform(text, 5)

    expect(newText.length).toEqual(5)
  });
});