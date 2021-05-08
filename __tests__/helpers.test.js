/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const {
  clean,
  createDir,
  scoreReducer,
  createDefaultConfig,
  getOwnProps,
  convertToBudgetList,
  convertToResourceKey,
} = require('../lib/helpers');

jest.mock('rimraf');
jest.mock('mkdirp');

describe('helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('clean', () => {
    it('should return a promise', () => {
      // Arrange
      const response = clean();

      // Assert
      expect(response).toBeInstanceOf(Promise);
    });

    it('should reject the promise if an error if present', () => {
      // Arrange
      const expectedError = 'err';
      rimraf.mockImplementation((target, callback) => callback(expectedError));

      // Act
      const response = clean();

      // Assert
      expect(response).rejects.toEqual(expectedError);
    });

    it('should try to remove a "lighthouse" folder', () => {
      // Arrange
      const expectedFolderName = './lighthouse/';
      rimraf.mockImplementation((target, callback) => {
        expect(target).toEqual(expectedFolderName);
        callback();
      });

      // Act
      const response = clean();

      // Assert
      expect(response).resolves.toEqual();
      expect(rimraf).toHaveBeenCalledWith(expectedFolderName, expect.any(Function));
    });
  });

  describe('createDir', () => {
    it('should return a promise', () => {
      // Arrange
      const response = createDir();

      // Assert
      expect(response).toBeInstanceOf(Promise);
    });

    it('should reject the promise if an error if present', () => {
      // Arrange
      const expectedError = 'err';
      mkdirp.mockImplementation((target, callback) => callback(expectedError));

      // Act
      const response = createDir();

      // Assert
      expect(response).rejects.toEqual(expectedError);
    });

    it('should try to create a "lighthouse" folder', () => {
      // Arrange
      const expectedFolderName = './lighthouse';
      mkdirp.mockImplementation((target, callback) => {
        expect(target).toEqual(expectedFolderName);
        callback();
      });

      // Act
      const response = createDir();

      // Assert
      expect(response).resolves.toEqual();
      expect(mkdirp).toHaveBeenCalledWith(expectedFolderName, expect.any(Function));
    });
  });

  describe('scoreReducer', () => {
    it('should return a score if present in the flags', () => {
      // Arrange
      const expectedScore = 'testScore';
      const mockFlags = { score: expectedScore };

      // Act
      const response = scoreReducer(mockFlags);

      // Assert
      expect(response).toEqual(expectedScore);
    });

    it('should return an object of only known flags', () => {
      // Arrange
      const mockFlags = {
        performance: '10',
        accessibility: '90',
        test: '10',
      };
      const mockScores = ['performance', 'pwa', 'accessibility'];
      const expectedResponse = { accessibility: '90', performance: '10' };

      // Act
      const response = scoreReducer(mockFlags, mockScores);

      // Assert
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getOwnProps', () => {
    it('should return all own props', () => {
      // Arrange
      const expectedProp = 'foo';
      const mockObject = { foo: 0 };

      // Act
      const response = getOwnProps(mockObject);

      // Assert
      expect(response).not.toBeNull();
      expect(response).toContain(expectedProp);
      expect(response).toHaveLength(1);
    });

    it('should not return inherited props', () => {
      // Arrange
      const expectedProp = 'foo';

      const Func = function () {
        this.foo = 1;
      };

      const input = new Func();

      Func.prototype.bar = 2;

      // Act
      const response = getOwnProps(input);

      // Assert
      expect(response).not.toBeNull();
      expect(response).toContain(expectedProp);
      expect(response).toHaveLength(1);
    });
  });

  describe('createDefaultConfig', () => {
    it('should not override existing config', () => {
      // Arrange
      const expectedConfig = { foo: 1, bar: 2 };

      // Act
      const response = createDefaultConfig(expectedConfig);

      // Assert
      expect(response).toEqual(expectedConfig);
    });

    it('should set `extends` and `settings`', () => {
      // Arrange
      const expectedExtends = 'lighthouse:default';

      // Act
      const response = createDefaultConfig();

      // Assert
      expect(response.extends).toEqual(expectedExtends);
      expect(response.settings).not.toBeNull();
    });
  });

  describe('convertToBudgetList', () => {
    it('Should return list of objects in specified format', () => {
      // Arrange
      const expected = [
        {
          resourceType: 'script',
          budget: 1,
        },
        {
          resourceType: 'total',
          budget: 2,
        },
      ];

      const input = { script: 1, total: 2 };

      // Act
      const response = convertToBudgetList(input);

      // Assert
      expect(response).toHaveLength(2);
      expect(response).toEqual(expected);
    });
  });

  describe('convertToResourceKey', () => {
    it('Should convert `sizes` to `resourceSizes`', () => {
      // Arrange
      const expected = 'resourceSizes';

      const input = 'sizes';

      // Act
      const response = convertToResourceKey(input);

      // Assert
      expect(response).toEqual(expected);
    });
  });
});
