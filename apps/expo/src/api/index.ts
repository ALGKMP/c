import { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";

import { Router } from "@seegull/wizard";

export const api = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create(),
});