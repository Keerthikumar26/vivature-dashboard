export interface Phase5Data {
  sequence: number;
  lat: number;
  lon: number;
  alt: number;
  spray_rate: number;
  flow_rate: number;
  pwm: number;
  duration: number;
  target_zone: string;
  [key: string]: any;
}
