import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-9AjDR6qP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const fetchSheetCsv_createServerFn_handler = createServerRpc({
  id: "4a047136e1661a55d862782880f1d9d7e75e17a0bd7db5d1f054dd839da434cc",
  name: "fetchSheetCsv",
  filename: "src/lib/api/sheet.functions.ts"
}, (opts) => fetchSheetCsv.__executeServer(opts));
const fetchSheetCsv = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  sheetId: stringType().min(10),
  gid: stringType().default("0")
})).handler(fetchSheetCsv_createServerFn_handler, async ({
  data
}) => {
  const url = `https://docs.google.com/spreadsheets/d/${data.sheetId}/gviz/tq?tqx=out:csv&gid=${data.gid}`;
  const res = await fetch(url, {
    redirect: "follow"
  });
  const text = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      error: `Google responded ${res.status}. Make sure the sheet is shared as "Anyone with the link".`
    };
  }
  const preview = text.slice(0, 256);
  if (/(?:<!doctype|<html|<head|<body|<script|<title|<meta)/i.test(preview)) {
    return {
      ok: false,
      error: 'Sheet is not public. In Google Sheets: Share → General access → "Anyone with the link" → Viewer.'
    };
  }
  return {
    ok: true,
    csv: text
  };
});
export {
  fetchSheetCsv_createServerFn_handler
};
