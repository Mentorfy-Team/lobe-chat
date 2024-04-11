import { getPreferredRegion } from '@/app/api/config';
import { createErrorResponse } from '@/app/api/errorResponse';
import { LOBE_CHAT_AUTH_HEADER, OAUTH_AUTHORIZED } from '@/const/auth';
import { AgentRuntimeError, ChatCompletionErrorPayload } from '@/libs/agent-runtime';
import { ChatErrorType } from '@/types/fetch';
import { ChatStreamPayload } from '@/types/openai/chat';
import { getTracePayload } from '@/utils/trace';

import { checkAuthMethod, getJWTPayload } from '../auth';
import AgentRuntime from './agentRuntime';

export const runtime = 'edge';

export const preferredRegion = getPreferredRegion();

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

export const POST = async (req: Request, { params }: { params: { provider: string } }) => {
  const { provider } = params;

  

  try {
    // ============  1. init chat model   ============ //

    // get Authorization from header
    const authorization = req.headers.get(LOBE_CHAT_AUTH_HEADER);
    const oauthAuthorized = !!req.headers.get(OAUTH_AUTHORIZED);

    if (!authorization) throw AgentRuntimeError.createError(ChatErrorType.Unauthorized);

    // check the Auth With payload
    const jwtPayload = await getJWTPayload(authorization);
    checkAuthMethod(jwtPayload.accessCode, jwtPayload.apiKey, oauthAuthorized);

    const body = await req.clone().json();
    const agentRuntime = await AgentRuntime.initializeWithUserPayload(provider, jwtPayload, {
      apiVersion: jwtPayload.azureApiVersion,
      model: body.model,
      useAzure: jwtPayload.useAzure,
    });

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
};