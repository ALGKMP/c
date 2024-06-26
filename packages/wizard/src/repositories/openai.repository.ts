import type {
  ChatCompletionChunk,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
} from "openai/resources/index.mjs";
import type { Stream } from "openai/streaming.mjs";

import { openai } from "@seegull/services/openai";

import type {
  PromptImages,
  PromptModel,
  PromptText,
  PromptTextAndImages,
} from "../types/user/openai.types";

export class OpenAiRepository {
  isPromptText = (prompt: PromptModel): prompt is PromptText => {
    return "text" in prompt;
  };

  isPromptImages = (prompt: PromptModel): prompt is PromptImages => {
    return "imageUrls" in prompt;
  };

  isPromptTextAndImages = (
    prompt: PromptModel,
  ): prompt is PromptTextAndImages => {
    return this.isPromptText(prompt) && this.isPromptImages(prompt);
  };

  async promptLlmText(input: PromptText): Promise<AsyncIterable<string>> {
    const response = await this.initiateLlmTextPrompt(input);
    return this.streamTextFromResponse(response);
  }

  async promptLlmImages(input: PromptImages): Promise<AsyncIterable<string>> {
    const response = await this.initiateLlmImagesPrompt(input);
    return this.streamTextFromResponse(response);
  }

  async promptLlmTextAndImages(
    input: PromptTextAndImages,
  ): Promise<AsyncIterable<string>> {
    const response = await this.initiateLlmTextAndImagesPrompt(input);
    return this.streamTextFromResponse(response);
  }

  private async initiateLlmTextPrompt(
    input: PromptText,
  ): Promise<Stream<ChatCompletionChunk>> {
    const { text } = input;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
      stream: true,
      max_tokens: 1000,
    });

    return response;
  }

  private async initiateLlmImagesPrompt(
    input: PromptImages,
  ): Promise<Stream<ChatCompletionChunk>> {
    const { imageUrls } = input;

    const imagesParts = imageUrls.map((url) => {
      return {
        type: "image_url",
        image_url: { url },
      } satisfies ChatCompletionContentPartImage;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [...imagesParts],
        },
      ],
      stream: true,
      max_tokens: 1000,
    });

    return response;
  }

  private async initiateLlmTextAndImagesPrompt(
    input: PromptTextAndImages,
  ): Promise<Stream<ChatCompletionChunk>> {
    const { text, imageUrls } = input;

    const textPart = {
      type: "text",
      text,
    } satisfies ChatCompletionContentPartText;

    const imagesParts = imageUrls.map((url) => {
      return {
        type: "image_url",
        image_url: { url },
      } satisfies ChatCompletionContentPartImage;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [textPart, ...imagesParts],
        },
      ],
      stream: true,
      max_tokens: 1000,
    });

    return response;
  }

  private async *streamTextFromResponse(
    response: Stream<ChatCompletionChunk>,
  ): AsyncIterable<string> {
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}
