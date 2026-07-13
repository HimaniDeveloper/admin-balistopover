import { NextResponse } from "next/server";

export const success = (data, options) => {
  const status = options?.status || 200;
  const headers = options?.headers || {};
  const response = NextResponse.json({ success: true, data }, { status });
  
  Object.keys(headers).forEach((key) => {
    response.headers.append(key, headers[key]);
  });
  
  return response;
};

export const error = (message, options) => {
  const status = options?.status || 500;
  const headers = options?.headers || {};
  const response = NextResponse.json({ success: false, message }, { status });
  
  Object.keys(headers).forEach((key) => {
    response.headers.append(key, headers[key]);
  });

  return response;
};
