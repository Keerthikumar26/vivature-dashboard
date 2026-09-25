export const calcMean = (data: any[], key: string) => {
  const valid = data.filter(d => typeof d[key] === 'number');
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, curr) => acc + curr[key], 0);
  return sum / valid.length;
}

export const calcMax = (data: any[], key: string) => {
  const valid = data.filter(d => typeof d[key] === 'number');
  if (valid.length === 0) return 0;
  return Math.max(...valid.map(d => d[key]));
}

export const calcMin = (data: any[], key: string) => {
  const valid = data.filter(d => typeof d[key] === 'number');
  if (valid.length === 0) return 0;
  return Math.min(...valid.map(d => d[key]));
}
