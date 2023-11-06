'use client';

import React, { useState } from 'react';
import { doClaimVc, doEvaluateScore, doEvaluateOwnScore } from '../lib/vc';

export type Type = 'claimVc' | 'evaluateScore' | 'evaluateOwnScore';

export default function Home() {
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [mode, setMode] = useState<'server' | 'browser'>('browser');
  const [messages, setMessages] = useState<string[]>([]);

  async function doCall(type: Type) {
    setIsCalling(true);
    setMessages(['calling...']);
    let result: string[] = [];
    try {
      if (mode === 'server') {
        result = await doCallProfilesApi(type);
      } else {
        switch (type) {
          case 'claimVc':
            result = await doClaimVc();
            break;
          case 'evaluateScore':
            result = await doEvaluateScore();
            break;
          case 'evaluateOwnScore':
            result = await doEvaluateOwnScore();
            break;
        }
      }
    } catch (error) {
      result = [`Failed: ${(error as Error).message}`];
    } finally {
      setIsCalling(false);
    }
    setMessages(result);
  }

  async function doCallProfilesApi(type: Type) {
    const response = await fetch(`/api/profiles?type=${type}`);
    if (response.ok) {
      return await response.json();
    }
    return ['Failure!', response.statusText];
  }

  function doSwitchMode() {
    setMode((current) => (current === 'server' ? 'browser' : 'server'));
  }

  return (
    <>
      <button disabled={isCalling} onClick={doSwitchMode}>
        SwitchMode
      </button>
      <div style={{ margin: '10px 0' }}>{`Current mode is: ${mode}`}</div>
      <div style={{ margin: '10px 0' }}>
        <button disabled={isCalling} onClick={() => doCall('claimVc')}>
          ClaimVc
        </button>
        <button
          style={{ marginLeft: '10px' }}
          disabled={isCalling}
          onClick={() => doCall('evaluateScore')}
        >
          EvaluateScore
        </button>
        <button
          style={{ marginLeft: '10px' }}
          disabled={isCalling}
          onClick={() => doCall('evaluateOwnScore')}
        >
          EvaluateOwnScore
        </button>
      </div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </>
  );
}
