
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
    await axios.post('http://localhost/test/make', formData);
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

function questionTypeChanged(selector){

    // console.log(selector.id.match(/[0-9]+/)[0]);
    const containerNumber = parseInt(selector.id.match(/[0-9]+/)[0], 10);
    var containerElement = document.getElementById("container" + containerNumber);
    var paragraphElement = containerElement.lastChild;
    var formDataElement = formData.find(item => item.question_id === containerNumber);
    
    switch(selector.options[selector.selectedIndex].text){
        case "Вопрос с текстовым ответом":
            paragraphErase(paragraphElement);
            var questionAnswer = document.createElement("input");
            questionAnswer.type = "text";
            questionAnswer.required = true;
            questionAnswer.name = "textAnswer";
            questionAnswer.id = "textAnswer" + containerNumber;
            questionAnswer.placeholder = "Введите текст ответа";
            paragraphElement.appendChild(questionAnswer);

            formDataElement.question_type = 'text';
            formDataElement.question_test_answers = [];
            questionAnswer.onchange = (e) => {
              formDataElement.question_text_answer = questionAnswer.value;
              e.preventDefault();
            }
            break;
        case "Вопрос с вариантами ответа":
            paragraphErase(paragraphElement);

            formDataElement.question_type = 'test';
            formDataElement.question_text_answer = '';

            var btnAddTestAnswer = document.createElement("input");
            btnAddTestAnswer.id = 'buttonAddTestAnswer' + containerNumber;
            btnAddTestAnswer.type = "button";
            btnAddTestAnswer.value = "Добавить вариант ответа";
            paragraphElement.appendChild(btnAddTestAnswer);
            btnAddTestAnswer.onclick = () => {
                const questionTestAnswersCounter = getCounterAndIncrement('testAnswers', containerNumber.toString());

                var answerParagraphElement = document.createElement("p");
                answerParagraphElement.id = "answerParagraph" + containerNumber + "-" + questionTestAnswersCounter;
                answerParagraphElement.name = "answerParagraph";
                answerParagraphElement.classList.add("answerParagraph");

                var questionTestAnswer = document.createElement("input");
                questionTestAnswer.type = "text";
                questionTestAnswer.required = true;
                questionTestAnswer.name = "testAnswer";
                questionTestAnswer.id = "testAnswer" + containerNumber + "-" + questionTestAnswersCounter;
                questionTestAnswer.placeholder = "Введите текст варианта";

                TEST_ANSWER_ELEMENT = {
                  test_answer_id: questionTestAnswersCounter,
                  test_answer_text: '',
                  test_answer_is_correct: false
                }
                
                formDataElement.question_test_answers.push(TEST_ANSWER_ELEMENT);
                
                questionTestAnswer.onchange = (e) => {
                  // console.log(`questionTestAnswersCounter = ${questionTestAnswersCounter}`);
                  formDataElement.question_test_answers.find(item => item.test_answer_id === questionTestAnswersCounter).test_answer_text
                  //TEST_ANSWER_ELEMENT.test_answer_text
                   = questionTestAnswer.value;
                  e.preventDefault();
                }

                var checkboxIsCorrectAnswer = document.createElement("input");
                checkboxIsCorrectAnswer.type = "checkbox";
                checkboxIsCorrectAnswer.checked = false;
                checkboxIsCorrectAnswer.name = "checkboxTestAnswer";
                checkboxIsCorrectAnswer.id = "checkboxTestAnswer" + containerNumber + "-" + questionTestAnswersCounter;

                checkboxIsCorrectAnswer.onchange = (e) => {
                  // console.log(`questionTestAnswersCounter = ${questionTestAnswersCounter}`);
                  formDataElement.question_test_answers.find(item => item.test_answer_id === questionTestAnswersCounter).test_answer_is_correct 
                  // TEST_ANSWER_ELEMENT.test_answer_is_correct
                   =  checkboxIsCorrectAnswer.checked ? true : false; 
                  e.preventDefault();
                }

                var btnDeleteTestAnswer = document.createElement("input");
                btnDeleteTestAnswer.id = 'buttonDeleteTestAnswer' + containerNumber + "-" + questionTestAnswersCounter;
                btnDeleteTestAnswer.type = "button";
                btnDeleteTestAnswer.value = "Удалить вариант ответа";
                btnDeleteTestAnswer.onclick = () => {
                    paragraphElement.removeChild(answerParagraphElement);
                    formData.question_test_answers = formData.question_test_answers.filter(
                      item => item.test_answer_id !== questionTestAnswersCounter
                    );
                }

                answerParagraphElement.appendChild(questionTestAnswer);
                answerParagraphElement.appendChild(checkboxIsCorrectAnswer);
                answerParagraphElement.appendChild(btnDeleteTestAnswer);

                paragraphElement.appendChild(answerParagraphElement);
            }
            break;
    }
}


