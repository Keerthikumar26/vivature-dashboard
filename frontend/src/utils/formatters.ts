export const formatNumber = (num: any, decimals: number = 3) => {
  if (typeof num !== 'number' || isNaN(num)) return 'N/A';
  return num.toFixed(decimals);
}

export const formatCoordinate = (coord: any) => formatNumber(coord, 6);
