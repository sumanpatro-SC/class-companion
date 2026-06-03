import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const fetchSheetCsv = createServerFn({ method: "POST" })
  .inputValidator(z.object({ sheetId: z.string().min(10), gid: z.string().default("0") }))
  .handler(async ({ data }) => {
    const url = `https://docs.google.com/spreadsheets/d/${data.sheetId}/gviz/tq?tqx=out:csv&gid=${data.gid}`;
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false as const, error: `Google responded ${res.status}. Make sure the sheet is shared as "Anyone with the link".` };
    }
    if (/^\s*<(!doctype|html)/i.test(text)) {
      return { ok: false as const, error: 'Sheet is not public. In Google Sheets: Share → General access → "Anyone with the link" → Viewer.' };
    }
    return { ok: true as const, csv: text };
  });