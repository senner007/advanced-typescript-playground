type TrimLeft<T extends string> = T extends ` ${infer First}` ? TrimLeft<`${First}`> : T

type TrimRight<T extends string> = T extends `${infer First} ` ? TrimRight<`${First}`> : T

type Trim<T extends string> =  TrimLeft<TrimRight<T>>

type trimmed = Trim<"   d s  "> // "d s"