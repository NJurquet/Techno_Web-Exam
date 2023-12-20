import Model from "./Model.js";

export default class Vocab extends Model {
    static table = "vocabulary.words";
    static primary = ["id"];
}
