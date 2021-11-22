export const PEER_ID_LENGTH = 53;

export const isValidPeerId = (v: string): boolean => {
  return (
    v.startsWith("16Uiu2HA") &&
    v.length === PEER_ID_LENGTH &&
    /[a-zA-Z0-9]*/.test(v)
  );
};
