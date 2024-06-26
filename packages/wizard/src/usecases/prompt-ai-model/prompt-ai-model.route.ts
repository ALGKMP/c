import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import type { Server } from "../../server";
import { PromptModelSchema } from "../../types/user/openai.types";
import { setupPromptAiModelUseCase } from "./prompt-ai-model.usecase";

export const promptModelRoute = (server: Server) => {
  const getAiModelUseCase = setupPromptAiModelUseCase();

  return createRoute("/prompt-ai-model", {
    method: "POST",
    schema: {
      body: z.object({
        promptData: PromptModelSchema,
        clientId: z.string().uuid(),
      }),
      response: {
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      // todo: create firebase jwt auth prehandler
      // preHandler: async (req, res) => {},
      handler: async (req, res) => {
        try {
          await getAiModelUseCase.execute(req.body);
          return res.status(200).send({ message: "Prompted AI model" });
        } catch (err) {
          console.error(err);
          await res.status(404).send({ message: "Something went wrong." });
        }
      },
    });
  });
};