var btnAddQuestion = document.createElement("input");
btnAddQuestion.type = "button";
btnAddQuestion.value = "Добавить вопрос";
btnAddQuestion.onclick = () => {


    var questionsCounter = getCounterAndIncrement("questions");
    var containerElement = document.createElement("div");
    containerElement.name = "container";
    containerElement.id = "container" + questionsCounter;
    containerElement.classList.add("container");

    QUESTION_ELEMENT = {
      question_id: questionsCounter,
      question_type: 'text',
      question_text: '',
      question_text_answer: '',
      question_test_answers: []
    };

    formData.push(QUESTION_ELEMENT);

    //create selector element
    var questionTypeSelector = document.createElement("select");
    questionTypeSelector.setAttribute("onchange", 'questionTypeChanged(this)');
    questionTypeSelector.name = "selector";
    questionTypeSelector.id = "selector" + questionsCounter;
    var testQuestionOption = document.createElement("option");
    testQuestionOption.text = "Вопрос с текстовым ответом";
    testQuestionOption.value = "Вопрос с текстовым ответом";
    var textQuestionOption = document.createElement("option");
    textQuestionOption.text = "Вопрос с вариантами ответа";
    textQuestionOption.value = "Вопрос с вариантами ответа";
    questionTypeSelector.appendChild(testQuestionOption); 
    questionTypeSelector.appendChild(textQuestionOption);
    
    


    // create Question Text element
    var questionText = document.createElement("input");
    questionText.type = "text";
    questionText.required = true;
    questionText.name = "question";
    questionText.id = "question" + questionsCounter;
    questionText.placeholder = "Введите текст вопроса";
    questionText.onchange = (e) => {
      formData.find(item => item.question_id === questionsCounter).question_text = questionText.value;
      // console.log(questionText.value);
      e.preventDefault();
    }


    // create Delete Question button
    var btnDeleteQuestion = document.createElement("input");
    btnDeleteQuestion.type = "button";
    btnDeleteQuestion.value = "Удалить вопрос";
    btnDeleteQuestion.id = "deleteButton" + questionsCounter;
    btnDeleteQuestion.onclick = () => {
        form.removeChild(containerElement);
        formData = formData.filter(item => item.question_id !== questionsCounter);
    }

     
    // create Paragraph Element for question type management
    var paragraphElement = document.createElement("p");
    paragraphElement.name = "paragraph";
    paragraphElement.classList.add("paragraph");
    paragraphElement.id = "paragraph" + questionsCounter;

    //add all elements to the form
    containerElement.appendChild(questionTypeSelector);
    containerElement.appendChild(questionText);
    containerElement.appendChild(btnDeleteQuestion);
    containerElement.appendChild(paragraphElement);
    

    form.appendChild(containerElement);
}


var submitButton = document.createElement('input');
submitButton.type = 'submit';
submitButton.value = 'Принять';


form.appendChild(btnAddQuestion);
form.appendChild(submitButton);


document.getElementsByTagName("body")[0].appendChild(form);
