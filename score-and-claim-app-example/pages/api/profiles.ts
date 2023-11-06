import type { NextApiRequest, NextApiResponse } from 'next';
import { doClaimVc, doEvaluateScore, doEvaluateOwnScore } from '../../lib/vc';

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  switch (request.query.type) {
    case 'claimVc': {
      const data = await doClaimVc();
      response.status(200).json(data);
      return;
    }
    case 'evaluateScore': {
      const data = await doEvaluateScore();
      response.status(200).json(data);
      return;
    }
    case 'evaluateOwnScore': {
      const data = await doEvaluateOwnScore();
      response.status(200).json(data);
      return;
    }
  }

  response.status(404).end();
};

export default handler;
