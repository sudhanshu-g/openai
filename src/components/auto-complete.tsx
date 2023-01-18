import React, { useState } from "react";
import AutocompleteSearchBox, {
  ISuggestionItem,
} from "./AutocompleteSearchBox";
import ApiHelper from "../services/APIHelper";
import {
  IStackTokens,
  mergeStyleSets,
  PrimaryButton,
  ProgressIndicator,
  Slider,
  Stack,
  TextField,
} from "@fluentui/react";

const AutoComplete = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ISuggestionItem[]>([]);
  const [phrase, setPhrase] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState("");
  const [progress, setProgress] = useState(false);
  const [temperature, setTemperature] = useState(0);

  const getSuggestionItem = (choice: string) => {
    let suggestion: ISuggestionItem = {
      getSuggestionItem(query) {
        let parts = choice.split("\n\n");
        return (
          <div>
            <h4>{parts[0]}?</h4>
            <div>{parts[1]}</div>
          </div>
        );
      },
      getSearchText() {
        return "";
      },
    };
    return suggestion;
  };
  const handleInputChange = (
    event?: React.ChangeEvent<HTMLInputElement>,
    newValue?: string
  ) => {
    if (newValue) {
      setProgress(true);
      ApiHelper.getCompletion(newValue, temperature).then((result) => {
        let items = result.choices
          .filter((choice) => choice != undefined)
          .map((choice) => choice.text || "")
          .map((choice) => {
            return getSuggestionItem(choice);
          });
        setSuggestions(items);
        setProgress(false);
      });
    }
  };
  const handleSuggestionClick = (suggestion: string | ISuggestionItem) => {};

  const searchStyles = mergeStyleSets({
    searchBox: {
      maxWidth: "500px",
      minWidth: "400px",
      display: "flex",
      margin: "auto",
      alignSelf: "center",
      alignContent: "center",
    },
    textArea: {
      margin: "10px",
      width: "50%",
    },
    textBox: {
      margin: "10px",
      width: "30%",
    },
    container: {
      padding: "10px",
    },
    horizRow: {
      verticalAlign: "bottom",
      display: "flex",
      justifyContent: "center",
    },
    slider: {
      margin: "10px",
      width: "30%",
    },
  });

  const onSubmit = () => {
    setProgress(true);
    ApiHelper.getCompletion(`${phrase}\n ${instruction}`, temperature,1).then((result) => {
      setOutput(result.choices[0].text || "no output");
      setProgress(false);
    });
  };
  const stackTokens: IStackTokens = {
    childrenGap: 5,
  };

  return (
    <div className={searchStyles.container}>
      <label>AutoComplete</label>
      <AutocompleteSearchBox
        onChange={handleInputChange}
        onSuggestionClicked={handleSuggestionClick}
        suggestions={suggestions}
        debounceTime={500}
        className={searchStyles.searchBox}
        inProgress={progress && input != undefined}
      ></AutocompleteSearchBox>
      {/* <ul>
        {suggestions.map((suggestion) => (
          <li>{suggestion.getSuggestionItem()}</li>
        ))}
      </ul> */}
      <Stack>
        <Stack horizontal>
          <TextField
            label="Input Phrase"
            multiline
            autoAdjustHeight
            className={searchStyles.textArea}
            onChange={(e, text) => setPhrase(text || "")}
            value={phrase}
          />
          <TextField
            label="Output Phrase"
            multiline
            autoAdjustHeight
            className={searchStyles.textArea}
            readOnly
            value={output}
          />
          <br></br>
        </Stack>

        <div className={searchStyles.horizRow}>
        <Slider
            className={searchStyles.slider}
            label="Temperature"
            max={1}
            min={0}
            step={0.1}
            value={temperature}
            showValue
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(val) => setTemperature(val)}
          />
          <TextField
            label="Edit Instruction"
            className={searchStyles.textBox}
            onChange={(e, text) => setInstruction(text || "")}
          />
          
          <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
        </div>
        {progress && <ProgressIndicator></ProgressIndicator>}
      </Stack>
    </div>
  );
};

export default AutoComplete;
