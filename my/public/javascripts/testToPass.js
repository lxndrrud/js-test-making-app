
var form = document.createElement("form");
window.onload = function() {
  form.addEventListener('submit', kek, true);
}

var formData = [
    
]


var kek = async function(event) {
  
  /*
  var formData = new FormData(form);
  formData.append('key1', JSON.stringify({kek: 'kskls'}));
  */
  if (formData){
    event.preventDefault();
    await axios.post('http://localhost/test/pass', formData);
    window.location = '/';
  }
  

}
// для простоты работы с счетчиками
var counters = {
    "questions": 0,
    "testAnswers": {}
};
form.setAttribute('method',"post");
form.setAttribute('action',"/test/make");


function getCounterAndIncrement(query, subquery){
    if (subquery === undefined){
        counters[query] += 1;
        return counters[query];
    }
    if (counters[query][subquery] === undefined){
        counters[query][subquery] = 0;
    }
    counters[query][subquery] += 1;
    return counters[query][subquery];
}

function countElements(query){
    return document.getElementsByName(query).length;
}

function paragraphErase(paragraphElement){
    while(paragraphElement.firstChild){
        paragraphElement.removeChild(paragraphElement.firstChild);
    }
}