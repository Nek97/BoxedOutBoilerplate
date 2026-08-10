import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from '@nestjs/common';
import { ValidationExceptionFilter } from '../filters/validation-exception.filter';
import { InputValidationError } from '../input-validation.error';
import { AgGridError } from '@nestjs-yalc/ag-grid/ag-grid.error';

describe('ValidationExceptionFilter', () => {
  const logger = createMock<LoggerService>();
  it('should received error to InputValidationError', () => {
    const filter = new ValidationExceptionFilter(logger);
    const result = filter.catch(new Error());
    expect(result).toBeInstanceOf(InputValidationError);
  });

  it('should received error to AgGridError', () => {
    const error: AgGridError = new AgGridError('message', 'systemMessage');
    const filter = new ValidationExceptionFilter(logger);
    filter.catch(error);
    expect(logger.error).toHaveBeenCalledWith(error.systemMessage, error.stack);
  });
});
