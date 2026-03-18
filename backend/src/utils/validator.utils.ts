import z from "zod";

const jsonifyValue = (val: any) => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        }
        catch {
            return val;
        }
    }
    return val;
}

export const jsonObject = z.preprocess(
    (val) => jsonifyValue(val),
    z.record(z.string(), z.any())
)

export const jsonArray = z.preprocess(
    (val) => jsonifyValue(val),
    z.array(z.any())
)

export type JsonObjectType = z.infer<typeof jsonObject>;
export type JsonArrayType = z.infer<typeof jsonArray>;