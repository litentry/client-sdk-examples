import { NETWORKS, parseVc, validateVc } from '@litentry/vc-sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';

const validVcJson = `{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/security/suites/ed25519-2020/v1"],"id":"0xf4a523e5d2582d67baf9c8af8854e8292f69575d9c1a6cc4c590f9516d3aee98","type":["VerifiableCredential"],"credentialSubject":{"id":"f644ec8210a4c1f9187d43fb7c16c129f1868b9aeb7c27a4fd4641b0938c182d","description":"You've identified at least one account/address in both Web2 and Web3.","type":"Basic Identity Verification","assertions":[{"and":[{"src":"$has_web2_account","op":"==","dst":"true"},{"src":"$has_web3_account","op":"==","dst":"true"}]}],"values":[true],"endpoint":"wss://tee-staging.litentry.io"},"issuer":{"id":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77","name":"Litentry TEE Worker","mrenclave":"7CkjyxujHnnw2BZs42yphfGgdvaqR5on55MbPBHoaBzH"},"issuanceTimestamp":1698226602439,"proof":{"createdTimestamp":1698226602439,"type":"Ed25519Signature2020","proofPurpose":"assertionMethod","proofValue":"fa9654e47353983bd61cfb1132af39f5b92055c125467debfe777ac9e30f248be392427495d125948e295a3dd68da93b8d5ea75ec1cdf633255f7411c138ea00","verificationMethod":"bf6ae6b420f26aae8717dcd7ccc7d0caf543a27dbd5f622ea666e2eff6d1ec77"}}`;
const inValidVcJson =
  '{"@context": "https://www.w3.org/2018/credentials/v1", "type": "VerifiableCredential", "issuer": "https://example.com/issuer", "subject": "did:example:123", "credentialStatus": "https://example.com/status"}';

const vcJson = {
  valid: validVcJson,
  invalid: inValidVcJson,
  empty: '',
};

export type VcJsonType = keyof typeof vcJson;

export async function doValidateVc(type: VcJsonType): Promise<string[]> {
  const api: ApiPromise = await ApiPromise.create({
    provider: new WsProvider(NETWORKS['litentry-staging']),
  });

  const result = await validateVc(api, vcJson[type]);

  // isValid is false if any field value of the result.detail is not true
  if (!result.isValid) {
    // true or error message
    console.log('vcJson: ', result.detail.vcJson);
    // true or error message
    console.log('vcRegistry: ', result.detail.vcRegistry);
    // true or error message
    console.log('vcSignature: ', result.detail.vcSignature);
    // true or error message
    console.log('enclaveRegistry: ', result.detail.enclaveRegistry);

    return ['Failure!', JSON.stringify(result.detail, null, 2)];
  }
  return ['Success!'];
}

export async function doParseVc(type: VcJsonType): Promise<string[]> {
  try {
    // Parse the VC JSON string
    const parsedVc = parseVc(vcJson[type]);

    // Use the parsed VerifiableCredential
    console.log('Parsed Verifiable Credential:', parsedVc);
    return ['Success!', JSON.stringify(parsedVc, null, 2)];
  } catch (error) {
    // Handle parsing errors
    console.error('Error parsing Verifiable Credential:', error.message);
    return ['Failure!', error.message];
  }
}
