import { getWord } from "./api.js";

let searchString = "beer";

let wordData = await getWord(searchString);


//Change font



const searchContainer = document.getElementById("search-field");
const wordContainer = document.getElementById("word-container");
const definitionContainer = document.getElementById("definition-container");
const sourceContainer = document.getElementById("source-container");

const changeFont = () => {
    const sansSerif = document.getElementById("sans-serif-option");
    const serif = document.getElementById("serif-option");
    const mono = document.getElementById("mono-option");

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
    const wordContainer = document.getElementById("word-container");
        wordContainer.innerHTML = `
            <div id="word-heading">
              <h1 id="word-title">${wordData.word}</h1>
              <p id="word-phonetic">${wordData.phonetic}</p>
            </div>
            <div id="word-audio">
              <button type="button" id="audio-button" aria-label="Play audio"></button>
            </div>
        `;
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

const updateSource = () => {
    const sourceContainer = document.getElementById("source-container");
    sourceContainer.innerHTML = `
        <h4 id="source-title">Source</h4>
        <a id="source-link" href="${wordData.sourceUrls[0]}" target="_blank">${wordData.sourceUrls[0]}</a>
    `;
}



const showErrorState = (message) => {
    
    // Clear word info
    wordContainer.innerHTML = "";
    definitionContainer.innerHTML = "";
    // Show error message
    wordContainer.innerHTML = `
        <div class="error-state">
            <p class="error-icon">😕</p>
            <h2>No Definitions Found</h2>
            <p class="error-suggestion">Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
        </div>
    `;
}

const searchWord = async () => {
    const searchField = document.getElementById("word-search")
    searchString = searchField.value.trim()

    //Validate input
    if (searchString === "") {
        searchContainer.classList.add("validation-error");
        return;
    }

    //Remove validation error class
    searchContainer.classList.remove("validation-error")

    try {
        wordData = await getWord(searchString)
        searchField.classList.remove("validation-error")
        updateWord()
        updateMeanings()
        sourceContainer.style.display = "block";
        console.log(wordData)
        searchField.value = ""
    } catch (error) {
        console.error(error);
        showErrorState(error.message || "Word not found");
        sourceContainer.style.display = "none";
    }
}
const searchButton = document.getElementById("search-button")

searchButton.addEventListener("click", searchWord)


console.log(wordData)
updateWord()
updateMeanings()
updateSource()
changeFont()