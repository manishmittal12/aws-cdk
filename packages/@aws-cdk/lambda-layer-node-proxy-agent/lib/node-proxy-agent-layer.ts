import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
 */
export class NodeProxyAgentLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layer.zip'), {
        // we hash the package.json (it contains the tools versions) because hashing the zip is non-deterministic
        assetHash: hashFile(path.join(__dirname, '..', 'layer', 'package.json')),
      }),
      description: '/opt/nodejs/node_modules/proxy-agent',
    });
  }
}

function hashFile(fileName: string) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(fileName))
    .digest('hex');
}
