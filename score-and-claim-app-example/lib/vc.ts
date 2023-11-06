import {
  type ScoreBuilderType,
  Score,
  claimVc,
  credentialDefinitionMap,
  profiles,
  scoreUtils,
} from '@litentry/profiles';
import { pick } from 'lodash';

const basicIdentityVerificationJson = `{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/security/suites/ed25519-2020/v1"],"id":"0xf4a523e5d2582d67baf9c8af8854e8292f69575d9c1a6cc4c590f9516d3aee98","type":["VerifiableCredential"],"credentialSubject":{"id":"f644ec8210a4c1f9187d43fb7c16c129f1868b9aeb7c27a4fd4641b0938c182d","description":"You've identified at least one account/address in both Web2 and Web3.","type":"Basic Identity Verification","assertions":[{"and":[{"src":"$has_web2_account","op":"==","dst":"true"},{"src":"$has_web3_account","op":"==","dst":"true"}]}],"values":[true],"endpoint":"wss://tee-staging.litentry.io"},"issuer":{"id":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77","name":"Litentry TEE Worker","mrenclave":"7CkjyxujHnnw2BZs42yphfGgdvaqR5on55MbPBHoaBzH"},"issuanceTimestamp":1698226602439,"proof":{"createdTimestamp":1698226602439,"type":"Ed25519Signature2020","proofPurpose":"assertionMethod","proofValue":"fa9654e47353983bd61cfb1132af39f5b92055c125467debfe777ac9e30f248be392427495d125948e295a3dd68da93b8d5ea75ec1cdf633255f7411c138ea00","verificationMethod":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77"}}`;
const evmTransactionCountJson = `{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/security/suites/ed25519-2020/v1"],"id":"0x73e5c701cd52079ef57da6434fe8efd1c042c71cc45449f88944ad368956c2ff","type":["VerifiableCredential"],"credentialSubject":{"id":"f644ec8210a4c1f9187d43fb7c16c129f1868b9aeb7c27a4fd4641b0938c182d","description":"Gets the range of number of transactions a user has made for a specific token on all supported networks (invalid transactions are also counted)","type":"EVM/Substrate Transaction Count","assertions":[{"and":[{"src":"$total_txs","op":">=","dst":"0"},{"src":"$total_txs","op":"<","dst":"1"},{"or":[{"src":"$network","op":"==","dst":"Ethereum"}]}]}],"values":[false],"endpoint":"wss://tee-staging.litentry.io"},"issuer":{"id":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77","name":"Litentry TEE Worker","mrenclave":"7CkjyxujHnnw2BZs42yphfGgdvaqR5on55MbPBHoaBzH"},"issuanceTimestamp":1698647202964,"proof":{"createdTimestamp":1698647202965,"type":"Ed25519Signature2020","proofPurpose":"assertionMethod","proofValue":"37083de1c157af112270306eb6479772f2e572c7b5c6bf04ea36f78feccfcfba05de10934a9e52b06a426acd9a6f3b628efa76ffa4c19ab8299184649c4c7d01","verificationMethod":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77"}}`;

export async function doClaimVc(): Promise<string[]> {
  const claimStatus = claimVc({
    definitionId: 'evm-transaction-count',
    verifiableCredential: evmTransactionCountJson,
    claimParams: {}, // this definition requires no claim params
  });

  const messages: string[] = [];

  // Whether it checks up with the definition
  messages.push(`claimStatus.claimed: ${claimStatus.claimed}`);
  // You can access the parsed credential too (if the definition id is valid)
  messages.push(
    `claimStatus.parsedVc: ${JSON.stringify(claimStatus.parsedVc, null, 2)}`
  );

  if (claimStatus.claimed) {
    // Some definitions may also return helpful data extracted from the VC.
    // For example, `evm-transaction-count` will return the lower and upper bound
    // of the user transactions as reported by this VC's `$total_txs` clauses
    const { lowerBound, strictUpperBound } = claimStatus.payload;
    console.log(
      `the VC claims the user has made between ${lowerBound} and ${strictUpperBound} EVM transactions`
    );
    messages.push(
      `the VC claims the user has made between ${lowerBound} and ${strictUpperBound} EVM transactions`
    );
  }

  return messages;
}

