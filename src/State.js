export default class State {
  constructor(name, answers, choices, onIntent) {
    this.name     = name;
    this.answers  = answers;
    this.choices  = choices;
    this.onIntent = onIntent;
  }
}
