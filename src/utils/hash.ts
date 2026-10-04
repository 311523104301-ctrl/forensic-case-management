export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function computeTransactionHash(data: string, previousHash: string): Promise<string> {
  return sha256(`${previousHash}:${data}`);
}

export function truncateHash(hash: string, length = 16): string {
  if (hash === 'GENESIS') return 'GENESIS';
  return hash.substring(0, length) + '…';
}

export async function verifyChain(records: Array<{ data: string; previousHash: string; currentHash: string }>): Promise<boolean> {
  for (const record of records) {
    const computed = await computeTransactionHash(record.data, record.previousHash);
    if (computed !== record.currentHash) return false;
  }
  return true;
}
