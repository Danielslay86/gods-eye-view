import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caltransStreamUrl } from '../../server/providers/cctv/sources.js';
import { CALTRANS_STREAM_ORIGIN } from '../../server/providers/cctv/constants.js';

const ORIGIN = CALTRANS_STREAM_ORIGIN;
const HOST = new URL(ORIGIN).host;
const VALID = `${ORIGIN}/D4/TV102.stream/playlist.m3u8`;

const cases = [
    // Accepted
    ['valid district stream', VALID, VALID],
    ['single-digit district', `${ORIGIN}/D1/TV001.stream/playlist.m3u8`, `${ORIGIN}/D1/TV001.stream/playlist.m3u8`],
    ['two-digit district', `${ORIGIN}/D12/TV001.stream/playlist.m3u8`, `${ORIGIN}/D12/TV001.stream/playlist.m3u8`],
    ['uppercase host normalizes', `https://${HOST.toUpperCase()}/D4/TV102.stream/playlist.m3u8`, VALID],

    // Not URLs
  ['"Not Reported"', 'Not Reported', ''],
  ['empty string', '', ''],
  ['undefined', undefined, ''],
  ['null', null, ''],
  ['number', 42, ''],
  ['object', {}, ''],

  // Wrong origin
  ['plain http on the right host', `http://${HOST}/D4/TV102.stream/playlist.m3u8`, ''],
  ['different host', 'https://camera.example/D4/TV102.stream/playlist.m3u8', ''],
  ['lookalike host', `https://${HOST}.camera.example/D4/TV102.stream/playlist.m3u8`, ''],
  ['explicit non-default port', `https://${HOST}:8443/D4/TV102.stream/playlist.m3u8`, ''],

  // Credentials
  ['username and password', `https://user:pass@${HOST}/D4/TV102.stream/playlist.m3u8`, ''],
  ['username only', `https://user@${HOST}/D4/TV102.stream/playlist.m3u8`, ''],

  // Bad paths
  ['no district segment', `${ORIGIN}/TV102.stream/playlist.m3u8`, ''],
  ['three-digit district', `${ORIGIN}/D123/TV102.stream/playlist.m3u8`, ''],
  ['lowercase district', `${ORIGIN}/d4/TV102.stream/playlist.m3u8`, ''],
  ['missing .stream suffix', `${ORIGIN}/D4/TV102/playlist.m3u8`, ''],
  ['wrong playlist name', `${ORIGIN}/D4/TV102.stream/index.m3u8`, ''],
  ['extra path segment', `${ORIGIN}/D4/extra/TV102.stream/playlist.m3u8`, ''],
  ['dot segments normalize out of the district', `${ORIGIN}/D4/../TV102.stream/playlist.m3u8`, ''],
];

for (const [label, input, expected] of cases) {
  test(`caltransStreamUrl: ${label}`, () => {
    assert.equal(caltransStreamUrl(input), expected);
  });
}
