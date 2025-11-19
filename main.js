import { getWord } from "./api.js";

let searchString = "beer";
//let searchString = "ran";
let wordData = await getWord(searchString);


//Change font

const sansSerif = document.getElementById("sans-serif-option");
const serif = document.getElementById("serif-option");
const mono = document.getElementById("mono-option");

const searchContainer = document.getElementById("search-field");

const changeFont = () => {


    sansSerif.addEventListener("click", () => {
        document.documentElement.style.cssText = "--font-active: var(--font-family-sans)";
    });

    serif.addEventListener("click", () => {
        document.documentElement.style.cssText = "--font-active: var(--font-family-serif)";
    });

    mono.addEventListener("click", () => {
        document.documentElement.style.cssText = "--font-active: var(--font-family-mono)";
    });
}

const updateWord = () => {
    const wordTitle = document.getElementById("word-title");
    wordTitle.textContent = ""
    wordTitle.textContent = wordData.word

    const wordPhonetic = document.getElementById("word-phonetic");
    wordPhonetic.textContent = ""
    wordPhonetic.textContent = wordData.phonetic



    // const synonyms = document.getElementById("synonyms-list")
    // if (noun.synonyms.length === 0){
    //     const noSynonymsItem = document.createElement("li")
    //     noSynonymsItem.textContent = "No existing synonyms"
    //     noSynonymsItem.classList.add("no-synonyms")
    //     synonyms.appendChild(noSynonymsItem)
    //     return;
    // } else {
    //     for(noun) {

    //     }
    // }

}

const createDefinitionList = (array, list) => {
    //Remove all li before adding new
    list.replaceChildren()

    for (const word of array) {
        const listItem = document.createElement("li")
        listItem.textContent = word.definition
        list.appendChild(listItem)
    }
}

const updateMeanings = () => {
    const meaningsWord = {
        noun: wordData.meanings.find(meaning => meaning.partOfSpeech === "noun"),
        verb: wordData.meanings.find(meaning => meaning.partOfSpeech === "verb")
    };

    const definitionContainer = document.getElementById("definition-container");

    // Clear container first - this removes any old sections
    let html = "";

    if (meaningsWord.noun) {
        html += `
        <section id="word-definition-noun">
          <div class="definition-title-container">
            <h2>noun</h2>
            <div class="divider-horizontal"></div>
          </div>
          <h3>Meaning</h3>
          <ul id="meaning-noun" class="meaning">
          </ul>
          <div id="synonyms-container">
            <h3>Synonyms</h3>
            <ul id="synonyms-list">
            </ul>
          </div>
        </section>
        `;
    }

    if (meaningsWord.verb) {
        html += `
        <section id="word-definition-verb">
          <div class="definition-title-container">
            <h2>verb</h2>
            <div class="divider-horizontal"></div>
          </div>
          <h3>Meaning</h3>
          <ul id="meaning-verb" class="meaning">
          </ul>
        </section>
        `;
    }

    // Set the HTML once - this replaces everything, removing old sections
    definitionContainer.innerHTML = html;

    // Now populate the lists if they exist
    if (meaningsWord.noun) {
        const nounList = document.getElementById("meaning-noun");
        const nounDefinitions = meaningsWord.noun.definitions.slice(0, 5);
        createDefinitionList(nounDefinitions, nounList);

        //Create synonymslist
        const synonymsList = document.getElementById("synonyms-list");

        if (meaningsWord.noun.synonyms.length !== 0) {

            for (const synonym of meaningsWord.noun.synonyms) {
                const listItem = document.createElement("li")
                listItem.textContent = synonym
                synonymsList.appendChild(listItem)
            }
        } else {
            const listItem = document.createElement("li")
            listItem.textContent = "No synonyms"
            listItem.classList.add("no-synonyms")
            synonymsList.appendChild(listItem)
        }

    }
    if (meaningsWord.verb) {
        const verbList = document.getElementById("meaning-verb");
        const verbDefinitions = meaningsWord.verb.definitions.slice(0, 5);
        createDefinitionList(verbDefinitions, verbList);
    }

}





  



const searchWord = async () => {
    const searchField = document.getElementById("word-search")
    searchString = searchField.value

    try {
        searchField.classList.remove("validation-error")
        wordData = await getWord(searchString)
        updateWord()
        updateMeanings()
        console.log(wordData)
        searchField.value = ""

        if (searchString === "") {
            searchContainer.classList.add("validation-error")
            throw new Error("Search field can't be empty");
        }

    } catch (error) {
        console.error(error);
    }
    

}
const searchButton = document.getElementById("search-button")

searchButton.addEventListener("click", searchWord)


console.log(wordData)
updateWord()
updateMeanings()
changeFont()