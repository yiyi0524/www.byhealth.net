import { bget, bpost } from "./api";

export async function register() {
  return bpost({
    url: "/api/register",
    data: {},
  });
}
export default {};
