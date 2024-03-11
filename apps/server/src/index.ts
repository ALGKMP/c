import { env } from "env";

import { server } from "@seegull/wizard";

server.listen({ port: env.SERVER_PORT, host: "0.0.0.0" }, () => {
  console.log("server listening");
});
