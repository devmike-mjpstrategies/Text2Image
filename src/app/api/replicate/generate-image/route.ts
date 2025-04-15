import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const {
    prompt,
    negative_prompt,
    width,
    height,
    num_inference_steps,
    guidance_scale,
    scheduler,
  } = await request.json();

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          negative_prompt: negative_prompt || "",
          width: width || 512,
          height: height || 512,
          num_outputs: 1,
          num_inference_steps: num_inference_steps || 50,
          guidance_scale: guidance_scale || 7.5,
          scheduler: scheduler || "DPMSolverMultistep",
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
