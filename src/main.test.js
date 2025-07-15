/**
 * @jest-environment jsdom
 */

require('aframe');

describe('Vestigium', () => {
  let scene;

  beforeEach(() => {
    scene = document.createElement('a-scene');
    document.body.appendChild(scene);
  });

  afterEach(() => {
    document.body.removeChild(scene);
  });

  test('should create a-scene element', () => {
    expect(scene).toBeDefined();
  });
});
