import type { NextApiRequest, NextApiResponse } from 'next';
import { type VcJsonType, doParseVc, doValidateVc } from '../../lib/vc';

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  if (request.query.type === 'parse') {
    const data = await doParseVc(request.query.jsonType as VcJsonType);
    response.status(200).json(data);
    return;
  }
  if (request.query.type === 'validate') {
    const data = await doValidateVc(request.query.jsonType as VcJsonType);
    response.status(200).json(data);
    return;
  }
  response.status(404).end();
};

export default handler;
