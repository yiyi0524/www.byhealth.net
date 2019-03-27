import { bget, bpost } from "./api";

export async function getPersonalInfo() {
  return bpost({
    url: "/api/getPersonalInfo",
    data: {}
  });
}
export default {
  getPersonalInfo
};
