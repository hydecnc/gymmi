import { CohereClientV2 } from "cohere-ai";
import { url } from "inspector";
import util from "util";
import { promises as fs } from "fs";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});


const exercisesOptions = [
  "no user",
  "no exercise",
  "squat",
  "sit up",
  "push up",
  "deadlift"
]

const detectExercisePrompt = `Out of the following options, which exercise is the user performing? ${exercisesOptions.join(", ")}`

// For testing
export async function imageToBase64(imagePath: string, format: string = "jpeg") {
  const image = await fs.readFile(imagePath);
  const bufData = Buffer.from(image).toString('base64');
  return `data:image/${format};base64,${bufData}`;
}

/**
 * 
 * @param exerciseImage base64 encoded image of user preforming the exercise.
 */
export async function detectExercise(exerciseImage: string) {
  const response = await cohere.chat({
    model: "c4ai-aya-vision-32b",
    messages: [
      {
        role: "user",
        content: [
          {type: "text", text: detectExercisePrompt},
          {type: "image_url", imageUrl: {url: exerciseImage}},
        ],
      },
    ],
  })
  console.log(util.inspect(response, {colors: true, depth: 20}));
}

export async function getExerciseFeedback(exerciseName: string, actions: string[]) {
  const response = await cohere.chat({
    model: 'command-r-plus-08-2024',
    messages: [
      {
        role: "system",
        content: `The user is preforming the exercise ${exerciseName}. The user should do these actions: ${actions.join(", ")}. Please explain the first step of the actions to the user in a human readable way.`
      },
    ],
  });

  console.log(util.inspect(response, {colors: true, depth: 20}));
}

