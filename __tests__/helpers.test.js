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

  describe('getOwnProps', () => {
    it('should return all own props', () => {
      // Arrange
      const expectedProp = 'foo';
      const mockObj = { foo: 0 };

      // Act
      const res = getOwnProps(mockObj);

      // Assert
      expect(res).not.toBeNull();
      expect(res).toContain(expectedProp);
      expect(res).toHaveLength(1);
    });

    it('should not return inherited props', () => {
      // Arrange
      const expectedProp = 'foo';

      const Func = function() {
        this.foo = 1;
      };

      const input = new Func();

      Func.prototype.bar = 2;

      // Act
      const res = getOwnProps(input);

      // Assert
      expect(res).not.toBeNull();
      expect(res).toContain(expectedProp);
      expect(res).toHaveLength(1);
    });
  });

  describe('createDefaultConfig', () => {
    it('should not override existing config', () => {
      // Arrange
      const expectedConfig = { foo: 1, bar: 2 };

      // Act
      const res = createDefaultConfig(expectedConfig);

      // Assert
      expect(res).toEqual(expectedConfig);
    });

    it('should set `extends` and `settings`', () => {
      // Arrange
      const expectedExtends = 'lighthouse:default';

      // Act
      const res = createDefaultConfig();

      // Assert
      expect(res.extends).toEqual(expectedExtends);
      expect(res.settings).not.toBeNull();
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
      const res = convertToBudgetList(input);

      // Assert
      expect(res).toHaveLength(2);
      expect(res).toEqual(expected);
    });
  });

  describe('convertToResourceKey', () => {
    it('Should convert `sizes` to `resourceSizes`', () => {
      // Arrange
      const expected = 'resourceSizes';

      const input = 'sizes';

      // Act
      const res = convertToResourceKey(input);

      // Assert
      expect(res).toEqual(expected);
    });
  });
});
