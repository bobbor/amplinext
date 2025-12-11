type OptionWithDays = {
  days?: boolean,
  hours: true,
}
type OptionWithoutDays = {
  days: false,
  hours?: boolean,
}
type OptionWithoutSeconds = {
  seconds: true,
  millis?: boolean,
}
type OptionWithSeconds = {
  millis: false,
  seconds?: boolean,
}
type Options =
  | (
    (
      | OptionWithoutDays
      | OptionWithDays
    ) & (
      | OptionWithoutSeconds
      | OptionWithSeconds
    )
  )
  | OptionWithoutDays
  | OptionWithDays
  | OptionWithoutSeconds
  | OptionWithSeconds
;

export function relTime(v: string | undefined): string
export function relTime(v: string | undefined, options: { seconds: false }): string
export function relTime(v: string | undefined, options: { seconds: true, millis: true }): string
export function relTime(v: string | undefined, options: { days: false }): string
export function relTime(v: string | undefined, options: { days: false, hours: false }): string
export function relTime(v: string | undefined, options: { days: false, seconds: false }): string
export function relTime(v: string | undefined, options: { days: false, seconds: true, millis: true }): string
export function relTime(v: string | undefined, options: { days: false, hours: false, seconds: false }): string
export function relTime(v: string | undefined, options: { days: false, hours: false, seconds: true, millis: true }): string
export function relTime(v: string | undefined, options?: {
  seconds?:boolean;
  millis?: true;
  days?: false;
  hours?: boolean;
}) {
  const { hours = true, days = true, millis = false, seconds = true } = options ?? {}
  let d = parseInt(v ?? "0", 10) ?? 0;
  const n = Date.now();
  if(`${d}`.length <= 11) {
    d *= 1000;
  }
  let diff = d - n;
  if (Math.abs(diff) < 100) {
    return 'now';
  }

  return ((_diff: number) => {
    const [suffix, prefix] = _diff < 0 ? ['ago', ''] : ['', 'in'];
    const recurse = (d: number, map: {unit: string, div: number}[]): string[] => {
      d = Math.abs(d)
      if(d <= 0 || map.length === 0) {
        return [];
      }
      if(!map) {
        return [];
      }
      const entry = map.shift();
      if(!entry) {
        return []
      }
      let isLast = false;
      if(!map.length) {
        isLast = true;
      }
      const {div, unit} = entry;
      let r: number;
      if(!isLast) {
        r = d % div;
      } else {
        r = d;
      }
      d -= r;
      d /= div;

      if(r === 0) {
        return recurse(d, map)
      }
      return [
        ...recurse(d, map),
        `${r}${unit}`
      ]
    }

    let relMap: {unit: string, div: number}[] = [
      {unit: "ms", div: 1000},
      {unit: "s", div: 60},
      {unit: "m", div: 60},
    ];
    if(hours) {
      relMap.push({unit: "h", div: 24})
    }
    if(days) {
      relMap.push({unit: 'd', div: 9999})
    }

    const _out = recurse(Math.abs(_diff), relMap);
    if(_out.length > 1 && !millis && _out.at(-1)?.endsWith('ms')) {
      _out.pop();
    }
    if(_out.length > 1 && !seconds && _out.at(-1)?.endsWith('s')) {
      _out.pop();
    }
    if(_out.length > 1) {
      const last = _out.pop();
      return `${prefix} ${_out.join(' ')} and ${last} ${suffix}`.trim();
    }
    return `${prefix} ${_out.join('')} ${suffix}`.trim();
  })(diff);
}