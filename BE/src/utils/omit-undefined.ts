type DefinedProperties<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

// Field opsional dari validator bernilai undefined bila tidak dikirim. Dengan exactOptionalPropertyTypes,
// input Prisma tidak menerima undefined eksplisit, jadi field itu dibuang sebelum dipakai sebagai data update.
export function omitUndefined<T extends object>(input: T): DefinedProperties<T> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as DefinedProperties<T>;
}
