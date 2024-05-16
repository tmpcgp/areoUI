export const REACT_APP_URL_RESTART_SERVER="http://localhost:5569/restart";
export const REACT_APP_URL_GET_CONFIG="http://localhost:5000/get-config";
export const REACT_APP_URL_PERSIST_CONFIG="http://localhost:5000/persist-config";
export const REACT_APP_URL_CONFIG_DEMO="http://localhost:5000/configd/create";
export const REACT_APP_URL_ACC="http://localhost:5000/account";
export const REACT_APP_URL_LOGIN="http://localhost:5000/login";

export function ok(code) {
  return code >= 200 && code < 300;
}
