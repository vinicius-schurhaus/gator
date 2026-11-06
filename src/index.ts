import { setUser, readConfig } from "./config";

function main() {
  setUser("Lane");
  console.log(readConfig());
}

main();
