import { getPreferredRegion } from '@/app/api/config';
import { createErrorResponse } from '@/app/api/errorResponse';
import { ChatCompletionErrorPayload } from '@/libs/agent-runtime';
import { ChatErrorType } from '@/types/fetch';
import { ChatStreamPayload } from '@/types/openai/chat';
import { getTracePayload } from '@/utils/trace';

import AgentRuntime from '../agentRuntime';
import { checkAuth } from '../auth';

export const runtime = 'edge';

export const preferredRegion = getPreferredRegion();

export const POST = checkAuth(async (req: Request, { params, jwtPayload }) => {
  const { provider } = params;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const concatenateUint8Arrays = (arrays: any[]) => {
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    let result = new Uint8Array(totalLength);
    let length = 0;
    for (let array of arrays) {
      result.set(array, length);
      length += array.length;
    }
    return result;
  }

  try {
    // ============  1. init chat model   ============ //
    const agentRuntime = await AgentRuntime.initializeWithUserPayload(provider, jwtPayload);

    // ============  2. create chat completion   ============ //

    if (!req.body) throw new Error('Request body is null');
    let dataChunks = [];
    const reader = req.body.getReader();
    let reading = true;
    while (reading) {
      const { done, value } = await reader.read();
      if (done) {
        reading = false;
      } else {
        dataChunks.push(value);
      }
    }
    const fullMessage = new TextDecoder().decode(concatenateUint8Arrays(dataChunks));
    const data = JSON.parse(fullMessage) as ChatStreamPayload;

    const tracePayload = getTracePayload(req);

    return await agentRuntime.chat(data, {
      enableTrace: tracePayload?.enabled,
      provider,
      trace: tracePayload,
    });
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;
    // track the error at server side
    console.error(`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});