export async function doEvaluateScore(): Promise<string[]> {
  // Use Litentry Score
  const profile = profiles['litentry-community-score'];

  const scoring: number = profile.score.evaluate({
    'oneblock-course-completion': { rawCredentialText: null },
    'oneblock-course-outstanding-student': { rawCredentialText: null },
    'oneblock-course-participation': { rawCredentialText: null },
    'evm-version-early-bird': { rawCredentialText: null },
    'eth-holder': { rawCredentialText: null },
    'token-holder-eth': { rawCredentialText: null },
    'basic-identity-verification': {
      rawCredentialText: basicIdentityVerificationJson,
    },
    'ethereum-account-class-of-year': { rawCredentialText: null },
    'evm-transaction-count': { rawCredentialText: null },
    'uniswap-v2-v3-user': { rawCredentialText: null },
    'dot-holder': { rawCredentialText: null },
    'token-holder-dot': { rawCredentialText: null },
    'polkadot-governance-participation': { rawCredentialText: null },
    'lit-holder': { rawCredentialText: null },
    'token-holder-lit': { rawCredentialText: null },
    'litentry-transaction-count': { rawCredentialText: null },
    'wbtc-holder': { rawCredentialText: null },
    'contract-creator': { rawCredentialText: null },
    'join-litentry-discord': { rawCredentialText: null },
    'id-hubber': { rawCredentialText: null },
    'twitter-follower-amount': { rawCredentialText: null },
    'polkadot-decoded-2023': { rawCredentialText: null },
  });
  console.log(`Your Litentry Score is: ${scoring}`);

  // you can get the range of the score from:
  const range = profile.score.range;
  console.log(
    `Litentry Score goes from ${range.minimalGain} up to ${range.maximum}`
  );

  return [
    `Your Litentry Score is: ${scoring}`,
    `Litentry Score goes from ${range.minimalGain} up to ${range.maximum}`,
  ];
}

export async function doEvaluateOwnScore(): Promise<string[]> {
  const myScoreCredentialDefinition = pick(credentialDefinitionMap, [
    'basic-identity-verification',
    'id-hubber',
  ]);

  type JsonString = string;

  type MyScoreCredentialDefinitionsId =
    keyof typeof myScoreCredentialDefinition;

  const myScoreBuilder: ScoreBuilderType<{
    [key in MyScoreCredentialDefinitionsId]: {
      rawCredentialText: JsonString | undefined | null;
    };
  }> = {
    'basic-identity-verification': scoreUtils.ifClaimed(Score.constant(10), {
      id: 'basic-identity-verification',
      claimParams: {},
    }),
    'id-hubber': scoreUtils.ifClaimed(Score.constant(5), {
      id: 'id-hubber',
      claimParams: {},
    }),
  };

  const myScore = Score.scoreBuilderSum(myScoreBuilder);

  console.log(
    `MyScore goes from ${myScore.range.minimalGain} up to ${myScore.range.maximum}`
  );

  const scoring: number = myScore.evaluate({
    'basic-identity-verification': {
      rawCredentialText: basicIdentityVerificationJson,
    },
    'id-hubber': { rawCredentialText: null },
  });
  console.log(`Your Score is: ${scoring}`);

  // you can get the range of the score from:
  const range = myScore.range;
  console.log(`Score goes from ${range.minimalGain} up to ${range.maximum}`);

  const messages = [
    `Your Score is: ${scoring}`,
    `Score goes from ${range.minimalGain} up to ${range.maximum}`,
  ];

  const basicIdentityVerificationScoreFn =
    myScoreBuilder['basic-identity-verification'];
  if (basicIdentityVerificationScoreFn) {
    console.log(
      `Basic Identity Verification goes from ${basicIdentityVerificationScoreFn.range.minimalGain} up to ${basicIdentityVerificationScoreFn.range.maximum}`
    );

    const basicIdentityVerificationScoring: number =
      basicIdentityVerificationScoreFn.evaluate({
        rawCredentialText: basicIdentityVerificationJson,
      });

    console.log(
      `Your Score on Basic Identity Verification is: ${basicIdentityVerificationScoring}`
    );

    messages.push(
      `Basic Identity Verification goes from ${basicIdentityVerificationScoreFn.range.minimalGain} up to ${basicIdentityVerificationScoreFn.range.maximum}`
    );
    messages.push(
      `Your Score on Basic Identity Verification is: ${basicIdentityVerificationScoring}`
    );
  }

  return messages;
}
