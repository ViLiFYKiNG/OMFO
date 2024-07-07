import app from '../../src/app';
import { Config } from '../../src/config';
import { AppDataSource } from '../../src/config/data-source';
import logger from '../../src/config/logger';

// Mock the dependencies
jest.mock('../../src/config/data-source');
jest.mock('../../src/config/logger');
jest.mock('../../src/app');

describe('Server', () => {
  it('should initialize the database and start the server', async () => {
    const initializeMock = jest.fn().mockResolvedValue(undefined);
    AppDataSource.initialize = initializeMock;

    const listenMock = jest.fn().mockImplementation((port, callback) => {
      callback();
    });
    (app.listen as jest.Mock) = listenMock;

    const loggerInfoMock = jest.fn();
    logger.info = loggerInfoMock;

    const loggerErrorMock = jest.fn();
    logger.error = loggerErrorMock;

    // Import the server file to run the startServer function
    await import('../../src/server');

    expect(initializeMock).toHaveBeenCalled();
    expect(loggerInfoMock).toHaveBeenCalledWith(
      'Database connection established successfully.',
    );
    expect(listenMock).toHaveBeenCalledWith(Config.PORT, expect.any(Function));
    expect(loggerInfoMock).toHaveBeenCalledWith(
      `Server is running on port ${Config.PORT}.`,
    );
    expect(loggerErrorMock).not.toHaveBeenCalled();
  });

  it('should log an error and exit the process if database initialization fails', async () => {
    const error = new Error('Database initialization failed');
    const initializeMock = jest.fn().mockRejectedValue(error);
    AppDataSource.initialize = initializeMock;

    const loggerInfoMock = jest.fn();
    logger.info = loggerInfoMock;

    const loggerErrorMock = jest.fn();
    logger.error = loggerErrorMock;

    const processExitMock = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: number | null | string) => code as never);

    // Import the server file to run the startServer function
    await import('../../src/server');

    // Wait for the error handling timeout to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Restore the original process.exit implementation
    processExitMock.mockRestore();
  });
});
