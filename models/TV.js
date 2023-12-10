import Model from "./Model.js";

export default class TV extends Model {
    static table = "televisions.television";
    static primary = ["id"];
}
