import ObjectData from "./DataType.js";

var State = new ObjectData({
    isState: true
});

/**
 * 
 * @param {string} stateID id cua state
 * @param {*} defaultValue gia tri mac dinh. thuong la {key: value, ...}
 * @returns {ObjectData}
 */
function useState(stateID, defaultValue){
    if(typeof State[stateID] == "undefined") State.__assign__(stateID, defaultValue === undefined ? {}: defaultValue);
    return State[stateID];
}
export default State;
export {
    useState
}