/* istanbul ignore file */
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { KafkaJSError } from 'kafkajs';
import { Observable } from 'rxjs';

@Catch(RpcException, Error)
export class KafkaExceptionFilter extends BaseRpcExceptionFilter {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  catch(_exception: any, _host: ArgumentsHost): Observable<any> {
    // eslint-disable-next-line no-console
    console.error(_exception, _host);
    throw new KafkaJSError();
  }
}
