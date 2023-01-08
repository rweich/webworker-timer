import { expect } from 'chai';

import { clearInterval, clearTimeout, setInterval, setTimeout } from '../src';

describe('test setTimeout', () => {
  it('should call the timeout function', (done) => {
    setTimeout(done, 0);
  });
  it('should return the timer id', (done) => {
    expect(setTimeout(done, 0)).to.be.greaterThanOrEqual(1);
  });
  it('should call the function after the specified time', (done) => {
    const start = performance.now();
    setTimeout(() => {
      expect(performance.now() - start).to.be.greaterThanOrEqual(100);
      done();
    }, 100);
  });
});

describe('test clearTimeout', () => {
  it('should cancel the timeout', (done) => {
    clearTimeout(
      setTimeout(() => {
        throw new Error('did not cancel');
      }, 50),
    );
    setTimeout(done, 100);
  });
});

describe('test setInterval', () => {
  it('should call the interval function', (done) => {
    const id = setInterval(() => {
      clearInterval(id);
      done();
    }, 0);
  });
  it('should return the interval id', (done) => {
    const id = setInterval(() => {
      clearInterval(id);
      done();
    }, 0);
    expect(id).to.be.greaterThanOrEqual(1);
  });
  it('should call the function after the specified time', (done) => {
    const start = performance.now();
    let count = 1;
    const id = setInterval(() => {
      expect(performance.now() - start).to.be.greaterThanOrEqual(100 * count);
      if (++count > 3) {
        clearInterval(id);
        done();
      }
    }, 100);
  });
});

describe('test clearInterval', () => {
  it('should cancel the interval', (done) => {
    clearInterval(
      setInterval(() => {
        throw new Error('did not cancel');
      }, 150),
    );
    setTimeout(done, 500);
  });
  it('should cancel the interval after the 1st run', (done) => {
    let wassCalled = false;
    const timerId = setInterval(() => {
      if (wassCalled) {
        throw new Error('was not cleared');
      }
      wassCalled = true;
      clearInterval(timerId);
      setTimeout(done, 100);
    }, 50);
  });
});
