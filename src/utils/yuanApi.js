import storage from './storage';
import buffFetch from './fetch';
import { BASE_URL } from './config';
import { Platform, Alert, CameraRoll, } from "react-native";

async function request(url, body) {
  let session = await storage.get('session')
  return buffFetch({
    method: "POST",
    url: BASE_URL + "/api" + url,
    body: JSON.stringify(body),
    headers: {
      session: session,
      'content-type': 'application/json',
    },
  })
}

