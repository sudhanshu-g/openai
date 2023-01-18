import { Configuration, OpenAIApi } from "openai";

/**
 * ApiHelper is a class that provides an easy way to interact with the OpenAI API.
 * It uses the `openai` npm package to handle the communication with the API.
 *
 * @class ApiHelper
 */
class ApiHelper {
  /**
   * The private property `OPENAI_API_KEY` stores the OpenAI API key.
   * If the `OPENAI_API_KEY` is not found in the environment variable,
   * it uses the default key.
   *
   * @private
   * @property {string} OPENAI_API_KEY
   */
  private OPENAI_API_KEY =
    "<Your API key here>";

  /**
   * The private property `configuration` stores the Configuration object.
   *
   * @private
   * @property {Configuration} configuration
   */
  private configuration: Configuration;

  /**
   * The private property `openai` stores the OpenAIApi object.
   *
   * @private
   * @property {OpenAIApi} openai
   */
  private openai: OpenAIApi;

  /**
   * The constructor of the class creates an instance of the `Configuration` class with the API key.
   * It assigns the configuration to the `configuration` property.
   * Then it creates an instance of the `OpenAIApi` class with the `configuration` property
   * and assigns it to the `openai` property.
   *
   * @constructor
   */
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY || this.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  /**
   * The `getCompletion` method is used to get the completion of a text based on the given prompt.
   * It takes in the prompt, temperature and number of completions as parameters.
   * It returns the completion data from the OpenAI API.
   *
   * @method
   * @async
   * @param {string} prompt - The prompt text.
   * @param {number} temperature - The temperature for the completion.
   * @param {number} [n=5] - The number of completions.
   * @returns {Promise<any>} The completion data from the OpenAI API.
   */
  public async getCompletion(
    prompt: string,
    temperature: number,
    n: number = 5
  ) {
    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      echo: false,
      max_tokens: 1000,
      n: n,
      temperature: temperature,
    });
    return completion.data;
  }

  /**
   * The `getEdit` method is used to get the edited version of a text based on the given instruction.
   * It takes in the input, instruction, and temperature as parameters.
   * It returns the edited text data from the OpenAI API.
   * @method
   * @async
   * @param {string} input - The input text.
   * @param {string} instruction - The instruction for the edit.
   * @param {number} temperature - The temperature for the edit.
   * @returns {Promise<any>} The edited text data from the OpenAI API.
   */
  public async getEdit(
    input: string,
    instruction: string,
    temperature: number
  ) {
    const edit = await this.openai.createEdit({
      input: input,
      instruction: instruction,
      model: "text-davinci-edit-001",
      n: 1,
      temperature: temperature,
    });
    return edit.data;
  }
}

const obj = new ApiHelper();
export default obj as ApiHelper;
