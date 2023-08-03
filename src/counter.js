export default class Counter {
  constructor() {
    this.value = 1;
    this.searchRequest = '';
    this.totalNumber = 0;
  }
  get number() {
    return this.totalNumber;
  }

  set number(newNumber) {
    this.totalNumber = newNumber;
  }

  editNumber(newNumber) {
    this.totalNumber = this.totalNumber + newNumber;
  }

  get request() {
    return this.searchRequest;
  }

  set request(newRequest) {
    this.searchRequest = newRequest;
  }

  get cValue() {
    return this.value;
  }

  set cValue(newValue) {
    this.value = newValue;
  }

  increment() {
    this.value += 1;
  }
}