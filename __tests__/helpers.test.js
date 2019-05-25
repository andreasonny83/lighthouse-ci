const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const { clean, createDir, scoreReducer } = require('../lib/helpers');

jest.mock('rimraf');
jest.mock('mkdirp');

describe('helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('clean', () => {
    it('should return a promise', () => {
      // Arrange
      const res = clean();

      // Assert
      expect(res).toBeInstanceOf(Promise);
    });

    it('should reject the promise if an error if present', () => {
      // Arrange
      const expectedError = 'err';
      rimraf.mockImplementation((target, callback) => callback(expectedError));

      // Act
      const res = clean();

      // Assert
      expect(res).rejects.toEqual(expectedError);
    });

    it('should try to remove a "lighthouse" folder', () => {
      // Arrange
      const expectedFolderName = './lighthouse/';
      rimraf.mockImplementation((target, callback) => {
        expect(target).toEqual(expectedFolderName);
        callback();
      });

      // Act
      const res = clean();

      // Assert
      expect(res).resolves.toEqual();
      expect(rimraf).toHaveBeenCalledWith(
        expectedFolderName,
        expect.any(Function),
      );
    });
  });

  describe('createDir', () => {
    it('should return a promise', () => {
      // Arrange
      const res = createDir();

      // Assert
      expect(res).toBeInstanceOf(Promise);
    });

    it('should reject the promise if an error if present', () => {
      // Arrange
      const expectedError = 'err';
      mkdirp.mockImplementation((target, callback) => callback(expectedError));

      // Act
      const res = createDir();

      // Assert
      expect(res).rejects.toEqual(expectedError);
    });

    it('should try to create a "lighthouse" folder', () => {
      // Arrange
      const expectedFolderName = './lighthouse';
      mkdirp.mockImplementation((target, callback) => {
        expect(target).toEqual(expectedFolderName);
        callback();
      });

      // Act
      const res = createDir();

      // Assert
      expect(res).resolves.toEqual();
      expect(mkdirp).toHaveBeenCalledWith(
        expectedFolderName,
        expect.any(Function),
      );
    });
  });

  describe('scoreReducer', () => {
    it('should return a score if present in the flags', () => {
      // Arrange
      const expectedScore = 'testScore';
      const mockFlags = { score: expectedScore };

      // Act
      const res = scoreReducer(mockFlags);

      // Assert
      expect(res).toEqual(expectedScore);
    });

    it('should return an object of only known flags', () => {
      // Arrange
      const mockFlags = {
        performance: '10',
        accessibility: '90',
        test: '10',
      };
      const mockScores = ['performance', 'pwa', 'accessibility'];
      const expectedRes = { accessibility: '90', performance: '10' };

      // Act
      const res = scoreReducer(mockFlags, mockScores);

      // Assert
      expect(res).toEqual(expectedRes);
    });
  });
});
