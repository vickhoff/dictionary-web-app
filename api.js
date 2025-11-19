const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en";

export const getWord = async (word) => {
    try {
        const url = `${baseUrl}/${word}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`${response.status}: Couldn't fetch word`);
          }
        
          const wordData = await response.json()

          return wordData[0]
    } catch(error) {
        console.error(error);
    }
}