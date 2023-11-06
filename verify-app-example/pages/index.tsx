'use client';

import React, { useState } from 'react';
import { type VcJsonType, doParseVc, doValidateVc } from '../lib/vc';

type Type = 'parse' | 'validate';

export default function Home() {
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [mode, setMode] = useState<'server' | 'browser'>('browser');
  const [messages, setMessages] = useState<string[]>([]);

  async function doCall(type: Type, jsonType: VcJsonType) {
    setIsCalling(true);
    setMessages(['calling...']);
    let result: string[] = [];
    try {
      if (mode === 'server') {
        result = await doCallVcApi(type, jsonType);
      } else {
        if (type === 'parse') {
          result = await doParseVc(jsonType);
        } else if (type === 'validate') {
          result = await doValidateVc(jsonType);
        }
      }
    } catch (error) {
      result = [`Failed: ${(error as Error).message}`];
    } finally {
      setIsCalling(false);
    }
    setMessages(result);
  }

  async function doCallVcApi(type: Type, jsonType: VcJsonType) {
    const response = await fetch(`/api/vc?type=${type}&jsonType=${jsonType}`);
    if (response.ok) {
      return await response.json();
    }
    return ['Failure!', response.statusText];
  }

  function doSwitchMode() {
    setMode((current) => (current === 'server' ? 'browser' : 'server'));
  }

  const doParse = (jsonType: VcJsonType) => doCall('parse', jsonType);
  const doValidate = (jsonType: VcJsonType) => doCall('validate', jsonType);

  return (
    <>
      <button disabled={isCalling} onClick={doSwitchMode}>
        SwitchMode
      </button>
      <div style={{ margin: '10px 0' }}>{`Current mode is: ${mode}`}</div>
      <div style={{ margin: '10px 0' }}>
        <button disabled={isCalling} onClick={() => doValidate('invalid')}>
          ValidateInvalidVc
        </button>
        <button
          disabled={isCalling}
          onClick={() => doValidate('empty')}
          style={{ marginLeft: '10px' }}
        >
          ValidateEmptyVc
        </button>
        <button
          disabled={isCalling}
          onClick={() => doValidate('valid')}
          style={{ marginLeft: '10px' }}
        >
          ValidateValidVc
        </button>
      </div>
      <div style={{ margin: '10px 0' }}>
        <button disabled={isCalling} onClick={() => doParse('invalid')}>
          ParseInvalidVc
        </button>
        <button
          disabled={isCalling}
          onClick={() => doParse('empty')}
          style={{ marginLeft: '10px' }}
        >
          ParseEmptyVc
        </button>
        <button
          disabled={isCalling}
          onClick={() => doParse('valid')}
          style={{ marginLeft: '10px' }}
        >
          ParseValidVc
        </button>
      </div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </>
  );
}
